// API mínima (sin dependencias) para el catálogo.
// Objetivo didáctico: el servidor valida los datos aunque el formulario de React
// ya lo haga, porque cualquiera puede enviar una petición HTTP manual.
import { createServer } from "node:http";

const PUERTO = 3001;
const ORIGENES_PERMITIDOS = ["http://localhost:5173", "http://localhost:4173"];
const DEMORA_MS = 600; // para que se vea el estado "Cargando..."

let productos = [
  { id: "1", nombre: "Tomate", precio: 1500, stock: 8, url: "https://es.wikipedia.org/wiki/Solanum_lycopersicum" },
  { id: "2", nombre: "Lechuga", precio: 900, stock: 0, url: "https://es.wikipedia.org/wiki/Lactuca_sativa" },
  // Dato "malicioso" que llega desde la API: React lo muestra como texto.
  { id: "3", nombre: "Pimiento <img src=x onerror=alert('XSS')>", precio: 2100, stock: 3, url: "https://es.wikipedia.org/wiki/Capsicum_annuum" },
  // URL con esquema peligroso: la tarjeta no debe convertirla en enlace.
  { id: "4", nombre: "Zanahoria", precio: 700, stock: 12, url: "javascript:alert('robado')" }
];

function validarProducto(datos) {
  const errores = [];
  const nombre = typeof datos?.nombre === "string" ? datos.nombre.trim() : "";
  if (nombre.length < 1 || nombre.length > 60) errores.push("El nombre es obligatorio (máx. 60 caracteres).");
  if (typeof datos?.precio !== "number" || !Number.isFinite(datos.precio) || datos.precio <= 0) {
    errores.push("El precio debe ser un número mayor que cero.");
  }
  return { errores, producto: { nombre, precio: datos?.precio, stock: 10 } };
}

function responder(res, estado, cuerpo) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
  res.end(cuerpo === undefined ? "" : JSON.stringify(cuerpo));
}

function leerCuerpo(req, limite = 10_000) {
  return new Promise((resolve, reject) => {
    let datos = "";
    req.on("data", parte => {
      datos += parte;
      if (datos.length > limite) reject(new Error("Cuerpo demasiado grande"));
    });
    req.on("end", () => resolve(datos));
  });
}

createServer(async (req, res) => {
  const origen = req.headers.origin;
  if (ORIGENES_PERMITIDOS.includes(origen)) {
    res.setHeader("Access-Control-Allow-Origin", origen);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") return responder(res, 204);

  await new Promise(r => setTimeout(r, DEMORA_MS));

  if (req.url === "/productos" && req.method === "GET") {
    return responder(res, 200, productos);
  }

  if (req.url === "/productos" && req.method === "POST") {
    let datos;
    try {
      datos = JSON.parse(await leerCuerpo(req));
    } catch {
      return responder(res, 400, { errores: ["JSON inválido."] });
    }
    const { errores, producto } = validarProducto(datos);
    if (errores.length > 0) {
      console.log("[api] petición rechazada:", datos, errores);
      return responder(res, 400, { errores });
    }
    const nuevo = { id: String(Date.now()), ...producto };
    productos = [...productos, nuevo];
    return responder(res, 201, nuevo);
  }

  responder(res, 404, { errores: ["Recurso no encontrado."] });
}).listen(PUERTO, () => console.log(`API en http://localhost:${PUERTO}/productos`));
