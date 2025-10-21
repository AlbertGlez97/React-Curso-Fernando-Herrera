import type { CSSProperties } from "react";

// Estilos declarados fuera del componente para evitar recrearlos en cada render
const myStyles: CSSProperties = {
  backgroundColor: "#fafafa",
  borderRadius: 10,
  padding: 10,
};

/**
 * Componente de ejemplo que muestra un saludo personalizado
 * @param name - Nombre de la persona
 * @param lastName - Apellido de la persona
 */
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
