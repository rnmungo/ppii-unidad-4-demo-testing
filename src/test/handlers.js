import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "../config.js";

// Misma URL que usa la app: si cambia el puerto en .env, los mocks lo siguen.
export const URL_PRODUCTOS = `${API_BASE_URL}/productos`;

export const handlers = [
  http.get(URL_PRODUCTOS, () => {
    return HttpResponse.json([
      { id: "1", nombre: "Tomate", precio: 1500, stock: 8, url: "https://ejemplo.com/tomate" },
      { id: "2", nombre: "Lechuga", precio: 900, stock: 0, url: "https://ejemplo.com/lechuga" }
    ]);
  })
];
