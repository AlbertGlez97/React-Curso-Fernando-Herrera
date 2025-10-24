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

## Fragmentos en React

Los **Fragmentos** permiten agrupar múltiples elementos sin agregar nodos extra al DOM. Esto es útil cuando un componente debe retornar múltiples elementos hermanos.

### ¿Por qué usar Fragmentos?

**Problema:** Los componentes deben retornar UN SOLO elemento raíz.

```tsx
// ❌ ERROR - Múltiples elementos raíz
export const MyComponent = () => {
  return (
    <h1>Hola Mundo</h1>
    <p>Este es un párrafo</p>  // Error!
  );
};
```

**Solución incorrecta:** Agregar un `<div>` innecesario

```tsx
// ⚠️ FUNCIONA, pero contamina el DOM
export const MyComponent = () => {
  return (
    <div>
      <h1>Hola Mundo</h1>
      <p>Este es un párrafo</p>
    </div>
  );
};
```

**Solución correcta:** Usar Fragment

### Forma 1: Fragment con importación

```tsx
import { Fragment } from 'react';

export const MyComponent = () => {
  return (
    <Fragment>
      <h1>Hola Mundo</h1>
      <p>Este es un párrafo</p>
    </Fragment>
  );
};
```

### Forma 2: Sintaxis abreviada (más común)

```tsx
// ✅ RECOMENDADO - Sintaxis corta de Fragment
export const MyComponent = () => {
  return (
    <>
      <h1>Hola Mundo</h1>
      <p>Este es un párrafo</p>
    </>
  );
};
```

La sintaxis `<>...</>` no requiere importación y es más limpia.

### Ejemplo en el proyecto

```tsx
export const GifsApp = () => {
  return (
    <>
      <CustomHeader title="Buscador de Gifs" description="..." />
      <SearchBar placeholder="Buscar gifs..." onQuery={handleSearch} />
      <PreviousSearches searches={previousTerms} onlabelClicked={handleTermClicked} />
      <GifList gifs={gifs} />
    </>
  );
};
```

### Ventajas de los Fragmentos

1. **No contamina el DOM**: No agrega divs innecesarios
2. **Mejor rendimiento**: Menos nodos en el DOM = más rápido
3. **CSS más limpio**: No afecta el diseño con contenedores extra
4. **Semántica correcta**: Mantiene la estructura HTML adecuada

### Comentarios en JSX

**Importante:** Dentro de JSX, los comentarios HTML tradicionales NO funcionan.

```tsx
// ❌ NO funciona
<>
  <!-- Este es un comentario -->
  <h1>Hola</h1>
</>

// ✅ SÍ funciona - Expresión de JavaScript con comentario interno
<>
  {/* Este es un comentario en JSX */}
  <h1>Hola</h1>
</>
```

## Conceptos clave

1. **Exportación nombrada**: Se usa `export const` para poder importar el componente por su nombre
2. **Arrow functions**: Sintaxis moderna de JavaScript para definir funciones
3. **JSX**: Mezcla de JavaScript y HTML que React transforma en elementos
4. **Fragmentos**: Agrupan elementos sin agregar nodos extra al DOM (`<>...</>`)
5. **Props**: Parámetros que recibe el componente para personalizarlo
6. **TypeScript**: Las interfaces definen el tipo de datos que reciben las props
7. **FC (FunctionComponent)**: Tipo de TypeScript que indica que es un componente funcional
8. **Desestructuración**: `{ title, description }` extrae las propiedades directamente del objeto props

## ¿Cuándo usar FC vs desestructuración directa?

- **FC**: Más explícito, indica claramente que es un componente de React
- **Desestructuración directa**: Más conciso, igual de válido

Ambas formas son correctas y ampliamente usadas en la comunidad de React.
