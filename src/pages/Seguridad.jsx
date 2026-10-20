import { useState } from "react";
import ComentarioHtml from "../components/ComentarioHtml.jsx";
import { esUrlSegura } from "../utils/url.js";
import { API_BASE_URL } from "../config.js";

const PAYLOAD_XSS =
  `Buen producto <b>recomendado</b> <img src="x" onerror="this.insertAdjacentText('afterend', '⚠ ¡Se ejecutó código inyectado!')">`;

function DemoXss() {
  const [contenido, setContenido] = useState(PAYLOAD_XSS);
  const [inseguroActivo, setInseguroActivo] = useState(false);

  return (
    <section className="demo">
      <h2>1. XSS: JSX, dangerouslySetInnerHTML y DOMPurify</h2>
      <p>
        Un comentario que llega de una API trae HTML con un atributo <code>onerror</code>.
        Comparar cómo lo trata cada estrategia.
      </p>
      <label htmlFor="payload">Contenido externo</label>
      <textarea id="payload" rows={3} value={contenido} onChange={e => setContenido(e.target.value)} />

      <div className="comparacion">
        <div>
          <h3>✅ Texto en JSX <code>{"{contenido}"}</code></h3>
          <ComentarioHtml contenido={contenido} modo="texto" />
          <p className="nota">React escapa: se ve el código, no se ejecuta.</p>
        </div>
        <div>
          <h3>✅ HTML sanitizado (DOMPurify)</h3>
          <ComentarioHtml contenido={contenido} modo="sanitizado" />
          <p className="nota">Se conserva el formato (&lt;b&gt;) pero se elimina <code>onerror</code>.</p>
        </div>
        <div>
          <h3>❌ dangerouslySetInnerHTML sin sanitizar</h3>
          {inseguroActivo ? (
            <ComentarioHtml contenido={contenido} modo="inseguro" />
          ) : (
            <button type="button" onClick={() => setInseguroActivo(true)}>
              Mostrar versión insegura
            </button>
          )}
          <p className="nota">
            El navegador interpreta el HTML y ejecuta el handler. Con <code>npm run preview</code> la
            cabecera CSP bloquea el script inline (defensa en profundidad).
          </p>
        </div>
      </div>
    </section>
  );
}

function DemoUrl() {
  const [valor, setValor] = useState("javascript:alert('robado')");
  const segura = esUrlSegura(valor);

  return (
    <section className="demo">
      <h2>2. URLs peligrosas</h2>
      <p>
        <code>esUrlSegura</code> sólo acepta <code>http:</code> y <code>https:</code>. Probar con{" "}
        <code>https://vitest.dev</code>, <code>javascript:alert(1)</code>, <code>data:text/html,...</code> o texto suelto.
      </p>
      <label htmlFor="url">URL recibida</label>
      <input id="url" value={valor} onChange={e => setValor(e.target.value)} />
      <p role="status" className={segura ? "disponible" : "sin-stock"}>
        {segura ? "Protocolo permitido: se genera el enlace." : "Protocolo no permitido: no se genera el enlace."}
      </p>
      {segura && (
        <a href={valor} target="_blank" rel="noopener noreferrer">Abrir enlace</a>
      )}
    </section>
  );
}

function DemoCliente() {
  const [resultado, setResultado] = useState(null);

  async function enviarPeticionManual() {
    // Esto es lo que haría alguien con la consola, curl o Postman:
    // saltear el formulario (y su validación) y hablar directo con la API.
    try {
      const respuesta = await fetch(`${API_BASE_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "", precio: -50 })
      });
      setResultado({ estado: respuesta.status, cuerpo: await respuesta.json() });
    } catch {
      setResultado({ estado: "sin conexión", cuerpo: "Iniciar la API con npm run api" });
    }
  }

  return (
    <section className="demo">
      <h2>3. No confiar en el cliente</h2>
      <p>
        El formulario del catálogo rechaza nombre vacío y precio negativo, pero esa validación
        se puede omitir. Este botón envía <code>{`{ nombre: "", precio: -50 }`}</code> directo a la API.
      </p>
      <button type="button" onClick={enviarPeticionManual}>Enviar petición manual</button>
      {resultado && (
        <pre className="codigo">{`HTTP ${resultado.estado}\n${JSON.stringify(resultado.cuerpo, null, 2)}`}</pre>
      )}
      <p className="nota">
        La API (<code>server/api.js</code>) vuelve a validar y responde 400. Lo mismo vale para
        ocultar botones según rol: la autorización real se verifica en cada endpoint.
      </p>
    </section>
  );
}

function DemoSecretos() {
  const variablesPublicas = Object.entries(import.meta.env).filter(([clave]) => clave.startsWith("VITE_"));

  return (
    <section className="demo">
      <h2>4. Secretos, variables VITE_* y almacenamiento</h2>
      <p>Estas variables están dentro del JavaScript que descarga el navegador; cualquiera puede leerlas:</p>
      <pre className="codigo">
        {variablesPublicas.length > 0
          ? variablesPublicas.map(([k, v]) => `${k}=${v}`).join("\n")
          : "(no hay variables VITE_* definidas; copiar .env.example a .env)"}
      </pre>
      <ul>
        <li>Nunca poner contraseñas, claves privadas ni tokens en <code>VITE_*</code>.</li>
        <li><code>localStorage</code> y <code>sessionStorage</code> son legibles por cualquier script del origen: un XSS puede robar lo que haya ahí.</li>
        <li>Para sesiones, evaluar cookies <code>HttpOnly</code>, <code>Secure</code> y <code>SameSite</code> gestionadas por el servidor.</li>
      </ul>
    </section>
  );
}

function DemoDependencias() {
  return (
    <section className="demo">
      <h2>5. Dependencias y cabeceras HTTP</h2>
      <pre className="codigo">{`npm audit     # vulnerabilidades conocidas en dependencias
npm doctor    # revisa el entorno local de npm
npm ci        # instala exactamente lo del package-lock.json`}</pre>
      <p>
        En <code>vite.config.js</code> (<code>preview.headers</code>) se configuran CSP, X-Frame-Options,
        X-Content-Type-Options y HSTS. Verlas con <code>npm run build</code> + <code>npm run preview</code> → DevTools → Network.
      </p>
    </section>
  );
}

export default function Seguridad() {
  return (
    <>
      <DemoXss />
      <DemoUrl />
      <DemoCliente />
      <DemoSecretos />
      <DemoDependencias />
    </>
  );
}
