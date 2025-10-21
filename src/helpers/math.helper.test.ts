import { describe, expect, test } from "vitest";
import { add, multiply, subtract } from "./math.helper";

describe("add", () => {
  test("should add two positives numbers", () => {
    // 1. Arrange
    const a: number = -2;
    const b: number = -4;

    // 2. Act
    const result = add(a, b);

    // 3. Assert
    expect(result).toBe(a + b);
  });
});

describe("subtract", () => {
  test("should subtract two positives numbers", () => {
    const a: number = -2;
    const b: number = -4;

    const result = subtract(a, b);
    expect(result).toBe(a - b);
  });
});

describe("multiply", () => {
  test("should multiply two positives numbers", () => {
    const a: number = -2;
    const b: number = -4;

    const result = multiply(a, b);
    expect(result).toBe(a * b);
  });
});
