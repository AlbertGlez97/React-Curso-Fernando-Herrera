# Conceptos de React

## Componentes

### Anatomía de un Componente

Un componente de React es una función que retorna JSX (JavaScript XML).

```typescript
export function MyComponent() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
```

### Props (Propiedades)

Las props permiten pasar datos de un componente padre a un componente hijo.

**Definición de Props con TypeScript:**
```typescript
// Opción 1: Inline
export function MyAwesomeApp({
  name,
  lastName,
}: {
  name: string;
  lastName: string;
}) {
  return <h1>Hola {name} {lastName}</h1>;
}

// Opción 2: Interface
interface Product {
  productName: string;
  quantity?: number; // El ? indica que es opcional
}

const ItemCounter = ({ productName, quantity = 1 }: Product) => {
  return <div>{productName}: {quantity}</div>;
};
```

**Props con valores por defecto:**
```typescript
interface Product {
  productName: string;
  quantity?: number;
}

// Valor por defecto usando destructuring
const ItemCounter = ({ productName, quantity = 1 }: Product) => {
  // Si quantity no se pasa, será 1 por defecto
};
```

### Tipos de Exportación

#### Default Export
Usado típicamente para el componente principal de un archivo:

```typescript
const ItemCounter = ({ productName }: Product) => {
  return <div>{productName}</div>;
};

export default ItemCounter;
```

**Importación:**
```typescript
import ItemCounter from "./ItemCounter";
```

#### Named Export
Usado para exportar múltiples elementos o componentes secundarios:

```typescript
export function FirstStepsApp() {
  return <div>App</div>;
}
```

**Importación:**
```typescript
import { FirstStepsApp } from "./FirstStepsApp";
```

## Estado (State)

El estado permite que los componentes "recuerden" información entre renders.

### useState Hook

```typescript
import { useState } from "react";

const ItemCounter = ({ quantity = 1 }: Product) => {
  // useState retorna [valor, función para actualizar el valor]
  const [count, setCount] = useState(quantity);

  const handleAdd = () => {
    setCount(count + 1); // Actualiza el estado
  };

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleAdd}>+1</button>
    </div>
  );
};
```

**Puntos clave:**
- El estado es **privado** del componente
- Cuando el estado cambia, el componente se **re-renderiza**
- Puedes inicializar el estado con un valor de las props
- NUNCA modifiques el estado directamente, usa siempre la función setter

### Actualización del Estado

```typescript
// ✅ Correcto
setCount(count + 1);

// ❌ Incorrecto
count = count + 1; // No hacer esto!
```

## Renderizado de Listas

Para renderizar múltiples elementos, usa el método `.map()` de JavaScript.

```typescript
interface ItemInCart {
  id: number;
  productName: string;
  quantity: number;
}

const itemsInCart: ItemInCart[] = [
  { id: 2, productName: "Xbox", quantity: 1 },
  { id: 3, productName: "Nintendo", quantity: 2 },
  { id: 4, productName: "Play Station", quantity: 3 },
];

export function FirstStepsApp() {
  return (
    <>
      {itemsInCart.map((item) => (
        <ItemCounter
          key={item.id} // La prop key es OBLIGATORIA
          productName={item.productName}
          quantity={item.quantity}
        />
      ))}
    </>
  );
}
```

**Importancia de la prop `key`:**
- Ayuda a React a identificar qué elementos han cambiado
- Debe ser **única** entre hermanos
- Preferiblemente usa un ID único, no el índice del array

## Estilos en React

### 1. Estilos Inline con Objetos

```typescript
import type { CSSProperties } from "react";

const myStyles: CSSProperties = {
  backgroundColor: "#fafafa",
  borderRadius: 10,
  padding: 10,
};

export function MyComponent() {
  return <h1 style={myStyles}>Título</h1>;
}
```

### 2. Estilos Inline Directos

```typescript
export function MyComponent() {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
      Contenido
    </div>
  );
}
```

### 3. CSS Modules

Los CSS Modules permiten estilos con scope local, evitando conflictos de nombres.

**ItemCounter.module.css:**
```css
.item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.item-text {
  font-weight: bold;
}
```

**ItemCounter.tsx:**
```typescript
import styles from "./ItemCounter.module.css";

const ItemCounter = () => {
  return (
    <section className={styles["item-row"]}>
      <span className={styles["item-text"]}>Producto</span>
    </section>
  );
};
```

**Ventajas de CSS Modules:**
- Estilos con scope local (no afectan otros componentes)
- Autocompletado en el IDE
- Evita conflictos de nombres de clases

### 4. Estilos Dinámicos

Combina estilos estáticos con dinámicos:

```typescript
const ItemCounter = ({ productName, quantity = 1 }: Product) => {
  const [count, setCount] = useState(quantity);

  return (
    <span
      className={styles["item-text"]}
      style={{ color: count === 1 ? "red" : "black" }}
    >
      {productName}
    </span>
  );
};
```

## Manejo de Eventos

Los eventos en React se manejan de forma similar a JavaScript vanilla, pero con algunas diferencias.

### onClick

```typescript
const handleAdd = () => {
  setCount(count + 1);
};

return <button onClick={handleAdd}>+1</button>;
```

**Alternativa inline:**
```typescript
<button onClick={() => setCount(count + 1)}>+1</button>
```

### Prevenir Comportamientos por Defecto

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault(); // Previene el envío del formulario
  // Lógica del formulario
};

return <form onSubmit={handleSubmit}>...</form>;
```

## Renderizado Condicional

### Operador Ternario

```typescript
{count === 1 ? <span>Un item</span> : <span>{count} items</span>}
```

### Operador AND (&&)

```typescript
{count > 5 && <span>¡Muchos items!</span>}
```

### If/Else con Variables

```typescript
let message;
if (count === 1) {
  message = <span style={{ color: 'red' }}>¡Último item!</span>;
} else {
  message = <span>{count} items</span>;
}

return <div>{message}</div>;
```

## Fragmentos

Los fragmentos (`<>...</>`) permiten agrupar elementos sin agregar nodos extra al DOM.

```typescript
// ✅ Con Fragment
export function MyComponent() {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  );
}

// ❌ Sin Fragment (agrega un div innecesario)
export function MyComponent() {
  return (
    <div>
      <h1>Título</h1>
      <p>Párrafo</p>
    </div>
  );
}
```

**Fragment con key (para listas):**
```typescript
import { Fragment } from "react";

{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
))}
```

## TypeScript en React

### Tipos para Props

```typescript
interface ComponentProps {
  name: string;
  age?: number; // Opcional
  isActive: boolean;
  onClick: () => void; // Función
  children: React.ReactNode; // Para componentes hijos
}
```

### Tipos para Eventos

```typescript
// Click
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget);
};

// Change (inputs)
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Submit (formularios)
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

### Tipos para useState

```typescript
// React infiere el tipo automáticamente
const [count, setCount] = useState(0); // number

// Tipo explícito
const [name, setName] = useState<string>("");

// Tipo con posibles valores undefined
const [user, setUser] = useState<User | undefined>();
```

## Mejores Prácticas

### 1. Declarar Constantes Fuera del Componente

**⚠️ Importante:** Las constantes que no dependen del estado o props deben declararse **fuera** del componente para evitar que se recreen en cada render.

```typescript
// ✅ Correcto - Fuera del componente
const myStyles: CSSProperties = {
  backgroundColor: "#fafafa",
  borderRadius: 10,
};

export function MyComponent() {
  return <div style={myStyles}>Contenido</div>;
}

// ❌ Incorrecto - Dentro del componente
export function MyComponent() {
  const myStyles: CSSProperties = {
    backgroundColor: "#fafafa",
    borderRadius: 10,
  };
  return <div style={myStyles}>Contenido</div>;
}
```

### 2. Lógica de Negocio

Separa la lógica de negocio en funciones helper fuera de los componentes:

```typescript
// helpers/math.helper.ts
export const add = (a: number, b: number): number => {
  return a + b;
};

// Component.tsx
import { add } from "./helpers/math.helper";

export function Calculator() {
  const result = add(5, 3);
  return <div>{result}</div>;
}
```

### 3. Nombres Descriptivos

```typescript
// ✅ Descriptivo
const handleAddToCart = () => {};
const isUserLoggedIn = true;

// ❌ Poco claro
const handle = () => {};
const flag = true;
```

### 4. Desestructuración de Props

```typescript
// ✅ Recomendado
const ItemCounter = ({ productName, quantity = 1 }: Product) => {
  return <div>{productName}</div>;
};

// ❌ Menos legible
const ItemCounter = (props: Product) => {
  return <div>{props.productName}</div>;
};
```

### 5. Validaciones en Eventos

```typescript
const handleAdd = () => {
  if (count >= 10) return; // Validación temprana
  setCount(count + 1);
};

const handleSubtract = () => {
  if (count === 1) return; // Previene valores negativos
  setCount(count - 1);
};
```

## Recursos Adicionales

- [React Docs (Oficial)](https://react.dev/)
- [TypeScript con React](https://react-typescript-cheatsheet.netlify.app/)
- [Hooks Reference](https://react.dev/reference/react)
