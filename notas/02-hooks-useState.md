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
