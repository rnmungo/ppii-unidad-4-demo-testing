import { useState } from "react";
import Catalogo from "./pages/Catalogo.jsx";
import Seguridad from "./pages/Seguridad.jsx";
import Tests from "./pages/Tests.jsx";

const SECCIONES = {
  catalogo: { titulo: "Catálogo", Componente: Catalogo },
  tests: { titulo: "Tests en código", Componente: Tests },
  seguridad: { titulo: "Seguridad", Componente: Seguridad }
};

export default function App() {
  const [actual, setActual] = useState("catalogo");
  const { Componente } = SECCIONES[actual];

  return (
    <>
      <header>
        <h1>Catálogo de productos</h1>
        <p>Demo de testing y seguridad en ReactJS · Prácticas Profesionalizantes II</p>
        <nav aria-label="Secciones">
          {Object.entries(SECCIONES).map(([clave, { titulo }]) => (
            <button
              key={clave}
              type="button"
              aria-pressed={actual === clave}
              onClick={() => setActual(clave)}
            >
              {titulo}
            </button>
          ))}
        </nav>
      </header>
      <main>
        <Componente />
      </main>
    </>
  );
}
