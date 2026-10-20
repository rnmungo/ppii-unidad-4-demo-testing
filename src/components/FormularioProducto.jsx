import { useState } from "react";

export default function FormularioProducto({ onCrear }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  async function manejarEnvio(evento) {
    evento.preventDefault();

    // Validación en el cliente: orienta al usuario, pero NO protege al servidor.
    if (nombre.trim() === "") {
      setError("Ingresar el nombre del producto.");
      return;
    }
    if (!(Number(precio) > 0)) {
      setError("Ingresar un precio mayor que cero.");
      return;
    }

    try {
      await onCrear({ nombre: nombre.trim(), precio: Number(precio) });
      setNombre("");
      setPrecio("");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      <label htmlFor="nombre">Nombre del producto</label>
      <input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} />

      <label htmlFor="precio">Precio</label>
      <input id="precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} />

      <button type="submit">Agregar</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
  );
}
