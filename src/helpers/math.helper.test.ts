/**
 * Tests para funciones matemáticas básicas
 * Demuestra el patrón AAA (Arrange, Act, Assert)
 */
import { describe, expect, test } from "vitest";
import { add, multiply, subtract } from "./math.helper";

describe("add", () => {
  test("should add two positives numbers", () => {
    // 1. Arrange - Preparar los datos
    const a: number = -2;
    const b: number = -4;

    // 2. Act - Ejecutar la función a testear
    const result = add(a, b);

    // 3. Assert - Verificar el resultado
    expect(result).toBe(a + b);
  });
});

describe("subtract", () => {
  test("should subtract two positives numbers", () => {
    // Arrange
    const a: number = -2;
    const b: number = -4;

    // Act
    const result = subtract(a, b);

    // Assert
    expect(result).toBe(a - b);
  });
});

describe("multiply", () => {
  test("should multiply two positives numbers", () => {
    // Arrange
    const a: number = -2;
    const b: number = -4;

    // Act
    const result = multiply(a, b);

    // Assert
    expect(result).toBe(a * b);
  });
});
