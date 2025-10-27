import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomHeader } from "./CustomHeader";

/**
 * Tests para el componente CustomHeader
 * Verifica el renderizado del título y la descripción opcional
 */
describe("CustomHeader", () => {
  const title = "Buscador de Gifs";

  /**
   * Verifica que el título se renderiza correctamente
   * Usa screen.getByRole para buscar por accesibilidad (mejor práctica)
   */
  test("should render the title correctly", () => {
    render(<CustomHeader title={title} />);

    // Buscar el heading por rol (accesibilidad)
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(title);
  });

  /**
   * Verifica que la descripción se renderiza cuando se provee como prop
   * La descripción es opcional y debe mostrarse solo si se pasa
   */
  test("should rendern the description when provided", () => {
    const description = "Descubre y comparte el Gif perfecto";
    render(<CustomHeader title={title} description={description} />);

    // Verificar que el texto de la descripción está presente
    expect(screen.getByText(description)).toBeDefined();

    // Verificar que existe un elemento <p> con la descripción
    expect(screen.getByRole("paragraph")).toBeDefined();
    expect(screen.getByRole("paragraph").innerHTML).toBe(description);
  });

  /**
   * Verifica que la descripción NO se renderiza cuando no se provee
   * Si la prop description no existe, el componente no debe mostrar el <p>
   */
  test("should not render description when not provided", () => {
    const { container } = render(<CustomHeader title={title} />);

    // Buscar el contenedor principal
    const divElement = container.querySelector(".content-center");

    // Verificar que el título existe
    const h1 = divElement?.querySelector("h1");
    expect(h1?.innerHTML).toBe(title);

    // Verificar que NO existe el elemento <p> (descripción)
    const p = divElement?.querySelector("p");
    expect(p).toBeNull();
  });
});
