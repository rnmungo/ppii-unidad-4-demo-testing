// Muestra el código fuente de los tests dentro de la app.
// `?raw` importa el archivo como texto: NO se ejecuta, sólo se lee.
const fuentes = import.meta.glob(
  ["../**/*.test.{js,jsx}", "../test/*.js"],
  { query: "?raw", import: "default", eager: true }
);

const EXPLICACIONES = [
  {
    archivo: "../utils/precio.test.js",
    tipo: "Unitario",
    protege: "Que el precio se muestre con formato monetario argentino.",
    claves: "Función pura: se prueba sin React ni DOM. Se usa toContain/toMatch porque el formato exacto depende del entorno Intl."
  },
  {
    archivo: "../utils/productos.test.js",
    tipo: "Unitario",
    protege: "Las reglas de búsqueda: mayúsculas, espacios, consulta vacía, sin coincidencias.",
    claves: "Un test por regla. toEqual compara estructuras, toHaveLength cantidades."
  },
  {
    archivo: "../utils/url.test.js",
    tipo: "Unitario · seguridad",
    protege: "Que sólo se acepten URLs http/https y se rechacen javascript:, data: o texto inválido.",
    claves: "it.each recorre una tabla de casos: el test documenta la allowlist de protocolos."
  },
  {
    archivo: "../components/TarjetaProducto.test.jsx",
    tipo: "Componente",
    protege: "Que no se pueda seleccionar un producto sin stock, que el clic notifique el id y que un enlace peligroso no se renderice.",
    claves: "getByRole + nombre accesible, vi.fn() como callback espía, userEvent para clics reales, queryByRole para comprobar ausencia."
  },
  {
    archivo: "../components/FormularioProducto.test.jsx",
    tipo: "Componente",
    protege: "Los mensajes de validación y el envío de datos limpios.",
    claves: "user.type / user.click simulan el recorrido de una persona. Los errores se buscan por role=\"alert\"."
  },
  {
    archivo: "../components/ComentarioHtml.test.jsx",
    tipo: "Componente · seguridad",
    protege: "Que el texto en JSX se escape y que DOMPurify elimine scripts y atributos on*.",
    claves: "Se verifica el DOM resultante: no existe <script> ni atributo onerror."
  },
  {
    archivo: "../pages/Catalogo.test.jsx",
    tipo: "Integración (MSW)",
    protege: "Que la interfaz muestre carga, datos, catálogo vacío y error HTTP 500.",
    claves: "MSW intercepta fetch en la capa de red. server.use() cambia la respuesta sólo para ese test. findBy espera lo asíncrono."
  },
  { archivo: "../test/setup.js", tipo: "Configuración", protege: "Se ejecuta antes de cada archivo de test.", claves: "Agrega los matchers de jest-dom y levanta/resetea/cierra el servidor MSW." },
  { archivo: "../test/handlers.js", tipo: "Configuración", protege: "Respuestas por defecto de la API simulada.", claves: "Cada handler describe un endpoint: método + URL + respuesta." },
  { archivo: "../test/server.js", tipo: "Configuración", protege: "Servidor MSW para Node (Vitest).", claves: "setupServer recibe los handlers." }
];

export default function Tests() {
  return (
    <>
      <section className="demo">
        <h2>Cómo ejecutarlos</h2>
        <pre className="codigo">{`npm test          # modo interactivo (se re-ejecuta al guardar)
npm run test:run  # una sola corrida`}</pre>
        <p className="nota">
          Ejercicio sugerido: antes de correr cada test, decir qué comportamiento espera. Después,
          romper a propósito el código (por ejemplo, quitar <code>disabled</code> del botón) y ver qué test falla.
        </p>
      </section>

      {EXPLICACIONES.map(({ archivo, tipo, protege, claves }) => (
        <details key={archivo} className="demo">
          <summary>
            <span className="etiqueta">{tipo}</span> <code>{archivo.replace("../", "src/")}</code>
          </summary>
          <p><strong>Qué protege:</strong> {protege}</p>
          <p><strong>Para observar:</strong> {claves}</p>
          <pre className="codigo">{fuentes[archivo] ?? "(archivo no encontrado)"}</pre>
        </details>
      ))}
    </>
  );
}
