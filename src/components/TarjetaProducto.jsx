import { formatearPrecio } from "../utils/precio.js";
import { esUrlSegura } from "../utils/url.js";

export default function TarjetaProducto({ producto, onSeleccionar }) {
  const disponible = producto.stock > 0;

  return (
    <article className="tarjeta">
      {/* JSX escapa el texto: un nombre con <img onerror=...> se muestra literal. */}
      <h3>{producto.nombre}</h3>
      <p className="precio">{formatearPrecio(producto.precio)}</p>
      <p className={disponible ? "disponible" : "sin-stock"}>
        {disponible ? "Disponible" : "Sin stock"}
      </p>

      {/* Sólo se genera un enlace si el protocolo está permitido. */}
      {esUrlSegura(producto.url) ? (
        <a href={producto.url} target="_blank" rel="noopener noreferrer">
          Ficha de {producto.nombre}
        </a>
      ) : (
        <p className="aviso">Enlace no disponible</p>
      )}

      <button
        type="button"
        disabled={!disponible}
        onClick={() => onSeleccionar(producto.id)}
      >
        Seleccionar {producto.nombre}
      </button>
    </article>
  );
}
