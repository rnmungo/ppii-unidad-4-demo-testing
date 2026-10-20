import { useState } from "react";
import { useProductos } from "../hooks/useProductos.js";
import { filtrarProductos } from "../utils/productos.js";
import TarjetaProducto from "../components/TarjetaProducto.jsx";
import FormularioProducto from "../components/FormularioProducto.jsx";

export default function Catalogo() {
  const { productos, estado, agregarProducto } = useProductos();
  const [consulta, setConsulta] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  if (estado === "cargando") {
    return <p role="status">Cargando productos…</p>;
  }
  if (estado === "error") {
    return (
      <p role="alert" className="error">
        No se pudo cargar el catálogo. ¿Está corriendo la API (npm run api)?
      </p>
    );
  }

  const visibles = filtrarProductos(productos, consulta);
  const elegido = productos.find(p => p.id === seleccionado);

  return (
    <section>
      <div className="barra">
        <label htmlFor="buscar">Buscar producto</label>
        <input
          id="buscar"
          type="search"
          value={consulta}
          onChange={e => setConsulta(e.target.value)}
        />
      </div>

      {elegido && <p role="status">Seleccionaste: {elegido.nombre}</p>}

      {productos.length === 0 ? (
        <p>El catálogo está vacío.</p>
      ) : visibles.length === 0 ? (
        <p>No hay productos que coincidan con “{consulta}”.</p>
      ) : (
        <div className="grilla">
          {visibles.map(producto => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              onSeleccionar={setSeleccionado}
            />
          ))}
        </div>
      )}

      <h2>Agregar producto</h2>
      <FormularioProducto onCrear={agregarProducto} />
    </section>
  );
}
