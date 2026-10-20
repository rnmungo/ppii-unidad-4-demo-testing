import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [estado, setEstado] = useState("cargando"); // "cargando" | "listo" | "error"

  useEffect(() => {
    let ignorar = false;

    fetch(`${API_BASE_URL}/productos`)
      .then(respuesta => {
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        return respuesta.json();
      })
      .then(datos => {
        if (ignorar) return;
        setProductos(datos);
        setEstado("listo");
      })
      .catch(() => {
        if (!ignorar) setEstado("error");
      });

    return () => {
      ignorar = true;
    };
  }, []);

  async function agregarProducto(nuevo) {
    const respuesta = await fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo)
    });
    const cuerpo = await respuesta.json();
    if (!respuesta.ok) throw new Error(cuerpo.errores?.join(" ") ?? "No se pudo agregar.");
    setProductos(actuales => [...actuales, cuerpo]);
  }

  return { productos, estado, agregarProducto };
}
