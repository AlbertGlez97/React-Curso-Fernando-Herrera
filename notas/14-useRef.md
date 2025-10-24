# Hook: useRef

## ¿Qué es useRef?

`useRef` es un Hook de React que crea una **referencia mutable** que persiste durante toda la vida del componente. A diferencia de `useState`, **modificar un ref NO causa re-renders**.

## Sintaxis básica

```tsx
const miRef = useRef(valorInicial);

// Acceder al valor
console.log(miRef.current);

// Modificar el valor (sin causar re-render)
miRef.current = nuevoValor;
```

## useRef vs useState

| Característica | useState | useRef |
|---------------|----------|--------|
| **Re-render al cambiar** | ✅ Sí | ❌ No |
| **Persiste entre renders** | ✅ Sí | ✅ Sí |
| **Uso principal** | Datos que afectan la UI | Datos auxiliares, referencias DOM |
| **Inmutabilidad** | Requerida | No requerida |

```tsx
// useState - Cambio causa re-render
const [count, setCount] = useState(0);
setCount(1); // ✅ Componente se re-renderiza

// useRef - Cambio NO causa re-render
const countRef = useRef(0);
countRef.current = 1; // ❌ Componente NO se re-renderiza
```

## Casos de uso de useRef

### 1. Cache de datos (nuestro proyecto)

En el proyecto, usamos `useRef` para implementar un **cache de búsquedas**:

```tsx
// src/gifs/hooks/useGifs.tsx
export const useGifs = () => {
  // 📦 Cache usando useRef
  const gifsCache = useRef<Record<string, Gif[]>>({});

  const handleTermClicked = async (term: string) => {
    // 🚀 Revisar cache primero
    if (gifsCache.current[term]) {
      setGifs(gifsCache.current[term]); // Datos instantáneos desde cache
      return;
    }

    // Si no está en cache, hacer petición
    const gifs = await getGifsByQuery(term);
    setGifs(gifs);
  };

  const handleSearch = async (query: string) => {
    // ... validaciones
    const gifs = await getGifsByQuery(querySearch);
    setGifs(gifs);

    // 💾 Guardar en cache para uso futuro
    gifsCache.current[query] = gifs;
  };
};
```

**¿Por qué useRef en lugar de useState para el cache?**

```tsx
// ❌ MAL - Con useState
const [gifsCache, setGifsCache] = useState({});

// Problema: Actualizar el cache causaría re-renders innecesarios
setGifsCache({ ...gifsCache, [term]: gifs }); // Re-render innecesario

// ✅ BIEN - Con useRef
const gifsCache = useRef({});

// Ventaja: Modificar el cache NO causa re-render
gifsCache.current[term] = gifs; // Sin re-render
```

**Ventajas de este patrón:**
1. ✅ **Performance**: No causa re-renders al actualizar el cache
2. ✅ **Persistencia**: Los datos persisten entre renders
3. ✅ **Rapidez**: Búsquedas previas son instantáneas
4. ✅ **Memoria eficiente**: Solo almacenamos lo necesario

### 2. Referencias a elementos DOM

Aunque no lo usamos en este proyecto, es otro caso de uso común:

```tsx
const MyComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    // Acceder al elemento DOM directamente
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Enfocar Input</button>
    </>
  );
};
```

### 3. Guardar valores previos

```tsx
const usePrevious = (value: any) => {
  const previousRef = useRef();

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
};

// Uso
const MyComponent = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Actual: {count}</p>
      <p>Anterior: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};
```

### 4. Timers e Intervals

```tsx
const Timer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <>
      <button onClick={startTimer}>Iniciar</button>
      <button onClick={stopTimer}>Detener</button>
    </>
  );
};
```

### 5. Contador que NO causa re-renders

```tsx
const ClickCounter = () => {
  const clickCountRef = useRef(0);

  const handleClick = () => {
    clickCountRef.current += 1;
    console.log(`Clicks: ${clickCountRef.current}`);
    // No se re-renderiza el componente
  };

  return (
    <button onClick={handleClick}>
      Click me (ver consola)
    </button>
  );
};
```

## Estructura de un ref

Un ref es un objeto con una propiedad `current`:

```tsx
{
  current: valorActual
}
```

```tsx
const myRef = useRef(10);

console.log(myRef); // { current: 10 }
console.log(myRef.current); // 10

myRef.current = 20; // Modificar
console.log(myRef.current); // 20
```

## Tipos en TypeScript

```tsx
// Ref con valor primitivo
const numberRef = useRef<number>(0);

// Ref con objeto
const objectRef = useRef<{ name: string }>({ name: 'John' });

// Ref con array
const arrayRef = useRef<string[]>([]);

// Ref con elemento DOM
const divRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);

// Ref con tipo Record (como en nuestro proyecto)
const cacheRef = useRef<Record<string, Gif[]>>({});
```

## Cuándo usar useRef

### ✅ Usa useRef cuando:

1. **Necesitas guardar datos** que NO deben causar re-renders
2. **Referencias a elementos DOM** para manipularlos directamente
3. **Timers, intervals** que necesitas limpiar después
4. **Cache de datos** que no afectan la UI directamente
5. **Valores previos** que quieres comparar
6. **Contadores internos** que no se muestran en la UI

### ❌ NO uses useRef cuando:

1. Los datos **afectan la UI** → usa `useState`
2. Necesitas que el componente **se re-renderice** al cambiar → usa `useState`
3. Los datos son **props** → pásalos normalmente
4. Necesitas **efectos secundarios** al cambiar → usa `useState` + `useEffect`

## Comparación completa: useState vs useRef

```tsx
const StateVsRef = () => {
  // Con useState - Afecta la UI
  const [visibleCount, setVisibleCount] = useState(0);

  // Con useRef - NO afecta la UI
  const hiddenCount = useRef(0);

  const incrementBoth = () => {
    // useState - Causa re-render
    setVisibleCount(prev => prev + 1);

    // useRef - NO causa re-render
    hiddenCount.current += 1;

    console.log('Hidden count:', hiddenCount.current);
  };

  return (
    <div>
      {/* Este valor se actualiza visualmente */}
      <p>Visible: {visibleCount}</p>

      {/* Este valor NUNCA cambia visualmente */}
      <p>Hidden: {hiddenCount.current}</p>

      <button onClick={incrementBoth}>Incrementar</button>
    </div>
  );
};
```

**Resultado:** Solo `visibleCount` se actualiza en pantalla, aunque ambos incrementan.

## Patrón avanzado: useRef con useEffect

```tsx
const SearchWithDebounce = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout
    timeoutRef.current = setTimeout(() => {
      console.log('Searching:', searchTerm);
      // Hacer búsqueda
    }, 500);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
```

## Reglas importantes

1. **No accedas a `.current` durante el render**
   ```tsx
   // ❌ MAL
   return <div>{myRef.current}</div>;

   // ✅ BIEN
   return <div>{myState}</div>;
   ```

2. **Modificar `.current` no causa re-render**
   ```tsx
   myRef.current = newValue; // Cambio silencioso
   ```

3. **Inicializa con el tipo correcto**
   ```tsx
   const ref = useRef<string | null>(null);
   ```

4. **Refs para DOM deben iniciar con `null`**
   ```tsx
   const divRef = useRef<HTMLDivElement>(null);
   ```

## Resumen

`useRef` es ideal para:
- 📦 **Cache de datos** (como en nuestro proyecto)
- 🎯 **Referencias DOM**
- ⏱️ **Timers e intervals**
- 🔢 **Contadores internos**
- 📝 **Valores previos**

**Regla de oro:** Si el dato afecta lo que el usuario ve, usa `useState`. Si es un dato auxiliar, usa `useRef`.

---

## Recursos

- [React Docs - useRef](https://react.dev/reference/react/useRef)
- Ejemplo en este proyecto: `src/gifs/hooks/useGifs.tsx` (línea 14)
