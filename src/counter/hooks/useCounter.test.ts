import { beforeEach, describe, expect, test } from "vitest";
import { useCounter } from "./useCounter";
import { act, renderHook } from "@testing-library/react";

/**
 * Tests para el custom hook useCounter
 * Verifica inicialización, incremento, decremento y reset del contador
 */
describe("userCounter", () => {
  // Nota: beforeEach comentado - no se usa porque cada test necesita su propia instancia del hook
  // let result;

  // beforeEach(() => {
  //    const { result: hookValue}  = renderHook(() => useCounter());
  //      result = hookValue;
  // });

  // Verifica que el contador inicia con el valor por defecto (10)
  test("should initialize with default value of 10", () => {
    // renderHook: monta el hook en un componente de prueba
    const { result } = renderHook(() => useCounter());

    // result.current: accede al valor actual retornado por el hook
    expect(result.current.counter).toBe(10);
  });

  // Verifica que el contador puede inicializarse con un valor personalizado
  test("should initialize with value 20", () => {
    const initialValue = 20;

    // Pasar argumento al hook durante la inicialización
    const { result } = renderHook(() => useCounter(initialValue));

    expect(result.current.counter).toBe(initialValue);
  });

  // Verifica que handleAdd incrementa el contador en 1
  test("should increment counter when handleAdd is called", () => {
    const { result } = renderHook(() => useCounter());

    // act: envuelve actualizaciones de estado para simular el comportamiento de React
    act(() => {
      result.current.handleAdd();
    });

    expect(result.current.counter).toBe(11);
  });

  // Verifica que handleSubtract decrementa el contador en 1
  test("should decrement counter when handleSubtract is called", () => {
    const { result } = renderHook(() => useCounter());

    // Ejecutar la función que modifica el estado dentro de act
    act(() => {
      result.current.handleSubtract();
    });

    expect(result.current.counter).toBe(9);
  });

  // Verifica que handleReset restaura el contador al valor inicial
  test("should reset counter when handleReset is called", () => {
    const { result } = renderHook(() => useCounter());

    // Primero modificamos el contador restando 5 veces
    act(() => {
      result.current.handleSubtract();
      result.current.handleSubtract();
      result.current.handleSubtract();
      result.current.handleSubtract();
      result.current.handleSubtract();
    });

    expect(result.current.counter).toBe(5);

    // Luego ejecutamos reset para volver al valor inicial
    act(() => {
      result.current.handleReset();
    });

    expect(result.current.counter).toBe(10);
  });
});
