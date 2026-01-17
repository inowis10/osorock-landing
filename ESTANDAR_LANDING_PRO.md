# 🚀 Estándar Maestro para Landing Pages (Simi-Power)

Este documento contiene los "Prompts Maestros" para replicar los estándares profesionales alcanzados en este proyecto. Puedes usarlos al iniciar nuevas landings.

---

## 🎨 Sección 1: Front-End & UX (Estándar Simi-Premium)

### Instrucción de Diseño:
"Diseña la interfaz de esta landing page siguiendo un estándar de alta gama y micro-interacciones fluidas. Aplica los siguientes lineamientos:

**1. Estética y Diseño de Sistema:**
*   **Glassmorphism Pro:** Usa contenedores con fondos semi-transparentes (`rgba(255, 255, 255, 0.1)`), bordes sutiles y un efecto de desenfoque (`backdrop-filter: blur(16px)`).
*   **Gradients Dinámicos:** Los botones y elementos destacados deben usar gradientes lineales (ej: Cyan a Púrpura) con animaciones de movimiento (`gradient-flow`).

**2. Micro-Animaciones:**
*   **Entrada Suave:** Los elementos principales deben aparecer con un `fadeInUp` suave al cargar la página.
*   **Efecto de Flotado:** Las imágenes decorativas deben tener una animación de levitación sutil (`float`) constante.
*   **Hover Avanzado:** Los iconos y botones deben reaccionar al cursor con escalado suave (`scale`), cambios de brillo y sombras de neón (`drop-shadow`).

**3. Feedback y Comportamiento:**
*   **Validación Viva:** Implementa validación en tiempo real. Los campos deben cambiar de color de borde (Rojo/Verde) instantáneamente según la validez del dato (solo después de ser 'touched').
*   **Loading States:** Los botones de acción deben mostrar un **Spinner animado** interno al ser presionados.
*   **Success UX:** Reemplaza alertas por una pantalla de éxito integrada con un icono animado y botón de retorno con scroll suave."

---

## 🏛️ Sección 2: Arquitectura y Composición (Estándar Simi-Base)

### Instrucción de Estructura:
"Construye una landing page interactiva utilizando **React + Vite** con el siguiente estándar:

**1. Layout:**
*   **Composición Dual:** Tarjeta central (`main-card`) con formulario a la izquierda e imagen a la derecha.
*   **Mobile-First:** Apilado vertical en pantallas móviles, con la imagen arriba del formulario.

**2. Componentes:**
*   **Social Section:** Iconos circulares con efectos de flotación individual y resplandor de marca al hacer hover.
*   **Checkboxes Custom:** Checkboxes estilizados con animaciones de 'pop'.
*   **Gestión de Estados:** Controlar la UI mediante estados `idle`, `submitting` y `success`."

---

## 🛡️ Sección 3: Seguridad de Nivel Profesional (Estándar Simi-Safe)

### Instrucción de Seguridad:
"Implementa una arquitectura de **Backend Intermedio (Node.js/Express)** para proteger la lógica de negocio:

**1. Backend Proxy:**
*   **Cero Secretos:** No expongas URLs de webhooks ni API Keys en el frontend.
*   **Security Headers:** Implementa `Helmet` y configura `CORS` estricto.

**2. Protección Anti-Ataque:**
*   **Rate Limiting:** Máximo 5 solicitudes cada 10 minutos por IP.
*   **Honeypot:** Campo invisible para bots que invalida la petición si es completado.
*   **Sanitización:** Validar y limpiar todos los datos con `express-validator`.

**3. Privacidad:**
*   **Encriptación AES-256:** Encriptar `email` y `phone` en el backend antes de enviarlos a n8n."
