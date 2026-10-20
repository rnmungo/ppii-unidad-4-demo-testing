import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./server.js";

// "error": si un componente hace una petición que no tiene handler, el test falla.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  // Con globals: false, RTL no desmonta solo: se limpia el DOM entre tests.
  cleanup();
  // Deshace los server.use() que haya hecho cada test.
  server.resetHandlers();
});
afterAll(() => server.close());
