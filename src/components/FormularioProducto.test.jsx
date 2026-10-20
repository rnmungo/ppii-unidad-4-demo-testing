import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioProducto from "./FormularioProducto.jsx";

describe("FormularioProducto", () => {
  it("muestra un error si el nombre está vacío", async () => {
    const user = userEvent.setup();
    render(<FormularioProducto onCrear={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ingresar el nombre del producto.");
  });

  it("muestra un error si el precio no es mayor que cero", async () => {
    const user = userEvent.setup();
    const onCrear = vi.fn();
    render(<FormularioProducto onCrear={onCrear} />);

    await user.type(screen.getByRole("textbox", { name: "Nombre del producto" }), "Tomate");
    await user.type(screen.getByLabelText("Precio"), "-50");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ingresar un precio mayor que cero.");
    expect(onCrear).not.toHaveBeenCalled();
  });

  it("envía nombre sin espacios sobrantes y precio numérico", async () => {
    const user = userEvent.setup();
    const onCrear = vi.fn();
    render(<FormularioProducto onCrear={onCrear} />);

    await user.type(screen.getByRole("textbox", { name: "Nombre del producto" }), "  Tomate  ");
    await user.type(screen.getByLabelText("Precio"), "1500");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(onCrear).toHaveBeenCalledWith({ nombre: "Tomate", precio: 1500 });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("muestra el error que devuelve el servidor", async () => {
    const user = userEvent.setup();
    const onCrear = vi.fn().mockRejectedValue(new Error("El precio debe ser un número mayor que cero."));
    render(<FormularioProducto onCrear={onCrear} />);

    await user.type(screen.getByRole("textbox", { name: "Nombre del producto" }), "Tomate");
    await user.type(screen.getByLabelText("Precio"), "10");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("El precio debe ser un número mayor que cero.");
  });
});
