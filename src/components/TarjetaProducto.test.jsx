import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TarjetaProducto from "./TarjetaProducto.jsx";

describe("TarjetaProducto", () => {
  it("deshabilita la selección si no hay stock", () => {
    const producto = { id: "2", nombre: "Lechuga", precio: 900, stock: 0, url: "https://ejemplo.com" };

    render(<TarjetaProducto producto={producto} onSeleccionar={() => {}} />);

    expect(
      screen.getByRole("button", { name: "Seleccionar Lechuga" })
    ).toBeDisabled();
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });

  it("notifica la selección si hay stock", async () => {
    const user = userEvent.setup();
    const onSeleccionar = vi.fn();
    const producto = { id: "1", nombre: "Tomate", precio: 1500, stock: 8, url: "https://ejemplo.com" };

    render(<TarjetaProducto producto={producto} onSeleccionar={onSeleccionar} />);

    await user.click(screen.getByRole("button", { name: "Seleccionar Tomate" }));

    expect(onSeleccionar).toHaveBeenCalledWith("1");
  });

  // --- Seguridad ---

  it("no genera un enlace cuando la URL usa javascript:", () => {
    const producto = { id: "4", nombre: "Zanahoria", precio: 700, stock: 1, url: "javascript:alert('robado')" };

    render(<TarjetaProducto producto={producto} onSeleccionar={() => {}} />);

    // queryBy devuelve null en vez de lanzar error: sirve para comprobar AUSENCIA.
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Enlace no disponible")).toBeInTheDocument();
  });

  it("muestra como texto un nombre con HTML (JSX escapa)", () => {
    const nombre = "Pimiento <img src=x onerror=alert(1)>";
    const producto = { id: "3", nombre, precio: 2100, stock: 3, url: "https://ejemplo.com" };

    const { container } = render(<TarjetaProducto producto={producto} onSeleccionar={() => {}} />);

    expect(screen.getByRole("heading", { name: nombre })).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
});
