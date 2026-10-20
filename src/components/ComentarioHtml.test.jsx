import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ComentarioHtml from "./ComentarioHtml.jsx";

const MALICIOSO = `Hola <b>mundo</b><img src="x" onerror="alert(1)"><script>alert(2)</script>`;

describe("ComentarioHtml", () => {
  it("en modo texto muestra el HTML como texto literal", () => {
    const { container } = render(<ComentarioHtml contenido={MALICIOSO} modo="texto" />);

    expect(screen.getByText(MALICIOSO)).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("b")).toBeNull();
  });

  it("en modo sanitizado conserva el formato pero elimina scripts y handlers", () => {
    const { container } = render(<ComentarioHtml contenido={MALICIOSO} modo="sanitizado" />);

    expect(container.querySelector("b")).toHaveTextContent("mundo");
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
  });

  it("en modo inseguro el atributo onerror llega al DOM (por eso hay que sanitizar)", () => {
    const { container } = render(<ComentarioHtml contenido={MALICIOSO} modo="inseguro" />);

    expect(container.querySelector("img")).toHaveAttribute("onerror", "alert(1)");
  });
});
