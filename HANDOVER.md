# 📦 Guía de Entrega y Despliegue: Landing Page Dr. Simi

Esta guía detalla los pasos técnicos para que el equipo de IT/Hosting pueda desplegar la aplicación de forma segura y eficiente.

---

## 🛠️ 1. Preparación del Proyecto
La aplicación está construida con **React + Vite**. Para generar la versión que se sube al servidor (hosting), existen dos caminos:

### Opción A (Recomendada): Despliegue desde Repositorio (Git)
Si IT usa herramientas como Vercel, Netlify, o un servidor con CI/CD:
1.  Entregar el acceso al repositorio de Git.
2.  Comando de construcción: `npm run build`
3.  Carpeta de salida: `dist`

### Opción B: Entrega de Carpeta "Build" (Estática)
Si el hosting es tradicional (ej: un servidor Apache/Nginx con FTP):
1.  Tú debes ejecutar el comando `npm run build` en tu terminal.
2.  Se generará una carpeta llamada `dist`.
3.  **Entrega solo el contenido de la carpeta `dist`** al equipo de IT.

## 🛒 1.5 Integración con VTEX
Dado que la plataforma corporativa es VTEX, existen tres caminos para integrar esta landing page de React:

### Opción A: Portar a VTEX IO (Nativo)
Si IT utiliza **VTEX IO**, pueden integrar el código React directamente:
1.  **Directorio `/react`**: Colocar los componentes de `App.jsx` y los estilos de `index.css` dentro de una aplicación de VTEX IO.
2.  **Manifest**: Asegurarse de tener los builders `store` y `react` activos.
3.  **Blocks**: Definir la landing como un "custom block" para usarlo en el Site Editor.

### Opción B: Despliegue en Subdominio (Recomendado por Velocidad)
Mantener la landing page independiente y vincularla a la marca:
1.  **Hosting**: Subir la landing a Vercel/Netlify (donde configuramos la seguridad .env).
2.  **Dominio**: Configurar un CNAME como `promos.drsimichile.cl` apuntando al hosting elegido.
3.  **Ventaja**: No afecta el rendimiento ni el código base de la tienda principal.

### Opción C: iFrame en CMS Portal (Legacy)
Si usan el CMS de carpetas antiguo:
1.  Generar el `dist` (`npm run build`).
2.  Subir los archivos al servidor de la empresa o CDN.
3.  Insertar un control de iFrame en el Layout de VTEX apuntando a la URL del index.

## 🛡️ 2. Configuración de Seguridad (Punto Crítico)
Para que la seguridad funcione en el dominio real, el equipo de IT debe configurar las **Variables de Entorno** en el servidor de hosting:

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `VITE_N8N_WEBHOOK_URL` | `https://tusubdominio.n8n.cloud/...` | URL real de n8n |
| `VITE_SIMI_SECRET_KEY` | `SimiSecure_2026_Stickers_Safe` | La "llave" de acceso |

> [!IMPORTANT]
> **No subir el archivo .env al hosting.** Estas variables deben configurarse en el panel de control del hosting (ej: Dashboard de Vercel > Settings > Environment Variables).

---

## ⚙️ 3. Ajustes en el Lado del Servidor (n8n)
El equipo de IT o tú deben actualizar n8n cuando la página esté en el aire:
1.  **CORS:** Cambiar `http://localhost:5173` por el dominio final (ej: `https://drsimichile.cl`).
2.  **HTTPS:** Asegurarse de que el hosting de la landing tenga SSL activo.

---

## 📂 Contenido del Paquete de Entrega
Para una entrega profesional a IT, envía:
1.  **Código Fuente:** El archivo ZIP del proyecto (excluyendo `node_modules`).
2.  **Documentación:** Este archivo `HANDOVER.md` y el `IDEAS.md`.
3.  **Credenciales:** La llave secreta de autenticación.
