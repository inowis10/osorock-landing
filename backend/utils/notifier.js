import axios from 'axios';

/**
 * Envía una alerta de error a n8n
 */
export const sendErrorAlert = async (errorMessage, errorDetails = {}) => {
    try {
        await axios.post(process.env.N8N_ALERTS_WEBHOOK_URL, {
            type: 'error',
            message: errorMessage,
            details: errorDetails,
            timestamp: new Date().toISOString()
        });
        console.log('✅ Alerta de error enviada a n8n');
    } catch (error) {
        console.error('⚠️ No se pudo avisar a n8n del error:', error.message);
    }
};

/**
 * Notificación de inicio de servidor
 */
export const sendStartupNotification = async () => {
    try {
        await axios.post(process.env.N8N_ALERTS_WEBHOOK_URL, {
            type: 'startup',
            message: '🚀 Servidor Backend Iniciado',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Notificación de inicio enviada a n8n');
    } catch (error) {
        // Silencioso al inicio para evitar bucles de error
    }
};

/**
 * Notificación de cierre de servidor
 */
export const sendShutdownNotification = async () => {
    try {
        await axios.post(process.env.N8N_ALERTS_WEBHOOK_URL, {
            type: 'shutdown',
            message: '🛑 Servidor Backend Detenido',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Notificación de cierre enviada a n8n');
    } catch (error) {
        console.error('⚠️ Error en notificación de cierre');
    }
};

// Nota: La función sendStickerPack ha sido consolidada en el webhook principal en server.js
// para simplificar el flujo y asegurar que n8n reciba los datos correctamente.
