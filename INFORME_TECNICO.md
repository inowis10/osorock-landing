# 📄 Informe Técnico: Arquitectura y Desarrollo – Landing Page Pro

Este documento detalla la estructura tecnológica, lenguajes y herramientas utilizadas en la construcción de la plataforma de captura y automatización de leads.

---

## 1. Concepto General
La plataforma es una **Single Page Application (SPA)** de alto rendimiento, diseñada para la captura de datos (leads) y su procesamiento automático en tiempo real. Se basa en una arquitectura de desacoplamiento entre el cliente (Frontend), el servidor (Backend) y la capa de automatización (n8n).

---

## 2. Tecnologías del Frontend
El lado del cliente se enfoca en la velocidad de carga y una experiencia de usuario (UX) premium.

*   **Vite**: Utilizado como herramienta de construcción (build tool) para garantizar tiempos de desarrollo y carga ultrarrápidos.
*   **React.js**: Biblioteca principal para la construcción de una interfaz basada en componentes reutilizables y reactivos.
*   **CSS Moderno**: Uso de variables CSS, Flexbox y Grid para un diseño **Full Responsive** (adaptable a móviles, tablets y desktop).
*   **Framer Motion / Animaciones**: Implementación de micro-interacciones y efectos de entrada para aumentar el "engagement" del usuario.
*   **Validación de Formularios**: Lógica personalizada en Javascript para asegurar la integridad de los datos antes del envío.

---

## 3. Tecnologías del Backend
El servidor actúa como un puente inteligente y procesador de datos.

*   **Node.js**: Entorno de ejecución para el lado del servidor, elegido por su escalabilidad y manejo eficiente de procesos asíncronos.
*   **Express.js**: Framework minimalista para la gestión de rutas API y middleware.
*   **Axios**: Cliente HTTP utilizado para la comunicación robusta con servicios de terceros (Webhooks).
*   **Env Management**: Uso de `dotenv` para la configuración dinámica del entorno (Producción/Desarrollo).
*   **CORS (Cross-Origin Resource Sharing)**: Configuración específica para permitir la comunicación segura entre el dominio del frontend y el backend.

---

## 4. Capa de Automatización (Workflow)
La lógica de negocio pesada se delega a un motor de automatización externo para facilitar el mantenimiento y la escalabilidad.

*   **n8n (Orquestador)**: Gestiona el flujo de trabajo una vez que se recibe un lead.
*   **Google Sheets Integration**: Persistencia de datos en la nube para gestión comercial.
*   **Gmail Service**: Motor de envío de correos electrónicos transaccionales con plantillas HTML dinámicas.
*   **Webhooks**: Puntos de entrada (endpoints) que permiten la ejecución instantánea del flujo al momento del registro.

---

## 5. Flujo de Datos Técnico
1.  **Captura**: El usuario interactúa con la interfaz en React.
2.  **Procesamiento**: El backend recibe el JSON, valida los campos y prepara el payload.
3.  **Disparo**: Se ejecuta un `POST` request hacia n8n.
4.  **Distribución**: n8n recibe la señal y ejecuta en paralelo el guardado en Excel y el envío del sticker pack por email.

---

## 6. Características Destacadas
*   **Modularidad**: Cada parte del sistema (Web, API, Automatización) se puede actualizar de forma independiente.
*   **Baja Latencia**: Optimización de peticiones para una respuesta casi instantánea al usuario final.
*   **Escalabilidad**: El sistema está preparado para añadir nuevos canales (como WhatsApp) sin necesidad de reescribir el código base.

---
*Documentación técnica generada el 18 de enero de 2026*
