import { describe, it, expect } from "vitest";
import { formatearPrecio } from "./precio.js";

describe("formatearPrecio", () => {
  it("incluye el valor monetario", () => {
    // Arrange + Act
    const resultado = formatearPrecio(1500);

    // Assert: se verifica el contrato observable, no el string exacto
    expect(resultado).toContain("1.500");
    expect(resultado).toMatch(/\$/);
  });

  it("devuelve texto", () => {
    expect(typeof formatearPrecio(0)).toBe("string");
  });
});
