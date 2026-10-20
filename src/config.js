// Variable VITE_*: es PÚBLICA, se incluye en el bundle. Sólo configuración, nunca secretos.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
