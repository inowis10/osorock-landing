import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import CryptoJS from 'crypto-js';
import axios from 'axios';

dotenv.config();

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

// Rate Limiting: 5 solicitudes por IP cada 10 minutos
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.' }
});

// Encriptación simple AES-256
const encryptData = (text) => {
    if (!text) return '';
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
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

            // Enviar a n8n con API Key interna (no expuesta al cliente)
            const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
                name,
                email: encryptedEmail,
                phone: encryptedPhone,
                newsletter,
                submittedAt: new Date().toISOString()
            }, {
                headers: {
                    'X-Simi-Key': process.env.N8N_API_KEY
                }
            });

            res.status(200).json({ status: 'success', message: 'Datos recibidos correctamente.' });
        } catch (error) {
            console.error('Error al procesar el lead:', error.message);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
);

app.listen(PORT, () => {
    console.log(`Servidor de seguridad corriendo en puerto ${PORT}`);
});
