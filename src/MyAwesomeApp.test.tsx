import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyAwesomeApp } from "./MyAwesomeApp";

describe("MyAwesomeApp", () => {
  //Para evaluar un estado inicial, sin manipulacion de eventos
  test("should render firstName and lastName with render container", () => {
    const { container } = render(<MyAwesomeApp name="John" lastName="Doe" />); // Hasta que no se ejecuta de nuevo, no se actualiza el container

    const h1 = container.querySelector("h1");

    //expect(h1?.innerHTML).toBe("Hola John Doe");
    expect(h1?.innerHTML).toContain("John");
  });

  // Este es mas para eventos
  test("should render firstName and lastName with screen", () => {
    render(<MyAwesomeApp name="John" lastName="Doe" />); // Hasta que no se ejecuta de nuevo, no se actualiza el container

    screen.debug(); //Permite actualizarse, si ocurre un evento

    const h1 = screen.getByRole("heading", {
      level: 1,
    });

    //expect(h1?.innerHTML).toBe("Hola John Doe");
    expect(h1?.innerHTML).toContain("John");
  });

  // Es usado para verificar que la estructura fisica del componente creado es exactamente igual a la usada previamente
  test("should match snapshot", () => {
    const { container } = render(<MyAwesomeApp name="John" lastName="Doe" />);

    expect(container).toMatchSnapshot();
  });
});
