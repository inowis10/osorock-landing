# 🔗 Guía de Integración: Landing Page React + VTEX

Este informe confirma que **SÍ es posible** integrar esta landing page con VTEX. A continuación, se detallan los 3 métodos recomendados para el equipo técnico.

---

## 🚀 Opción 1: VTEX IO (Componente Nativo)
Es la mejor opción si la tienda usa **VTEX IO**. Permite que la landing se comporte como una pieza original del sitio.

**¿Cómo deben hacerlo?**
1. **App de VTEX:** Crear una aplicación (`vtex init`).
2. **Carpeta /react:** Copiar los estilos de `index.css` y la lógica de `App.jsx` dentro de los componentes de la app.
3. **Store Framework:** Declarar el componente en `interfaces.json` para que pueda ser arrastrado como un "bloque" desde el Site Editor.

---

## 🌐 Opción 2: Subdominio Independiente (Recomendado)
Es la opción **más rápida y segura**. No toca el código de la tienda principal y evita conflictos de librerías.

**¿Cómo deben hacerlo?**
1. **Host Externo:** Desplegar la landing en un servicio como Vercel o Netlify (usando el código actual).
2. **CNAME:** El equipo de TI debe crear un registro CNAME (ej: `promos.drsimichile.cl`) apuntando al host elegido.
3. **CORS:** Configurar el backend para permitir peticiones desde el nuevo dominio.

---

## 🖼️ Opción 3: iFrame en CMS Legacy
Si la tienda usa el sistema antiguo de carpetas (Portal CMS).

**¿Cómo deben hacerlo?**
1. **Build:** Ejecutar `npm run build` para generar los archivos estáticos.
2. **Server:** Subir esos archivos a un servidor corporativo o CDN.
3. **Control:** En el layout de VTEX, insertar un control de iFrame:
   ```html
   <iframe src="https://tu-servidor.com/landing-simi" width="100%" height="1000px" frameborder="0"></iframe>
   ```

---

## 🛡️ Seguridad y Variables
Independientemente del método, el equipo de TI debe configurar las variables de entorno (`.env`) en el servidor donde corra el **Backend Guardián**:
- `N8N_WEBHOOK_URL`
- `ENCRYPTION_KEY`
- `N8N_API_KEY`

---
> [!IMPORTANT]
> **Conclusión:** La arquitectura decouple (separada) que hemos construido permite que la landing sea extremadamente flexible para VTEX, garantizando que no afecte la velocidad de carga del checkout o del catálogo principal.
