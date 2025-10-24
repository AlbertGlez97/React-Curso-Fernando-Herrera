# Hook: useState

## ¿Qué es?

`useState` es un Hook de React que permite agregar estado a componentes funcionales. El estado es información que el componente "recuerda" entre renderizados.

## Sintaxis básica

```tsx
const [valor, setValor] = useState(valorInicial);
```

- `valor`: Variable que contiene el estado actual
- `setValor`: Función para actualizar el estado
- `valorInicial`: Valor con el que inicia el estado

## Ejemplos en el código

### Estado con array de strings

```tsx
const [previousTerms, setPreviousTerms] = useState<string[]>([]);
```

- Inicia con un array vacío `[]`
- `<string[]>` indica que el tipo es un array de strings
- Se actualiza agregando nuevos términos de búsqueda

### Estado con array de objetos

```tsx
const [gifs, setGifs] = useState<Gif[]>([]);
```

- Inicia con un array vacío
- `<Gif[]>` indica que contendrá objetos del tipo `Gif`
- Se actualiza con los GIFs recibidos de la API

### Estado con string

```tsx
const [query, setQuery] = useState("");
```

- Inicia con un string vacío
- Se actualiza cada vez que el usuario escribe en el input

## Actualizando el estado

### Reemplazo simple

```tsx
setGifs(gifs); // Reemplaza completamente el estado
setQuery(""); // Limpia el input
```

### Actualización basada en el estado anterior

```tsx
setPreviousTerms([querySearch, ...previousTerms].splice(0, 8));
```

- Crea un nuevo array con el nuevo término al inicio
- `...previousTerms` expande el array anterior
- `.splice(0, 8)` mantiene solo los primeros 8 elementos

## Reglas importantes

1. **Inmutabilidad**: Nunca modifiques el estado directamente, siempre usa la función set

   - ❌ `previousTerms.push("nuevo")`
   - ✅ `setPreviousTerms([...previousTerms, "nuevo"])`

2. **El estado es asíncrono**: El cambio no ocurre inmediatamente

   ```tsx
   setQuery("nuevo");
   console.log(query); // Aún tiene el valor anterior
   ```

3. **Renderizado**: Cada vez que cambias el estado, React re-renderiza el componente

4. **TypeScript**: Define el tipo del estado para evitar errores
   ```tsx
   useState<Tipo>(valorInicial);
   ```

## Otros Hooks de React

`useState` es solo uno de los muchos hooks que React ofrece. Aquí está la lista completa:

### Hooks Básicos

Estos hooks los encontrarás en toda aplicación de React:

| Hook | Descripción |
|------|-------------|
| **useState** | Maneja un estado local en el componente |
| **useEffect** | Ejecuta efectos secundarios y limpieza al desmontar el componente |
| **useContext** | Accede al valor alojado en el contexto (árbol de componentes) |

### Hooks Adicionales

Hooks que ofrecen comportamientos adicionales:

| Hook | Descripción |
|------|-------------|
| **useReducer** | Alternativa al useState para lógica compleja (similar a Redux) |
| **useRef** | Referencias mutables que no causan re-render |
| **useMemo** | Memoriza valores para evitar volverlos a calcular entre re-renders |
| **useCallback** | Memoriza funciones para evitar recreaciones innecesarias |
| **useLayoutEffect** | Similar al useEffect, pero sincronizado justo después del render |
| **useImperativeHandle** | Expone métodos desde un componente con forwardRef |

### Hooks Relacionados al DOM

Hooks orientados a información del DOM:

| Hook | Descripción |
|------|-------------|
| **useDeferredValue** | Difiere valores para mejorar el rendimiento entre re-renders |
| **useTransition** | Permite renderizar partes del UI en el background (actualizaciones no urgentes) |
| **useInsertionEffect** | Se ejecuta antes del render para estilos dinámicos |

### Hooks Modernos (React 18+)

Los últimos hooks añadidos a React:

| Hook | Descripción |
|------|-------------|
| **useFormStatus** | Lee el estado de un `<form>`, el último posteo |
| **useActionState** | Actualiza el estado basado en el resultado de un posteo de formulario |
| **useOptimistic** | Muestra valores optimistas antes de que una acción sea resuelta |

### Ejemplo de comparación: useState vs useReducer

```tsx
// Con useState (simple)
const [count, setCount] = useState(0);
setCount(count + 1);

// Con useReducer (lógica compleja)
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'INCREMENT' });
```

### useRef - Referencias sin re-renders

Ya usamos `useRef` en nuestro proyecto para el cache:

```tsx
const gifsCache = useRef<Record<string, Gif[]>>({});

// Modificar NO causa re-render
gifsCache.current['cats'] = [...]; // Sin re-render
```

**Diferencia clave:**
- `useState` → Cambios causan re-render
- `useRef` → Cambios NO causan re-render

---

**Pro Tip:** Aprende los hooks básicos primero (useState, useEffect, useContext) antes de explorar los avanzados.
