import DOMPurify from "dompurify";

// Tres formas de mostrar un contenido que viene de "afuera" (API, CMS, usuario).
//  - "texto":      interpolación JSX normal → React escapa, se ve el código literal.
//  - "sanitizado": se interpreta HTML, pero DOMPurify elimina scripts y atributos on*.
//  - "inseguro":   dangerouslySetInnerHTML SIN sanitizar → XSS. Sólo para la demo.
export default function ComentarioHtml({ contenido, modo }) {
  if (modo === "texto") {
    return <div className="comentario">{contenido}</div>;
  }

  const html = modo === "sanitizado" ? DOMPurify.sanitize(contenido) : contenido;
  return <div className="comentario" dangerouslySetInnerHTML={{ __html: html }} />;
}
