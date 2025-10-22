# Listas y Keys en React

## Renderizado de listas

En React, usas el método `.map()` de JavaScript para transformar arrays en elementos JSX.

## Sintaxis básica

```tsx
{array.map((elemento) => (
  <ComponenteOElemento key={elemento.id} />
))}
```

## Ejemplos en el código

### 1. Lista de strings

```tsx
{searches.map((search) => (
  <li key={search} onClick={() => onlabelClicked(search)}>
    {search}
  </li>
))}
```

**Desglose:**
- `searches`: Array de strings `["react", "vue", "angular"]`
- `search`: Cada string individual en la iteración
- `key={search}`: Usa el string como identificador único
- Retorna un `<li>` por cada búsqueda

### 2. Lista de objetos

```tsx
{gifs.map((gif) => (
  <div key={gif.id} className="gif-card">
    <img src={gif.url} alt={gif.title} />
    <h3>{gif.title}</h3>
    <p>{gif.width} x {gif.height}</p>
  </div>
))}
```

**Desglose:**
- `gifs`: Array de objetos Gif
- `gif`: Cada objeto en la iteración
- `key={gif.id}`: Usa el ID único del gif
- Retorna un `<div>` completo con toda la estructura

## La propiedad `key`

### ¿Por qué es necesaria?

React necesita identificar qué elementos cambiaron, se agregaron o eliminaron. La `key` ayuda a React a optimizar el renderizado.

### Reglas para keys

1. **Debe ser única** entre elementos hermanos
2. **Debe ser estable** (no cambiar entre renderizados)
3. **Debe ser predecible** (siempre la misma para el mismo elemento)

### ✅ Buenas prácticas

```tsx
// Con ID único del objeto
<div key={gif.id}>

// Con valor único del string (si no se repite)
<li key={search}>

// Con ID de base de datos
<Usuario key={usuario.dbId} />
```

### ❌ Malas prácticas

```tsx
// ❌ Usar el índice (solo si el array NUNCA cambia)
{items.map((item, index) => (
  <div key={index}>
))}

// ❌ Usar valores aleatorios
<div key={Math.random()}>

// ❌ Usar Date.now()
<div key={Date.now()}>
```

### ¿Por qué no usar el índice?

El índice puede causar problemas si:
- Reordenas la lista
- Agregas/eliminas elementos
- Filtras la lista

**Ejemplo del problema:**
```tsx
// Array inicial
["react", "vue", "angular"]  → keys: [0, 1, 2]

// Eliminas "vue"
["react", "angular"]  → keys: [0, 1]

// React piensa que "angular" es "vue" porque tiene key={1}
```

## Map: Explicación detallada

### Sin React (JavaScript puro)
```tsx
const numeros = [1, 2, 3];
const dobles = numeros.map((num) => num * 2);
console.log(dobles); // [2, 4, 6]
```

### Con React (JSX)
```tsx
const numeros = [1, 2, 3];

return (
  <ul>
    {numeros.map((num) => (
      <li key={num}>{num}</li>
    ))}
  </ul>
);

// Resultado:
// <ul>
//   <li>1</li>
//   <li>2</li>
//   <li>3</li>
// </ul>
```

## Paréntesis vs llaves en map

### Con paréntesis (retorno implícito)
```tsx
{gifs.map((gif) => (
  <div key={gif.id}>
    <img src={gif.url} />
  </div>
))}
```

### Con llaves (retorno explícito)
```tsx
{gifs.map((gif) => {
  return (
    <div key={gif.id}>
      <img src={gif.url} />
    </div>
  );
})}
```

### Con llaves y lógica adicional
```tsx
{gifs.map((gif) => {
  const esPar = gif.id % 2 === 0;
  const clase = esPar ? 'par' : 'impar';

  return (
    <div key={gif.id} className={clase}>
      <img src={gif.url} />
    </div>
  );
})}
```

## Listas vacías

```tsx
{gifs.length === 0 ? (
  <p>No hay GIFs</p>
) : (
  gifs.map((gif) => (
    <div key={gif.id}>
      <img src={gif.url} />
    </div>
  ))
)}
```

## Listas anidadas

```tsx
{categorias.map((categoria) => (
  <div key={categoria.id}>
    <h2>{categoria.nombre}</h2>
    <ul>
      {categoria.items.map((item) => (
        <li key={item.id}>{item.nombre}</li>
      ))}
    </ul>
  </div>
))}
```

## Componentes en listas

### Opción 1: Inline
```tsx
{gifs.map((gif) => (
  <GifCard key={gif.id} gif={gif} />
))}
```

### Opción 2: Componente extraído
```tsx
export const GifList = ({ gifs }) => {
  return (
    <div className="gifs-container">
      {gifs.map((gif) => (
        <GifCard key={gif.id} gif={gif} />
      ))}
    </div>
  );
};
```

**Importante:** La `key` va en el componente más externo del `map`, no dentro del componente hijo.

## Filter + Map (patrón común)

```tsx
{gifs
  .filter((gif) => gif.rating === 'g')  // Primero filtra
  .map((gif) => (                        // Luego mapea
    <div key={gif.id}>
      <img src={gif.url} />
    </div>
  ))
}
```

## Errores comunes

### 1. Olvidar la key
```tsx
// ⚠️ Warning en consola
{gifs.map((gif) => (
  <div>  {/* Falta key */}
    <img src={gif.url} />
  </div>
))}
```

### 2. Key en el hijo incorrecto
```tsx
// ❌ Incorrecto
{gifs.map((gif) => (
  <div>
    <img key={gif.id} src={gif.url} />  {/* Key en lugar incorrecto */}
  </div>
))}

// ✅ Correcto
{gifs.map((gif) => (
  <div key={gif.id}>  {/* Key en el elemento raíz del map */}
    <img src={gif.url} />
  </div>
))}
```
