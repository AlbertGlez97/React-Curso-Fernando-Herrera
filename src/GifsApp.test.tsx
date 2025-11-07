import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { GifsApp } from "./GifsApp";

/**
 * Tests para el componente principal GifsApp
 * Verifica que la aplicación se renderiza correctamente
 */
describe("GifsApp", () => {
  // Snapshot test: verifica que la estructura del componente no cambie inesperadamente
  test("should render component properly", () => {
    const { container } = render(<GifsApp />);

    expect(container).toMatchSnapshot();
  });
});
