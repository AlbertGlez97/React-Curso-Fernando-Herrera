/**
 * Tests del componente FirstStepsApp
 * Demuestra testing con mocks de componentes
 * IMPORTANTE: vi.mock() es hoisted, por eso el mock se define aquí arriba
 */
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { FirstStepsApp } from "./FirstStepsApp";

/**
 * Mock function para rastrear llamadas al componente ItemCounter
 * Retorna un div simple con data-testid para poder encontrarlo en tests
 */
const mockItemCounter = vi.fn((props: unknown) => {
  return (
    <div
      data-testid="ItemCounter"
      productName={props.productName}
      quantity={props.quantity}
    />
  );
});

/**
 * Mock del componente ItemCounter
 * Se usa para aislar FirstStepsApp de sus dependencias
 */
vi.mock("./shopping-cart/ItemCounter", () => ({
  default: (props: unknown) => mockItemCounter(props),
}));

describe("FirstStepsApp", () => {
  /** Limpia los mocks después de cada test para evitar interferencias */
  afterEach(() => {
    vi.clearAllMocks();
  });

  /** Snapshot test: verifica que la estructura no cambie */
  test("should match snapshot", () => {
    const { container } = render(<FirstStepsApp />);

    expect(container).toMatchSnapshot();
  });

  /** Verifica que se renderizan exactamente 3 ItemCounter */
  test("should render the correct number of ItemCounter components", () => {
    render(<FirstStepsApp />);

    const itemCounters = screen.getAllByTestId("ItemCounter");

    expect(itemCounters.length).toBe(3);
  });

  /** Verifica que cada ItemCounter recibe las props correctas */
  test("should render ItemCounter with correct props", () => {
    render(<FirstStepsApp />);

    // Verifica que se llamó 3 veces
    expect(mockItemCounter).toHaveBeenCalledTimes(3);

    // Verifica cada llamada con las props esperadas
    expect(mockItemCounter).toHaveBeenCalledWith({
      productName: "Xbox",
      quantity: 1,
    });
    expect(mockItemCounter).toHaveBeenCalledWith({
      productName: "Nintendo",
      quantity: 2,
    });
    expect(mockItemCounter).toHaveBeenCalledWith({
      productName: "Play Station",
      quantity: 3,
    });
  });
});
