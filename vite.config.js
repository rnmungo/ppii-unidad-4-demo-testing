import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Cabeceras de seguridad (sección 13 del material).
// Se aplican en `npm run preview` (build de producción). En `npm run dev`
// no se usa CSP porque el servidor de desarrollo inyecta scripts inline (HMR).
const cabecerasSeguridad = {
  // CSP: sólo scripts/estilos propios, nada de handlers inline (bloquea onerror="...").
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data: https:",
    "connect-src 'self' http://localhost:3001",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; "),
  // Clickjacking: no permitir que otro sitio incruste la app en un frame.
  "X-Frame-Options": "DENY",
  // Evitar que el navegador "adivine" tipos MIME.
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // HSTS sólo tiene efecto sobre HTTPS; se deja como referencia de producción.
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
};

export default defineConfig({
  plugins: [react()],
  preview: {
    headers: cabecerasSeguridad
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: false,
    clearMocks: true
  }
});
