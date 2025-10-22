# Componentes Funcionales en React

## ¿Qué son?

Los componentes funcionales son funciones de JavaScript que retornan JSX (elementos de React). Son la forma moderna y recomendada de crear componentes en React.

## Ejemplos en el código

### Componente básico sin props

```tsx
export const GifsApp = () => {
  return (
    <>
      {/* Contenido del componente */}
    </>
  );
};
```

### Componente con props (tipo FC)

```tsx
import type { FC } from "react";

interface CustomHeaderProps {
  title: string;
  description?: string;
}

export const CustomHeader: FC<CustomHeaderProps> = ({ title, description }) => {
  return (
    <div className="content-center">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};
```

### Componente con props (desestructuración directa)

```tsx
interface CustomHeaderProps {
  title: string;
  description?: string;
}

export const CustomHeader = ({ title, description }: CustomHeaderProps) => {
  return (
    <div className="content-center">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};
```

## Conceptos clave

1. **Exportación nombrada**: Se usa `export const` para poder importar el componente por su nombre
2. **Arrow functions**: Sintaxis moderna de JavaScript para definir funciones
3. **JSX**: Mezcla de JavaScript y HTML que React transforma en elementos
4. **Props**: Parámetros que recibe el componente para personalizarlo
5. **TypeScript**: Las interfaces definen el tipo de datos que reciben las props
6. **FC (FunctionComponent)**: Tipo de TypeScript que indica que es un componente funcional
7. **Desestructuración**: `{ title, description }` extrae las propiedades directamente del objeto props

## ¿Cuándo usar FC vs desestructuración directa?

- **FC**: Más explícito, indica claramente que es un componente de React
- **Desestructuración directa**: Más conciso, igual de válido

Ambas formas son correctas y ampliamente usadas en la comunidad de React.
