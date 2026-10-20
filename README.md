# Demo: testing y seguridad en ReactJS

App mínima del **catálogo de productos** que acompaña al material
`docs/Material_Complementario_Testing_y_Seguridad_ReactJS.pdf`.
Tiene tres pestañas:

| Pestaña | Qué muestra |
|---|---|
| **Catálogo** | La app real: búsqueda, tarjetas, selección y formulario contra una API local. |
| **Tests en código** | El código fuente de cada test, con qué comportamiento protege y qué observar. |
| **Seguridad** | Demos interactivas: XSS, URLs peligrosas, no confiar en el cliente, variables `VITE_*`, dependencias y cabeceras. |

## Cómo correrla

```bash
npm install
npm run api        # terminal 1: API en http://localhost:3000/productos
npm run dev        # terminal 2: app en http://localhost:5173
npm run test:run   # ejecutar los tests una vez (npm test = modo interactivo)
```

Para ver las **cabeceras de seguridad** (CSP, X-Frame-Options, etc.):

```bash
npm run build
npm run preview    # http://localhost:4173 → DevTools → Network → Headers
```

## Mapa del material → código

| Sección del PDF | Archivo |
|---|---|
| 3. Anatomía (Arrange-Act-Assert) | `src/utils/precio.test.js` |
| 4. Configurar Vitest | `vite.config.js`, `src/test/setup.js` |
| 5. Pruebas unitarias | `src/utils/precio.test.js`, `src/utils/productos.test.js` |
| 6–7. Componentes y consultas accesibles | `src/components/TarjetaProducto.test.jsx` |
| 8. Formularios y asincronía | `src/components/FormularioProducto.test.jsx` |
| 9. MSW | `src/test/handlers.js`, `src/test/server.js`, `src/pages/Catalogo.test.jsx` |
| 10. No confianza en el cliente | `server/api.js` (valida de nuevo), pestaña Seguridad → demo 3 |
| 11. XSS y URLs | `src/components/ComentarioHtml.jsx`, `src/utils/url.js` y sus tests |
| 12. Secretos y dependencias | `.env.example`, `src/config.js`, pestaña Seguridad → demos 4 y 5 |
| 13. Cabeceras HTTP | `vite.config.js` (`preview.headers`) |

## Guion sugerido para la clase

1. **Catálogo**: buscar "tom", ver Lechuga deshabilitada (sin stock), el "Pimiento" cuyo nombre trae
   `<img onerror>` y se ve como texto (JSX escapa), y "Zanahoria", cuya URL `javascript:` no se convierte en enlace.
2. **Tests en código**: abrir `TarjetaProducto.test.jsx` y leer cada `it`. Luego romper el código
   (en `TarjetaProducto.jsx` cambiar `disabled={!disponible}` por `disabled={false}`), correr
   `npm run test:run` y ver que falla exactamente el test que protege esa regla.
3. **Estados de API**: detener `npm run api` y recargar → aparece el mensaje de error (`role="alert"`).
   Es el mismo escenario que `Catalogo.test.jsx` simula con MSW devolviendo HTTP 500.
4. **Seguridad**:
   - XSS: comparar las tres columnas. Sólo la versión sin sanitizar ejecuta el código inyectado.
     Repetir con `npm run preview`: la CSP lo bloquea (ver consola).
   - URLs: probar `https://…`, `javascript:…`, `data:…`.
   - "Enviar petición manual": la API responde 400 aunque el formulario se haya salteado.
   - Variables `VITE_*`: se ven en el navegador → nunca poner secretos ahí.
   - Correr `npm audit` y leer el resultado sin aplicar `--force` a ciegas.

> Nota técnica: con `globals: false`, React Testing Library no desmonta los componentes
> automáticamente entre tests; por eso `src/test/setup.js` llama a `cleanup()` en `afterEach`.
