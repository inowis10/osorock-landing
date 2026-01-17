# 🤖 Guía Paso a Paso: Automatización de WhatsApp (Meta + n8n)

Esta guía te llevará desde cero hasta tener tu primer mensaje de stickers funcionando.

---

## 🟦 Fase 1: Configuración en Meta Developers

### 1. ¿Cómo entro?
Usa tu cuenta de **Facebook personal** (la que usas siempre). Meta vincula las apps de desarrollador a perfiles reales para evitar spam.
1.  Ve a [developers.facebook.com](https://developers.facebook.com/).
2.  Haz clic en **"Log In"** (arriba a la derecha).
3.  Si es tu primera vez, dale a **"Get Started"** para registrarte como developer (solo toma 1 minuto).

### 2. Crear la "App"
1.  En el panel principal, haz clic en **"Create App"**.
2.  Selecciona **"Other"** y luego **"Business"**.
3.  **Display Name:** Ponle `SimiStickers_Landing`.
4.  **App Contact Email:** Tu correo de trabajo.

### 3. Activar WhatsApp
1.  En el Dashboard de tu App, busca **"WhatsApp"** en la lista de productos y dale a **"Set up"**.
2.  Te pedirá seleccionar un **Business Account**. Si no tienes uno, Meta te creará uno automáticamente.

### 4. Obtener los "Tokens" (¡Muy importante!)
En el menú de la izquierda, ve a **WhatsApp** > **API Setup**. Ahí verás:
-   **Temporary access token**: Copia esta clave (dura 24h, luego te enseñaré a hacerla permanente).
-   **Phone number ID**: Cópialo.
-   **WhatsApp Business Account ID**: Cópialo.

### 5. Autorizar tu teléfono
En esa misma pantalla, busca **"Step 5: Send messages with the API"**.
1.  Don't a dice **"To"**, selecciona tu número (tienes que agregarlo y verificarlo con un código que te llegará por mensaje).

---

## 🟩 Fase 2: Configuración en n8n

### 1. Conectar n8n con Meta
1.  En n8n, crea una nueva **Credential**.
2.  Busca **"WhatsApp Cloud API"**.
3.  Pega el **Access Token**, el **Phone Number ID** y el **Business Account ID** que copiaste de Meta.

### 2. El Flujo de Trabajo (Workflow)
Necesitas 2 nodos principales:
1.  **Webhook Node:** El que ya tenemos, que recibe los datos de tu landing page.
2.  **WhatsApp Node:** 
    *   Conéctalo después del Webhook.
    *   Selecciona la acción **"Send Text Message"**.
    *   **Recipient:** Arrastra el campo `phone` que viene del Webhook.
    *   **Message:** Pega el texto de bienvenida 👋 ¡Bienvenido/a!...

---

## 🟨 Fase 3: La Entrega de Stickers

Como los stickers son archivos, la lógica es:
1.  El primer mensaje pregunta: *"¿Quieres tus stickers?"*.
2.  Crea un nuevo nodo **WhatsApp** (Trigger) en n8n que escuche cuando alguien responda.
3.  Si la respuesta es "SÍ", agregas otro nodo de **WhatsApp** con la acción **"Send Media"** y pones el link de tu archivo de stickers.

---

¿Quieres que te ayude a configurar el primer nodo de WhatsApp en tu n8n ahora? 🚀🤖🛡️
