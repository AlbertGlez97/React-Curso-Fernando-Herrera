# Eventos en React

## ¿Qué son?

Los eventos en React son acciones del usuario (clicks, teclas, cambios en inputs) que puedes capturar y manejar con funciones.

## Sintaxis

```tsx
<elemento onEvento={manejador} />
```

## Eventos comunes en el código

### 1. onClick - Click en elementos

```tsx
// En un botón
<button onClick={handleSearch}>Buscar</button>

// En un elemento de lista
<li onClick={() => onlabelClicked(search)}>
  {search}
</li>
```

**Dos formas de pasar el manejador:**

#### Forma 1: Referencia directa (sin parámetros)
```tsx
<button onClick={handleSearch}>Buscar</button>

// La función se ejecuta cuando se hace click
const handleSearch = () => {
  onQuery(query);
  setQuery("");
};
```

#### Forma 2: Arrow function inline (con parámetros)
```tsx
<li onClick={() => onlabelClicked(search)}>
  {search}
</li>

// Permite pasar parámetros al manejador
```

### 2. onChange - Cambios en inputs

```tsx
<input
  type="text"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
/>
```

**Elementos clave:**
- `event`: Objeto que contiene información del evento
- `event.target`: El elemento que disparó el evento (el input)
- `event.target.value`: El valor actual del input

### 3. onKeyDown - Teclas presionadas

```tsx
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.keyCode === 13) {  // 13 = Enter
    handleSearch();
  }
};

<input onKeyDown={handleKeyDown} />
```

## Tipado de eventos en TypeScript

### Evento de teclado
```tsx
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  // event.keyCode, event.key, etc.
};
```

### Evento de input (onChange)
```tsx
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};
```

### Evento de click
```tsx
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // event.clientX, event.clientY, etc.
};
```

## Event Handlers (Manejadores de eventos)

### Definición en el componente

```tsx
export const SearchBar: FC<SearchBarProps> = ({ placeholder, onQuery }) => {
  const handleSearch = () => {
    onQuery(query);
    setQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <div>
      <input onKeyDown={handleKeyDown} />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};
```

### Convención de nombres

- `handleNombreEvento`: `handleClick`, `handleSearch`, `handleKeyDown`
- `onNombreEvento` (para props): `onClick`, `onQuery`, `onlabelClicked`

## Prevención del comportamiento por defecto

```tsx
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault(); // Evita que el form recargue la página
  // tu lógica aquí
};

<form onSubmit={handleSubmit}>
```

## Propagación de eventos

```tsx
const handleClick = (event: React.MouseEvent) => {
  event.stopPropagation(); // Evita que el evento suba al padre
};
```

## Comparación: JavaScript vs React

### JavaScript Vanilla
```html
<button onclick="miFuncion()">Click</button>
```

### React
```tsx
<button onClick={miFuncion}>Click</button>
```

**Diferencias:**
1. React usa **camelCase**: `onClick` (no `onclick`)
2. Se pasa la **función**, no un string: `{miFuncion}` (no `"miFuncion()"`)
3. No se ejecuta automáticamente: `{miFuncion}` (no `{miFuncion()}`)

## ¿Cuándo usar arrow function inline?

### ❌ Sin parámetros - NO uses arrow function
```tsx
<button onClick={() => handleClick()}>  // Innecesario
<button onClick={handleClick}>          // Mejor
```

### ✅ Con parámetros - SÍ usa arrow function
```tsx
<li onClick={() => onlabelClicked(search)}>  // Correcto
```

## Key codes comunes

```tsx
event.keyCode === 13  // Enter
event.keyCode === 27  // Escape
event.keyCode === 32  // Espacio
```

**Nota**: `keyCode` está deprecado, se recomienda usar `event.key`:
```tsx
event.key === "Enter"
event.key === "Escape"
```
