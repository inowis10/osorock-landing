import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { sendErrorAlert, sendStartupNotification, sendShutdownNotification } from './utils/notifier.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de Seguridad
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10kb' })); // Límite de payload

// Rate Limiting: Restaurado con límite alto para pruebas (100 solicitudes cada 10 min)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validación de configuración al inicio
if (!process.env.ENCRYPTION_KEY) {
    console.error('❌ FATAL: ENCRYPTION_KEY no definida en el archivo .env');
    process.exit(1);
}

// Encriptación simple AES-256
const encryptData = (text) => {
    try {
        if (!text) return '';
        const key = process.env.ENCRYPTION_KEY;
        if (!key) throw new Error('Llave de encriptación no configurada');

        return CryptoJS.AES.encrypt(text, key).toString();
    } catch (error) {
        console.error('❌ Error en encriptación:', error.message);
        return 'ERR_ENCRYPTION_FAILED';
    }
};

// Endpoint /api/leads
app.post('/api/leads',
    limiter,
    [
        body('name').trim().notEmpty().escape(),
        body('email').isEmail().normalizeEmail(),
        body('phone').matches(/^\+?[\d\s-]{9,15}$/).escape(),
        body('turnstileToken').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, turnstileToken, website, newsletter } = req.body;

        // Honeypot check
        if (website && website !== '') {
            console.log('Bot detectado vía Honeypot');
            return res.status(200).json({ status: 'success', message: 'Bot detected, fake success sent.' });
        }

        // Validación de Turnstile (Opcional si aún no tienes las llaves, pero aquí está la lógica)
        /*
        const turnstileVerify = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken
        });
        if (!turnstileVerify.data.success) {
          return res.status(403).json({ error: 'Falla en verificación de seguridad (Turnstile).' });
        }
        */

        try {
            // Encriptar datos sensibles antes de enviar a n8n
            const encryptedEmail = encryptData(email);
            const encryptedPhone = encryptData(phone);

            // Enviar a n8n con manejo de errores para que el servidor no muera si n8n no escucha
            try {
                const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
                    name,
                    email: encryptedEmail,
                    email_plain: email,
                    phone: encryptedPhone,
                    phone_plain: phone, // 👈 Enviamos versión legible solo para tu Google Sheet
                    newsletter,
                    submittedAt: new Date().toISOString()
                }, {
                    headers: {
                        'X-Simi-Key': process.env.N8N_API_KEY
                    }
                });
                console.log(`✅ n8n respondió con status: ${n8nResponse.status}`);
            } catch (n8nError) {
                console.error('⚠️ Error avisando a n8n (puede que no esté "escuchando"):', n8nError.message);
                // No lanzamos el error para que la respuesta al cliente sea exitosa
            }

            // 🎁 Los stickers se gestionarán en n8n directamente desde el webhook principal
            // el cual ya incluye name y email_plain.

            res.status(200).json({ status: 'success', message: 'Datos recibidos correctamente.' });
        } catch (error) {
            console.error('❌ ERROR AL PROCESAR LEAD:', error.message);
            console.error('STACK:', error.stack);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
);

// Health check endpoint (para monitoreo)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Iniciar servidor con notificación
app.listen(PORT, async () => {
    console.log(`Servidor de seguridad corriendo en puerto ${PORT}`);
    await sendStartupNotification();
});

// 🚨 Manejo de errores globales
process.on('uncaughtException', async (error) => {
    console.error('💥 Error crítico no capturado:', error);
    await sendErrorAlert('Error crítico no capturado', {
        location: 'Global Exception Handler',
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('💥 Promesa rechazada no manejada:', reason);
    await sendErrorAlert('Promesa rechazada no manejada', {
        location: 'Global Promise Rejection',
        error: reason?.message || String(reason)
    });
});

// Notificación al detener el servidor
process.on('SIGTERM', async () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    await sendShutdownNotification();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT recibido, cerrando servidor...');
    await sendShutdownNotification();
    process.exit(0);
});
