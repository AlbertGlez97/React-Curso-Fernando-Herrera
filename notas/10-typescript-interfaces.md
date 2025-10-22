# TypeScript e Interfaces

## ¿Qué es TypeScript?

TypeScript es JavaScript con tipos. Te ayuda a detectar errores antes de ejecutar el código.

## Interfaces

Las interfaces definen la "forma" (estructura) de un objeto.

### Sintaxis básica

```tsx
interface NombreInterface {
  propiedad: tipo;
  otraPropiedad: tipo;
}
```

## Ejemplos en el código

### 1. Interface para componentes (Props)

```tsx
interface CustomHeaderProps {
  title: string;
  description?: string;  // ? = opcional
}

export const CustomHeader: FC<CustomHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};
```

**Beneficios:**
- ✅ Autocompletado en el editor
- ✅ Errores si faltan props requeridas
- ✅ Errores si el tipo de dato es incorrecto

### 2. Interface para datos de la aplicación

```tsx
export interface Gif {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
}
```

**Uso:**
```tsx
const [gifs, setGifs] = useState<Gif[]>([]);
```

### 3. Interface para respuestas de API

```tsx
export interface GiphyResponse {
  data: Array<{
    id: string;
    title: string;
    images: {
      original: {
        url: string;
        width: string;
        height: string;
      };
    };
  }>;
}
```

**Uso:**
```tsx
const response = await giphyApi.get<GiphyResponse>('/search');
// TypeScript sabe qué propiedades tiene response.data
```

## Propiedades opcionales

```tsx
interface Props {
  required: string;      // Requerida
  optional?: string;     // Opcional (? después del nombre)
}
```

**Uso:**
```tsx
// ✅ Válido
<Component required="hola" />

// ✅ Válido
<Component required="hola" optional="mundo" />

// ❌ Error - falta required
<Component optional="mundo" />
```

## Tipos primitivos

```tsx
interface Example {
  texto: string;
  numero: number;
  booleano: boolean;
  nulo: null;
  indefinido: undefined;
  cualquiera: any;        // Evita usar 'any'
}
```

## Arrays

```tsx
interface Props {
  nombres: string[];           // Array de strings
  numeros: number[];           // Array de números
  gifs: Gif[];                 // Array de objetos Gif
  matriz: number[][];          // Array de arrays
}
```

## Funciones en interfaces

```tsx
interface SearchBarProps {
  placeholder: string;
  onQuery: (query: string) => void;  // Función que recibe string y no retorna nada
}
```

**Desglose:**
- `(query: string)`: Parámetro de entrada
- `=> void`: No retorna nada
- `=> string`: Retornaría un string
- `=> Promise<Gif[]>`: Retorna una promesa de array de Gif

**Ejemplos de tipos de funciones:**
```tsx
interface Actions {
  onClick: () => void;                           // Sin parámetros
  onSave: (data: string) => void;                // Con parámetro
  onSearch: (query: string) => Promise<Gif[]>;   // Async
  onValidate: (text: string) => boolean;         // Retorna boolean
}
```

## Type vs Interface

### Interface
```tsx
interface User {
  name: string;
  age: number;
}
```

### Type
```tsx
type User = {
  name: string;
  age: number;
};
```

**¿Cuál usar?**
- **Interface**: Para objetos y componentes React (convención común)
- **Type**: Para uniones, intersecciones, y tipos más complejos

## Uniones de tipos (Union Types)

```tsx
type Status = 'loading' | 'success' | 'error';

interface State {
  status: Status;  // Solo puede ser uno de esos tres valores
}
```

**Uso:**
```tsx
const [status, setStatus] = useState<Status>('loading');

setStatus('success');   // ✅ OK
setStatus('pending');   // ❌ Error - no es un valor válido
```

## Extendiendo interfaces

```tsx
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
}

// Dog tiene: name, age, breed
```

## Interfaces anidadas

```tsx
interface GiphyResponse {
  data: Array<{
    id: string;
    images: {
      original: {
        url: string;
        width: string;
      };
    };
  }>;
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}
```

## Genéricos en TypeScript

### En useState
```tsx
const [gifs, setGifs] = useState<Gif[]>([]);
//                                ^^^^^ Tipo genérico
```

### En funciones
```tsx
const getGifsByQuery = async (query: string): Promise<Gif[]> => {
  // ...
};
//                                             ^^^^^^^^^^^^
//                                             Retorna Promise de Gif[]
```

### En Axios
```tsx
const response = await axios.get<GiphyResponse>('/search');
//                                ^^^^^^^^^^^^^^
//                                Tipo de response.data
```

## React.FC (FunctionComponent)

```tsx
import type { FC } from 'react';

interface Props {
  title: string;
}

export const Component: FC<Props> = ({ title }) => {
  return <h1>{title}</h1>;
};
```

**Alternativa sin FC:**
```tsx
export const Component = ({ title }: Props) => {
  return <h1>{title}</h1>;
};
```

Ambas son válidas, FC es más explícito.

## Tipos para eventos

```tsx
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log(event.clientX);
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  console.log(event.key);
};
```

## Importación de tipos

```tsx
// Importación normal
import { FC } from 'react';

// Importación solo de tipo (no afecta bundle)
import type { FC } from 'react';
import type { Gif } from './interfaces/gif.interface';
```

**Usa `import type` cuando:**
- Solo importas el tipo, no valores
- Quieres que el bundler elimine el import completamente

## Type assertion (conversión de tipos)

```tsx
const width = Number(gif.images.original.width);
//            ^^^^^^ Convierte string a number

// Alternativa
const width = gif.images.original.width as number;
```

## Errores comunes y soluciones

### Error: Type 'string' is not assignable to type 'number'
```tsx
// ❌ Error
const edad: number = "25";

// ✅ Solución
const edad: number = 25;
// o
const edad: number = Number("25");
```

### Error: Property 'descripcion' does not exist
```tsx
interface Props {
  titulo: string;
}

// ❌ Error
<Component titulo="Hola" descripcion="Mundo" />

// ✅ Solución: Agrega la propiedad a la interface
interface Props {
  titulo: string;
  descripcion?: string;  // Opcional
}
```

### Error: Argument of type 'string' is not assignable to parameter of type 'never'
```tsx
// ❌ Error - useState sin tipo infiere never[]
const [items, setItems] = useState([]);
setItems(['item']);  // Error

// ✅ Solución - especifica el tipo
const [items, setItems] = useState<string[]>([]);
setItems(['item']);  // OK
```

## Beneficios de TypeScript

1. **Autocompletado**: El editor sugiere propiedades y métodos
2. **Detección de errores**: Errores antes de ejecutar el código
3. **Refactoring seguro**: Cambiar nombres y estructuras con confianza
4. **Documentación**: Los tipos documentan cómo usar el código
5. **Mejor DX**: Experiencia de desarrollo mejorada
