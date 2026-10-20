export function filtrarProductos(productos, consulta) {
  const termino = consulta.trim().toLowerCase();
  return productos.filter(producto =>
    producto.nombre.toLowerCase().includes(termino)
  );
}
