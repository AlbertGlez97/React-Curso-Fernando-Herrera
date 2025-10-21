/**
 * Tests del componente MyAwesomeApp
 * Demuestra diferentes técnicas de testing en React
 */
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyAwesomeApp } from "./MyAwesomeApp";

describe("MyAwesomeApp", () => {
  /**
   * Test usando container: útil para evaluar estado inicial sin manipulación de eventos
   * container es un snapshot estático del momento del render
   */
  test("should render firstName and lastName with render container", () => {
    const { container } = render(<MyAwesomeApp name="John" lastName="Doe" />);

    const h1 = container.querySelector("h1");

    expect(h1?.innerHTML).toContain("John");
  });

  /**
   * Test usando screen: recomendado para tests con eventos
   * screen se actualiza cuando ocurren eventos
   */
  test("should render firstName and lastName with screen", () => {
    render(<MyAwesomeApp name="John" lastName="Doe" />);

    // screen.debug(); // Útil para debugging: imprime el DOM actual

    const h1 = screen.getByRole("heading", {
      level: 1,
    });

    expect(h1?.innerHTML).toContain("John");
  });

  /**
   * Snapshot test: verifica que la estructura física del componente
   * no cambie accidentalmente
   */
  test("should match snapshot", () => {
    const { container } = render(<MyAwesomeApp name="John" lastName="Doe" />);

    expect(container).toMatchSnapshot();
  });
});
