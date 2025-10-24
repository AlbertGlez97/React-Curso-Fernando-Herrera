import { useCounter } from "../hooks/useCounter";

export const MyCounter = () => {
  const { counter, handleAdd, handleSubtract, handleReset } = useCounter(50);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Counter: {counter}</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={handleAdd}>Increment</button>
        <button onClick={handleSubtract}>Decrement</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};
