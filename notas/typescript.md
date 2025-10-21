# TypeScript en React

## ¿Qué es TypeScript?

TypeScript es un superset de JavaScript que agrega tipado estático. Ayuda a detectar errores en tiempo de desarrollo y mejora la experiencia de desarrollo con autocompletado.

## Conceptos Básicos

### Tipos Primitivos

```typescript
const name: string = "Juan";
const age: number = 25;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;
```

### Arrays

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["Juan", "María", "Pedro"];

// Sintaxis alternativa
const numbers2: Array<number> = [1, 2, 3];
```

### Interfaces

Las interfaces definen la estructura de un objeto.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Propiedad opcional
}

const user: User = {
  id: 1,
  name: "Juan",
  email: "juan@example.com",
  // age es opcional, no es necesario incluirlo
};
```

### Tipos para Funciones

```typescript
// Función con tipo de retorno explícito
const add = (a: number, b: number): number => {
  return a + b;
};

// Función sin retorno
const logMessage = (message: string): void => {
  console.log(message);
};

// Función como tipo
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;
```

## TypeScript en Componentes React

### Props con Interfaces

```typescript
interface Product {
  productName: string;
  quantity?: number;
}

const ItemCounter = ({ productName, quantity = 1 }: Product) => {
  return (
    <div>
      {productName}: {quantity}
    </div>
  );
};
```

### Props Inline

```typescript
export function MyAwesomeApp({
  name,
  lastName,
}: {
  name: string;
  lastName: string;
}) {
  return <h1>Hola {name} {lastName}</h1>;
}
```

### Props con Children

```typescript
interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};
```

## Tipos para Eventos

### Eventos de Mouse

```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log("Clicked!", e.currentTarget);
};

const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
  console.log("Div clicked!", e.clientX, e.clientY);
};
```

### Eventos de Formulario

```typescript
// Change event (inputs, textareas, selects)
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Submit event
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Form submitted");
};

// Focus events
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log("Input focused");
};
```

### Eventos de Teclado

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    console.log("Enter pressed");
  }
};
```

## Tipos para Hooks

### useState

```typescript
// Tipo inferido automáticamente
const [count, setCount] = useState(0); // number

// Tipo explícito
const [name, setName] = useState<string>("");

// Con tipo de objeto
interface User {
  id: number;
  name: string;
}

const [user, setUser] = useState<User | null>(null);

// Con array
const [items, setItems] = useState<string[]>([]);
```

### useEffect

```typescript
import { useEffect } from "react";

useEffect(() => {
  // Función de efecto
  console.log("Component mounted");

  // Función de limpieza (opcional)
  return () => {
    console.log("Component will unmount");
  };
}, []); // Array de dependencias
```

### useRef

```typescript
import { useRef } from "react";

// Para elementos del DOM
const inputRef = useRef<HTMLInputElement>(null);

// Para valores mutables
const countRef = useRef<number>(0);

const handleClick = () => {
  inputRef.current?.focus();
};
```

## Tipos Avanzados

### Union Types

Permite que una variable tenga uno de varios tipos posibles.

```typescript
type Status = "pending" | "success" | "error";

const [status, setStatus] = useState<Status>("pending");

// En funciones
function printId(id: number | string) {
  console.log(id);
}
```

### Type Aliases

Similar a interfaces, pero más flexible.

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};

type ProductList = Product[];
```

### Intersection Types

Combina múltiples tipos.

```typescript
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: number;
  name: string;
}

type TimestampedProduct = Product & Timestamped;

const product: TimestampedProduct = {
  id: 1,
  name: "Laptop",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Generic Types

Permiten crear componentes reutilizables con diferentes tipos.

```typescript
// Función genérica
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirstElement([1, 2, 3]); // number | undefined
const firstName = getFirstElement(["a", "b", "c"]); // string | undefined

// Componente genérico
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

## Tipos Utility

TypeScript incluye tipos utility que facilitan transformaciones de tipos.

### Partial

Hace todas las propiedades opcionales.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Todas las propiedades son opcionales
const updateUser = (id: number, updates: Partial<User>) => {
  // ...
};

updateUser(1, { name: "New Name" }); // Solo actualiza el nombre
```

### Required

Hace todas las propiedades requeridas.

```typescript
interface Config {
  port?: number;
  host?: string;
}

const config: Required<Config> = {
  port: 3000,
  host: "localhost", // Ahora es obligatorio
};
```

### Pick

Selecciona solo ciertas propiedades.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserPublic = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }
```

### Omit

Excluye ciertas propiedades.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserWithoutPassword = Omit<User, "password">;
// { id: number; name: string; email: string; }
```

### Record

Crea un objeto con claves de un tipo y valores de otro.

```typescript
type Role = "admin" | "user" | "guest";
type Permissions = Record<Role, string[]>;

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
};
```

## Tipos para CSS

### CSSProperties

Tipo para objetos de estilo inline.

```typescript
import type { CSSProperties } from "react";

const buttonStyles: CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 20px",
  borderRadius: 5,
  border: "none",
  cursor: "pointer",
};

const Button = () => <button style={buttonStyles}>Click me</button>;
```

## Aserciones de Tipo

A veces necesitas decirle a TypeScript que sabes más sobre el tipo.

```typescript
// Aserción "as"
const element = document.getElementById("myId") as HTMLInputElement;
element.value = "Hello";

// Non-null assertion (!)
const element2 = document.getElementById("myId")!; // Afirma que NO es null
element2.innerHTML = "Hello";
```

## Type Guards

Verificaciones que ayudan a TypeScript a entender el tipo.

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // TypeScript sabe que es string
  } else {
    console.log(value.toFixed(2)); // TypeScript sabe que es number
  }
}
```

## Mejores Prácticas

### 1. Prefiere Interfaces para Props de Componentes

```typescript
// ✅ Recomendado
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// También válido, pero menos común para props
type ButtonProps = {
  label: string;
  onClick: () => void;
};
```

### 2. Usa Tipos Explícitos para Funciones Exportadas

```typescript
// ✅ Explícito y claro
export const add = (a: number, b: number): number => {
  return a + b;
};

// ❌ Tipo inferido, menos claro
export const add = (a: number, b: number) => {
  return a + b;
};
```

### 3. Evita `any`

```typescript
// ❌ Evitar
const processData = (data: any) => {
  // Se pierde el tipado
};

// ✅ Usa tipos específicos o unknown
const processData = (data: unknown) => {
  if (typeof data === "string") {
    console.log(data.toUpperCase());
  }
};
```

### 4. Usa Opcionales en Lugar de `| undefined`

```typescript
// ✅ Más limpio
interface User {
  name: string;
  age?: number;
}

// ❌ Menos limpio
interface User {
  name: string;
  age: number | undefined;
}
```

### 5. Aprovecha la Inferencia de Tipos

```typescript
// TypeScript puede inferir el tipo
const [count, setCount] = useState(0); // Infiere number

// Solo especifica cuando sea necesario
const [user, setUser] = useState<User | null>(null);
```

## Configuración TypeScript

### tsconfig.json

Configuración principal de TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**Opciones importantes:**
- `strict: true` - Activa todas las verificaciones estrictas
- `noUnusedLocals: true` - Error en variables locales no usadas
- `noUnusedParameters: true` - Error en parámetros no usados
- `jsx: "react-jsx"` - Soporte para JSX moderno

## Recursos Adicionales

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
