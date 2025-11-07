import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MyCounterApp } from "./MyCounterApp";

const handleAddMock = vi.fn();
const handleSubtractMock = vi.fn();
const handleResetMock = vi.fn();

vi.mock("../hooks/useCounter", () => ({
  useCounter: () => ({
    counter: 40,
    handleAdd: handleAddMock,
    handleSubtract: handleSubtractMock,
    handleReset: handleResetMock,
  }),
}));

describe("MyCounterApp2", () => {
  test("should render the component", () => {
    render(<MyCounterApp />);

    //screen.debug();

    expect(screen.getByRole("heading", { level: 1 }).innerHTML).toContain(
      "Counter: 40"
    );

    expect(screen.getByRole("button", { name: "Increment" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Decrement" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDefined();
  });

  test("should call handleAdd if button is clicked", () => {
    render(<MyCounterApp />);

    const button = screen.getByRole("button", { name: "Increment" });

    fireEvent.click(button);

    expect(handleAddMock).toHaveBeenCalled();
    expect(handleAddMock).toHaveBeenCalledTimes(1);
    expect(handleSubtractMock).not.toHaveBeenCalled();
    expect(handleResetMock).not.toHaveBeenCalled();
  });
});
