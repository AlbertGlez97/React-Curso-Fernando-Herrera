/**
 * Tests del componente ItemCounter
 * Demuestra testing de:
 * - Renderizado con props por defecto y personalizadas
 * - Interacciones del usuario (clicks)
 * - Validaciones de lógica de negocio
 * - Estilos dinámicos
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ItemCounter from "./ItemCounter";

describe("ItemCounter", () => {
  /** Verifica que el componente se renderiza con valores por defecto */
  test("should render with default values", () => {
    const name = "Test item";

    render(<ItemCounter productName={name} />);

    expect(screen.getByText(name)).toBeDefined();
    expect(screen.getByText(name)).not.toBeNull();
  });

  /** Verifica que el componente acepta quantity personalizada */
  test("should render with custom quantity", () => {
    const name = "Test item";
    const quantity = 10;

    render(<ItemCounter productName={name} quantity={quantity} />);

    expect(screen.getByText(quantity)).toBeDefined();
  });

  /** Verifica que el botón +1 incrementa el contador */
  test("should increase count when +1 button is pressed", () => {
    render(<ItemCounter productName="Test item" quantity={5} />);

    const [buttonAdd] = screen.getAllByRole("button", {
      name: "+1",
    });

    fireEvent.click(buttonAdd);

    expect(screen.getByText("6")).toBeDefined();
  });

  /** Verifica que el botón -1 decrementa el contador */
  test("should decrease count when -1 button is pressed", () => {
    render(<ItemCounter productName="Test item" quantity={5} />);

    const [buttonSubtract] = screen.getAllByRole("button", {
      name: "-1",
    });

    fireEvent.click(buttonSubtract);

    expect(screen.getByText("4")).toBeDefined();
  });

  /** Verifica que el contador no baja de 1 */
  test("should not decrease count when -1 button is pressed and quantity is 1", () => {
    render(<ItemCounter productName="Test item" quantity={1} />);

    const [buttonSubtract] = screen.getAllByRole("button", {
      name: "-1",
    });

    fireEvent.click(buttonSubtract);

    expect(screen.getByText("1")).toBeDefined();
  });

  /** Verifica que el texto cambia a rojo cuando count es 1 */
  test("should change to red when count is 1", () => {
    const name = "Test item";
    const quantity = 1;

    render(<ItemCounter productName={name} quantity={quantity} />);

    const spanItemText = screen.getByText(name);
    expect(spanItemText.style.color).toBe("red");
  });

  /** Verifica que el texto es negro cuando count es mayor a 1 */
  test("should change to black when count is greater than 1", () => {
    const name = "Test item";
    const quantity = 5;

    render(<ItemCounter productName={name} quantity={quantity} />);

    const spanItemText = screen.getByText(name);
    expect(spanItemText.style.color).toBe("black");
  });
});
