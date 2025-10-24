# Custom Hooks

Los **Custom Hooks** son funciones personalizadas que nos permiten **extraer y reutilizar lógica de componentes**. Son una de las características más poderosas de React para mantener nuestro código organizado, reutilizable y fácil de mantener.

## ¿Qué es un Custom Hook?

Un Custom Hook es una función de JavaScript cuyo nombre **comienza con "use"** y que puede llamar a otros Hooks de React (useState, useEffect, etc.).

```typescript
// ✅ Custom Hook - Nombre comienza con "use"
export const useGifs = () => {
  // Puede usar otros hooks
  const [gifs, setGifs] = useState<Gif[]>([]);
  // ... más lógica
  return { gifs };
}
```

## ¿Por qué usar Custom Hooks?

### Problema: Componentes Sobrecargados

Imagina nuestro `GifsApp.tsx` **SIN** custom hooks:

```typescript
export const GifsApp = () => {
  // ❌ TODO este código de lógica de negocio está en el componente
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);
  const [gifs, setGifs] = useState<Gif[]>([]);
  const gifsCache = useRef<Record<string, Gif[]>>({});

  const handleTermClicked = async (term: string) => {
    if (gifsCache.current[term]) {
      setGifs(gifsCache.current[term]);
      return;
    }
    const gifs = await getGifsByQuery(term);
    setGifs(gifs);
  };

  const handleSearch = async (query: string) => {
    const querySearch = query.trim().toLocaleLowerCase();
    if (querySearch.length === 0) return;
    if (previousTerms.includes(querySearch)) return;
    setPreviousTerms([querySearch, ...previousTerms].splice(0, 8));
    const gifs = await getGifsByQuery(querySearch);
    setGifs(gifs);
    gifsCache.current[query] = gifs;
  };

  return (
    <>
      <CustomHeader title="..." description="..." />
      <SearchBar onQuery={handleSearch} />
      <PreviousSearches searches={previousTerms} onlabelClicked={handleTermClicked} />
      <GifList gifs={gifs} />
    </>
  );
};
```

**Problemas:**
- 😟 Componente muy largo y difícil de leer
- 😟 Mezcla lógica de negocio con presentación (JSX)
- 😟 Difícil de testear la lógica por separado
- 😟 No se puede reutilizar en otros componentes

### Solución: Extraer la lógica a un Custom Hook

Con `useGifs`:

```typescript
// ✅ Componente limpio y enfocado solo en presentación
export const GifsApp = () => {
  const {
    // Propiedades
    previousTerms,
    gifs,
    // Métodos / Acciones
    handleTermClicked,
    handleSearch,
  } = useGifs();

  return (
    <>
      <CustomHeader title="..." description="..." />
      <SearchBar onQuery={handleSearch} />
      <PreviousSearches searches={previousTerms} onlabelClicked={handleTermClicked} />
      <GifList gifs={gifs} />
    </>
  );
};
```

**Ventajas:**
- ✅ Componente mucho más legible
- ✅ Separación clara entre lógica y presentación
- ✅ Lógica reutilizable en otros componentes
- ✅ Más fácil de testear

## Anatomía de un Custom Hook: `useGifs`

Analicemos nuestro custom hook paso a paso:

### 1. Estado (State)

```typescript
export const useGifs = () => {
  // 📦 Estado para el historial de búsquedas
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

  // 📦 Estado para los GIFs obtenidos
  const [gifs, setGifs] = useState<Gif[]>([]);

  // 📦 Cache usando useRef (no causa re-renders)
  const gifsCache = useRef<Record<string, Gif[]>>({});
```

**Explicación:**
- `previousTerms`: Array con las últimas 8 búsquedas
- `gifs`: Array con los GIFs actuales a mostrar
- `gifsCache`: Cache de resultados para evitar llamadas duplicadas a la API

**¿Por qué useRef para el cache?**
- `useRef` persiste el valor entre renders (como useState)
- Pero NO causa re-renders cuando cambia (a diferencia de useState)
- Perfecto para guardar datos auxiliares que no afectan la UI

### 2. Funciones/Métodos

#### handleTermClicked - Reutilizar búsquedas previas

```typescript
  const handleTermClicked = async (term: string) => {
    // 🚀 Optimización: Primero revisa el cache
    if (gifsCache.current[term]) {
      setGifs(gifsCache.current[term]);
      return;
    }

    // Si no está en cache, hace la petición
    const gifs = await getGifsByQuery(term);
    setGifs(gifs);
  };
```

**Flujo:**
1. Usuario hace clic en una búsqueda previa
2. Revisar si ya tenemos esos GIFs en cache
3. Si están en cache → usar los datos guardados (instantáneo)
4. Si NO están → hacer petición a la API

**Ventaja:** Evita peticiones HTTP innecesarias

#### handleSearch - Nueva búsqueda

```typescript
  const handleSearch = async (query: string) => {
    // 🧹 Sanitización: normalizar el término de búsqueda
    const querySearch = query.trim().toLocaleLowerCase();

    // ✅ Validación 1: No buscar vacíos
    if (querySearch.length === 0) return;

    // ✅ Validación 2: Evitar búsquedas duplicadas
    if (previousTerms.includes(querySearch)) return;

    // 📝 Agregar al historial (máximo 8 términos)
    setPreviousTerms([querySearch, ...previousTerms].splice(0, 8));

    // 🌐 Obtener GIFs de la API
    const gifs = await getGifsByQuery(querySearch);
    setGifs(gifs);

    // 💾 Guardar en cache para uso futuro
    gifsCache.current[query] = gifs;
  };
```

**Responsabilidades:**
1. **Sanitización**: `trim()` + `toLowerCase()`
2. **Validaciones**: vacío + duplicados
3. **Historial**: mantener solo 8 términos
4. **Fetch**: obtener datos de la API
5. **Cache**: guardar para futuras búsquedas

### 3. Return - API Pública del Hook

```typescript
  return {
    // Propiedades (datos)
    previousTerms,
    gifs,

    // Métodos / Acciones (funciones)
    handleTermClicked,
    handleSearch,
  };
};
```

**Patrón de organización:**
- Separar claramente **datos** de **acciones**
- Los componentes solo usan lo que necesitan

## Reglas de los Hooks (IMPORTANTE)

Los Custom Hooks deben seguir las mismas reglas que todos los hooks:

### ✅ Regla 1: Solo llamar Hooks en el nivel superior

```typescript
// ❌ MAL - No dentro de condicionales
if (condition) {
  const [state, setState] = useState(0);
}

// ✅ BIEN - Nivel superior
const [state, setState] = useState(0);
if (condition) {
  setState(10);
}
```

### ✅ Regla 2: Solo llamar Hooks desde funciones React

```typescript
// ❌ MAL - Función normal
function normalFunction() {
  const [state, setState] = useState(0);
}

// ✅ BIEN - Custom Hook (nombre comienza con "use")
function useCustomHook() {
  const [state, setState] = useState(0);
}

// ✅ BIEN - Componente
function Component() {
  const [state, setState] = useState(0);
}
```

## Ventajas de los Custom Hooks

### 1. Reutilización de Lógica

Puedes usar `useGifs` en múltiples componentes:

```typescript
// Página principal
export const GifsApp = () => {
  const { gifs, handleSearch } = useGifs();
  // ...
};

// Modal de búsqueda
export const SearchModal = () => {
  const { gifs, handleSearch } = useGifs();
  // ... mismo hook, diferente instancia
};
```

Cada componente tiene su **propia instancia** del hook (estados independientes).

### 2. Separación de Responsabilidades

```
📁 Componentes (GifsApp.tsx)
   └─ Se encargan de: Renderizar UI, estructura, estilos

📁 Custom Hooks (useGifs.tsx)
   └─ Se encargan de: Lógica de negocio, estado, side effects

📁 Actions (get-gifs-by-query.action.ts)
   └─ Se encargan de: Peticiones HTTP, transformación de datos
```

### 3. Testing más fácil

```typescript
// Puedes testear el hook de forma aislada
import { renderHook, act } from '@testing-library/react';
import { useGifs } from './useGifs';

test('should add search to history', async () => {
  const { result } = renderHook(() => useGifs());

  await act(async () => {
    await result.current.handleSearch('cats');
  });

  expect(result.current.previousTerms).toContain('cats');
});
```

### 4. Código más legible

Compara la complejidad:

```typescript
// ❌ Sin custom hook - 50+ líneas de lógica en el componente
export const GifsApp = () => {
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);
  const [gifs, setGifs] = useState<Gif[]>([]);
  const gifsCache = useRef<Record<string, Gif[]>>({});
  // ... 40+ líneas más de lógica
  return <div>...</div>
};

// ✅ Con custom hook - Solo 10 líneas
export const GifsApp = () => {
  const { previousTerms, gifs, handleTermClicked, handleSearch } = useGifs();
  return <div>...</div>
};
```

## Patrones Comunes en Custom Hooks

### Patrón 1: Hook que maneja estado + acciones

```typescript
// useGifs sigue este patrón
const useGifs = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    // ... fetch logic
    setLoading(false);
  };

  return { data, loading, fetchData };
};
```

### Patrón 2: Hook con side effects (useEffect)

```typescript
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### Patrón 3: Hook con useRef para valores persistentes

```typescript
// Como en useGifs con gifsCache
const useCache = () => {
  const cache = useRef({});

  const getCachedValue = (key) => cache.current[key];
  const setCachedValue = (key, value) => {
    cache.current[key] = value;
  };

  return { getCachedValue, setCachedValue };
};
```

## ¿Cuándo crear un Custom Hook?

### ✅ Crea un Custom Hook cuando:

1. **Lógica repetida** en múltiples componentes
2. **Componente muy largo** con mucha lógica (>100 líneas)
3. **Lógica compleja** que merece su propio módulo
4. **Múltiples useState/useEffect** relacionados entre sí
5. **Testing independiente** de lógica de negocio

### ❌ NO necesitas Custom Hook cuando:

1. Lógica simple usada en un solo componente
2. Solo necesitas useState sin lógica adicional
3. El componente ya es simple y legible

## Comparación Final: Antes vs Después

### Sin Custom Hook ❌

```typescript
// GifsApp.tsx - 60+ líneas
export const GifsApp = () => {
  // 30 líneas de estados y lógica
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);
  const [gifs, setGifs] = useState<Gif[]>([]);
  const gifsCache = useRef<Record<string, Gif[]>>({});

  const handleSearch = async (query: string) => {
    // ... 15 líneas
  };

  const handleTermClicked = async (term: string) => {
    // ... 8 líneas
  };

  // 10 líneas de JSX
  return <div>...</div>;
};
```

**Problemas:**
- Difícil de leer
- No reutilizable
- Hard to test

### Con Custom Hook ✅

```typescript
// useGifs.tsx - Hook reutilizable
export const useGifs = () => {
  // Toda la lógica encapsulada aquí
  // ...
  return { gifs, previousTerms, handleSearch, handleTermClicked };
};

// GifsApp.tsx - 15 líneas limpias
export const GifsApp = () => {
  const { gifs, previousTerms, handleSearch, handleTermClicked } = useGifs();

  return (
    <>
      <CustomHeader title="..." description="..." />
      <SearchBar onQuery={handleSearch} />
      <PreviousSearches searches={previousTerms} onlabelClicked={handleTermClicked} />
      <GifList gifs={gifs} />
    </>
  );
};
```

**Ventajas:**
- Componente enfocado en UI
- Hook reutilizable en otros componentes
- Fácil de testear por separado
- Código organizado y mantenible

## Resumen

Los Custom Hooks son una herramienta fundamental en React que te permite:

1. **Extraer lógica** de componentes
2. **Reutilizar código** entre componentes
3. **Organizar mejor** tu aplicación
4. **Testear más fácilmente** tu lógica de negocio
5. **Mantener componentes simples** enfocados en UI

**Regla de oro:** Si tu componente tiene más de 50 líneas de lógica, probablemente necesitas un Custom Hook.

---

## Recursos

- [React Docs - Building Your Own Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- Ejemplo en este proyecto: `src/gifs/hooks/useGifs.tsx`
