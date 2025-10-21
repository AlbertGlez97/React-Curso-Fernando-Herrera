import type { CSSProperties } from "react";

const myStyles: CSSProperties = {
  backgroundColor: "#fafafa",
  borderRadius: 10,
  padding: 10,
};

export function MyAwesomeApp({
  name,
  lastName,
}: {
  name: string;
  lastName: string;
}) {
  return (
    <h1 style={myStyles}>
      Hola {name} {lastName}
    </h1>
  );
}
