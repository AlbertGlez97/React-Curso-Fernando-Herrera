# Renderizado Condicional

## ¿Qué es?

El renderizado condicional es mostrar u ocultar elementos según condiciones. En React, usas JavaScript normal para controlar qué se renderiza.

## Técnicas en el código

### 1. Operador AND (&&)

Muestra el elemento solo si la condición es verdadera:

```tsx
{description && <p>{description}</p>}
```

**¿Cómo funciona?**
- Si `description` tiene valor → renderiza el `<p>`
- Si `description` es `undefined`, `null`, `""` → no renderiza nada

**Ejemplo completo:**
```tsx
interface CustomHeaderProps {
  title: string;
  description?: string;  // Opcional
}

export const CustomHeader = ({ title, description }: CustomHeaderProps) => {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};
```

**Casos de uso:**
```tsx
// Con string vacío
description = ""  →  No renderiza (string vacío es falsy)

// Con string con valor
description = "Hola"  →  Renderiza <p>Hola</p>

// Con undefined
description = undefined  →  No renderiza
```

### 2. Operador ternario (? :)

Renderiza una cosa u otra según la condición:

```tsx
{gifs.length > 0 ? (
  <GifList gifs={gifs} />
) : (
  <p>No hay resultados</p>
)}
```

**Sintaxis:**
```tsx
{condición ? siVerdadero : siFalso}
```

### 3. Renderizado de listas con map

```tsx
{gifs.map((gif) => (
  <div key={gif.id}>
    <img src={gif.url} alt={gif.title} />
  </div>
))}
```

**Si el array está vacío:** No renderiza nada (map sobre array vacío = array vacío)

### 4. Early return

Retornar antes si no se cumple una condición:

```tsx
export const GifList: FC<GifListProps> = ({ gifs }) => {
  if (gifs.length === 0) {
    return <p>No hay GIFs para mostrar</p>;
  }

  return (
    <div className="gifs-container">
      {gifs.map((gif) => (
        <div key={gif.id}>
          <img src={gif.url} alt={gif.title} />
        </div>
      ))}
    </div>
  );
};
```

## Comparación de técnicas

### AND (&&)
```tsx
{condición && <Componente />}
```
- **Usa cuando:** Quieres mostrar algo o nada
- **Retorna:** Componente o `null`

### Ternario (? :)
```tsx
{condición ? <ComponenteA /> : <ComponenteB />}
```
- **Usa cuando:** Quieres mostrar una cosa u otra
- **Retorna:** ComponenteA o ComponenteB

### If/Else con variables
```tsx
let contenido;
if (condición) {
  contenido = <ComponenteA />;
} else {
  contenido = <ComponenteB />;
}

return <div>{contenido}</div>;
```
- **Usa cuando:** La lógica es compleja
- **Más legible** para condiciones complicadas

## Casos comunes

### Mostrar loading
```tsx
{isLoading && <p>Cargando...</p>}
```

### Mensaje cuando lista vacía
```tsx
{gifs.length === 0 && <p>No hay resultados</p>}
```

### Toggle de contenido
```tsx
{isOpen ? <MenuExpandido /> : <MenuColapsado />}
```

### Renderizado según estado
```tsx
{status === 'loading' && <Spinner />}
{status === 'error' && <Error mensaje={errorMsg} />}
{status === 'success' && <Datos datos={data} />}
```

## Múltiples condiciones

```tsx
{condición1 && condición2 && <Componente />}

// Equivalente a:
{condición1 && (
  condición2 && <Componente />
)}
```

## Valores falsy en JavaScript

Estos valores NO renderizarán con `&&`:
- `false`
- `null`
- `undefined`
- `0` (¡cuidado! este sí se renderiza como "0")
- `""` (string vacío)
- `NaN`

**Trampa común con números:**
```tsx
{items.length && <Lista items={items} />}
```
Si `items.length === 0`, renderiza "0" en pantalla. Mejor:
```tsx
{items.length > 0 && <Lista items={items} />}
```

## Con arrays

```tsx
// Si searches está vacío, no renderiza nada
{searches.length > 0 && (
  <div>
    <h2>Búsquedas previas</h2>
    <ul>
      {searches.map((search) => (
        <li key={search}>{search}</li>
      ))}
    </ul>
  </div>
)}
```
