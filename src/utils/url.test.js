import { describe, it, expect } from "vitest";
import { esUrlSegura } from "./url.js";

describe("esUrlSegura", () => {
  it.each([
    "https://ejemplo.com/tomate",
    "http://localhost:3000/productos"
  ])("acepta %s", url => {
    expect(esUrlSegura(url)).toBe(true);
  });

  it.each([
    ["un esquema javascript:", "javascript:alert('xss')"],
    ["javascript: con mayúsculas", "JaVaScRiPt:alert(1)"],
    ["un esquema data:", "data:text/html,<script>alert(1)</script>"],
    ["una cadena que no es URL", "esto no es una url"],
    ["una URL relativa (no se definió como permitida)", "/productos/1"],
    ["un valor ausente", undefined]
  ])("rechaza %s", (_descripcion, url) => {
    expect(esUrlSegura(url)).toBe(false);
  });
});
