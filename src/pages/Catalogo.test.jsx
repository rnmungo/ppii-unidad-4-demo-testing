import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../test/server.js";
import { URL_PRODUCTOS } from "../test/handlers.js";
import Catalogo from "./Catalogo.jsx";

describe("Catalogo (integración con API simulada)", () => {
  it("muestra el estado de carga y luego los productos", async () => {
    render(<Catalogo />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando productos");
    // findBy espera a que aparezca: no se usan setTimeout arbitrarios.
    expect(await screen.findByRole("heading", { name: "Tomate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lechuga" })).toBeInTheDocument();
  });

  it("filtra los productos al escribir en el buscador", async () => {
    const user = userEvent.setup();
    render(<Catalogo />);

    await user.type(await screen.findByLabelText("Buscar producto"), "tom");

    expect(screen.getByRole("heading", { name: "Tomate" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Lechuga" })).not.toBeInTheDocument();
  });

  it("informa cuando la API devuelve un catálogo vacío", async () => {
    server.use(http.get(URL_PRODUCTOS, () => HttpResponse.json([])));

    render(<Catalogo />);

    expect(await screen.findByText("El catálogo está vacío.")).toBeInTheDocument();
  });

  it("muestra un mensaje accesible si la API responde HTTP 500", async () => {
    server.use(http.get(URL_PRODUCTOS, () => new HttpResponse(null, { status: 500 })));

    render(<Catalogo />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo cargar el catálogo");
  });
});
