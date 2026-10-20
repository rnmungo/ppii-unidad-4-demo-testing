import { describe, it, expect } from "vitest";
import { filtrarProductos } from "./productos.js";

const productos = [
  { id: "1", nombre: "Tomate", precio: 1500 },
  { id: "2", nombre: "Lechuga", precio: 900 }
];

describe("filtrarProductos", () => {
  it("encuentra coincidencias parciales sin distinguir mayúsculas", () => {
    expect(filtrarProductos(productos, "TOM"))
      .toEqual([{ id: "1", nombre: "Tomate", precio: 1500 }]);
  });

  it("ignora espacios al inicio y al final", () => {
    expect(filtrarProductos(productos, " lechuga ")).toHaveLength(1);
  });

  it("devuelve todos los productos con una consulta vacía", () => {
    expect(filtrarProductos(productos, "")).toHaveLength(2);
  });

  it("devuelve una lista vacía si no hay coincidencias", () => {
    expect(filtrarProductos(productos, "banana")).toEqual([]);
  });
});
