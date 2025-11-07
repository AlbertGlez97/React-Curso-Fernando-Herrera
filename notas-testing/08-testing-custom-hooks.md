# 08. Testing de Custom Hooks con renderHook()

## ¿Por qué necesitamos `renderHook()`?

Los **Custom Hooks son funciones de JavaScript que usan otros hooks de React**. No puedes llamarlos directamente en un test porque **los hooks solo funcionan dentro de componentes de React**.

### El problema

```tsx
// ❌ ESTO NO FUNCIONA
test("should increment counter", () => {
  const { counter, handleAdd } = useCounter(); // ⚠️ Error: Hooks solo funcionan en componentes
  handleAdd();
  expect(counter).toBe(11);
});
```

### La solución: `renderHook()`

`renderHook()` **monta el hook en un componente de prueba invisible** para que puedas probarlo de forma aislada.

```tsx
// ✅ ESTO FUNCIONA
test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.handleAdd();
  });

  expect(result.current.counter).toBe(11);
});
```

---

## Sintaxis de `renderHook()`

```tsx
const { result, rerender, unmount } = renderHook(
  (props) => useCustomHook(props),
  { initialProps: { /* props iniciales */ } }
);
```

### Parámetros

1. **Callback del hook**: Función que ejecuta tu custom hook
2. **Opciones** (opcional):
   - `initialProps`: Props iniciales para el hook
   - `wrapper`: Componente que envuelve el hook (ej: Provider)

### Valores de retorno

```tsx
{
  result: {
    current: any  // Valor actual retornado por el hook
  },
  rerender: (props) => void,  // Re-renderizar con nuevas props
  unmount: () => void          // Desmontar el hook (cleanup)
}
```

---

## Anatomía de un test de Custom Hook

### Estructura básica

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  test("should ...", () => {
    // 1. ARRANGE: Montar el hook
    const { result } = renderHook(() => useCounter());

    // 2. ACT: Ejecutar acciones que modifican estado
    act(() => {
      result.current.handleAdd();
    });

    // 3. ASSERT: Verificar resultados
    expect(result.current.counter).toBe(11);
  });
});
```

---

## Patrón AAA: Arrange-Act-Assert

### Ejemplo completo con useCounter

```tsx
describe("useCounter", () => {
  test("should initialize with default value", () => {
    // ARRANGE: Preparar el hook
    const { result } = renderHook(() => useCounter());

    // ASSERT: Verificar estado inicial (no hay ACT porque no hay cambios)
    expect(result.current.counter).toBe(10);
  });

  test("should initialize with custom value", () => {
    // ARRANGE: Preparar con valor inicial
    const { result } = renderHook(() => useCounter(20));

    // ASSERT
    expect(result.current.counter).toBe(20);
  });

  test("should increment counter", () => {
    // ARRANGE
    const { result } = renderHook(() => useCounter());

    // ACT: Ejecutar función que cambia estado
    act(() => {
      result.current.handleAdd();
    });

    // ASSERT
    expect(result.current.counter).toBe(11);
  });

  test("should handle multiple operations", () => {
    // ARRANGE
    const { result } = renderHook(() => useCounter());

    // ACT: Múltiples operaciones
    act(() => {
      result.current.handleAdd();
      result.current.handleAdd();
      result.current.handleSubtract();
    });

    // ASSERT
    expect(result.current.counter).toBe(11);
  });

  test("should reset to initial value", () => {
    // ARRANGE
    const { result } = renderHook(() => useCounter(15));

    // ACT: Modificar y resetear
    act(() => {
      result.current.handleAdd();
      result.current.handleAdd();
    });
    expect(result.current.counter).toBe(17);

    act(() => {
      result.current.handleReset();
    });

    // ASSERT: Debe volver al valor inicial (15)
    expect(result.current.counter).toBe(15);
  });
});
```

---

## Testing de hooks con props dinámicas: `rerender()`

Cuando tu hook acepta parámetros y quieres probar cómo reacciona a cambios:

```tsx
// Hook que acepta parámetros
const useCounter = (initialValue = 10) => {
  const [counter, setCounter] = useState(initialValue);
  // ...
  return { counter, handleAdd, handleSubtract };
};

// Test con rerender
test("should update when initial value changes", () => {
  // Montar con props iniciales
  const { result, rerender } = renderHook(
    ({ initial }) => useCounter(initial),
    { initialProps: { initial: 10 } }
  );

  expect(result.current.counter).toBe(10);

  // Re-renderizar con nuevas props
  rerender({ initial: 20 });

  expect(result.current.counter).toBe(20);
});
```

---

## Testing de hooks con efectos: `unmount()`

Para probar que los efectos se limpian correctamente (cleanup):

```tsx
// Hook con efecto y cleanup
const useInterval = (callback, delay) => {
  useEffect(() => {
    const id = setInterval(callback, delay);

    // Cleanup
    return () => clearInterval(id);
  }, [callback, delay]);
};

// Test del cleanup
test("should clear interval on unmount", () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => useInterval(callback, 1000));

  // Desmontar el hook
  unmount();

  // Verificar que se limpió el interval
  expect(clearInterval).toHaveBeenCalled();
});
```

---

## Testing de hooks asíncronos

### Hook con peticiones HTTP

```tsx
// useGifs.tsx
export const useGifs = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    const gifs = await getGifsByQuery(query);
    setGifs(gifs);
    setLoading(false);
  };

  return { gifs, loading, handleSearch };
};
```

### Test con operaciones asíncronas

```tsx
test("should fetch gifs", async () => {
  // ARRANGE
  const { result } = renderHook(() => useGifs());

  // Verificar estado inicial
  expect(result.current.gifs).toEqual([]);
  expect(result.current.loading).toBe(false);

  // ACT: Ejecutar búsqueda asíncrona
  await act(async () => {
    await result.current.handleSearch("cats");
  });

  // ASSERT: Verificar que se obtuvieron los GIFs
  expect(result.current.gifs).toHaveLength(10);
  expect(result.current.loading).toBe(false);
});
```

---

## Testing de hooks con Context: `wrapper`

Cuando tu hook usa un Context Provider:

```tsx
// Hook que usa context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Test con wrapper
test("should access auth context", () => {
  const wrapper = ({ children }) => (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.user).toBeDefined();
  expect(result.current.isAuthenticated).toBe(true);
});
```

---

## Patrones comunes en testing de Custom Hooks

### 1. Verificar estado inicial

```tsx
test("should have correct initial state", () => {
  const { result } = renderHook(() => useGifs());

  expect(result.current.gifs).toEqual([]);
  expect(result.current.previousTerms).toEqual([]);
});
```

### 2. Verificar funciones retornadas

```tsx
test("should return required functions", () => {
  const { result } = renderHook(() => useGifs());

  expect(typeof result.current.handleSearch).toBe("function");
  expect(typeof result.current.handleTermClicked).toBe("function");
});
```

### 3. Verificar cambios de estado

```tsx
test("should update state when function is called", () => {
  const { result } = renderHook(() => useCounter());

  const initialValue = result.current.counter;

  act(() => {
    result.current.handleAdd();
  });

  expect(result.current.counter).toBe(initialValue + 1);
});
```

### 4. Verificar efectos secundarios

```tsx
test("should call API when searching", async () => {
  const spy = vi.spyOn(giphyApi, "get");
  const { result } = renderHook(() => useGifs());

  await act(async () => {
    await result.current.handleSearch("dogs");
  });

  expect(spy).toHaveBeenCalledWith("/search", {
    params: { q: "dogs", limit: 10 }
  });
});
```

---

## Ejemplo real: Testing de `useGifs`

```tsx
import { renderHook, act } from "@testing-library/react";
import { useGifs } from "./useGifs";
import * as actions from "../actions/get-gifs-by-query.action";

// Mock de la acción
vi.mock("../actions/get-gifs-by-query.action");

describe("useGifs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should initialize with empty state", () => {
    const { result } = renderHook(() => useGifs());

    expect(result.current.gifs).toEqual([]);
    expect(result.current.previousTerms).toEqual([]);
  });

  test("should search and update gifs", async () => {
    // Mock de la respuesta
    const mockGifs = [
      { id: "1", title: "Cat 1", url: "url1", width: 100, height: 100 },
      { id: "2", title: "Cat 2", url: "url2", width: 100, height: 100 },
    ];

    vi.spyOn(actions, "getGifsByQuery").mockResolvedValue(mockGifs);

    const { result } = renderHook(() => useGifs());

    await act(async () => {
      await result.current.handleSearch("cats");
    });

    expect(result.current.gifs).toEqual(mockGifs);
    expect(result.current.previousTerms).toContain("cats");
  });

  test("should not add duplicate terms to history", async () => {
    const mockGifs = [];
    vi.spyOn(actions, "getGifsByQuery").mockResolvedValue(mockGifs);

    const { result } = renderHook(() => useGifs());

    await act(async () => {
      await result.current.handleSearch("cats");
    });

    await act(async () => {
      await result.current.handleSearch("cats"); // Duplicado
    });

    // Solo debe aparecer una vez
    expect(result.current.previousTerms).toEqual(["cats"]);
  });

  test("should limit history to 8 terms", async () => {
    const mockGifs = [];
    vi.spyOn(actions, "getGifsByQuery").mockResolvedValue(mockGifs);

    const { result } = renderHook(() => useGifs());

    // Buscar 10 términos diferentes
    await act(async () => {
      for (let i = 1; i <= 10; i++) {
        await result.current.handleSearch(`term${i}`);
      }
    });

    // Solo debe mantener los últimos 8
    expect(result.current.previousTerms).toHaveLength(8);
    expect(result.current.previousTerms[0]).toBe("term10");
    expect(result.current.previousTerms[7]).toBe("term3");
  });

  test("should use cache when clicking previous term", async () => {
    const mockGifs = [{ id: "1", title: "Cat", url: "url", width: 100, height: 100 }];
    const spy = vi.spyOn(actions, "getGifsByQuery").mockResolvedValue(mockGifs);

    const { result } = renderHook(() => useGifs());

    // Primera búsqueda (guarda en cache)
    await act(async () => {
      await result.current.handleSearch("cats");
    });

    expect(spy).toHaveBeenCalledTimes(1);

    // Click en término previo (usa cache)
    await act(async () => {
      await result.current.handleTermClicked("cats");
    });

    // No debe hacer otra petición
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.current.gifs).toEqual(mockGifs);
  });
});
```

---

## Checklist para testing de Custom Hooks

### Estado inicial
- [ ] Verificar valores iniciales de todos los estados
- [ ] Verificar que las funciones existen y son del tipo correcto

### Funcionalidad
- [ ] Probar cada función que retorna el hook
- [ ] Verificar que el estado se actualiza correctamente
- [ ] Probar edge cases (valores vacíos, null, undefined)

### Efectos y Async
- [ ] Probar efectos con `act()` para operaciones síncronas
- [ ] Probar efectos con `await act(async () => ...)` para operaciones asíncronas
- [ ] Verificar cleanup con `unmount()` si hay timers o subscripciones

### Props dinámicas
- [ ] Probar con diferentes valores iniciales
- [ ] Probar cambios de props con `rerender()`

### Integraciones
- [ ] Mockear dependencias externas (APIs, otros hooks)
- [ ] Verificar que se llaman las APIs/funciones correctas
- [ ] Verificar manejo de errores

---

## Errores comunes y soluciones

### ❌ Error: "Invalid hook call"

```tsx
// ❌ MAL: Llamar el hook directamente
const result = useCounter();

// ✅ BIEN: Usar renderHook
const { result } = renderHook(() => useCounter());
```

### ❌ Error: "Updates not wrapped in act()"

```tsx
// ❌ MAL: No envolver cambios de estado
const { result } = renderHook(() => useCounter());
result.current.handleAdd();

// ✅ BIEN: Envolver en act()
const { result } = renderHook(() => useCounter());
act(() => {
  result.current.handleAdd();
});
```

### ❌ Error: "Cannot read property of undefined"

```tsx
// ❌ MAL: Olvidar .current
expect(result.counter).toBe(10);

// ✅ BIEN: Usar result.current
expect(result.current.counter).toBe(10);
```

### ❌ Error: Test de async sin await

```tsx
// ❌ MAL: No usar await
act(async () => {
  await result.current.handleSearch("cats");
});

// ✅ BIEN: await en act
await act(async () => {
  await result.current.handleSearch("cats");
});
```

---

## Resumen

### `renderHook()` en 3 pasos

1. **Montar el hook**
   ```tsx
   const { result } = renderHook(() => useCustomHook());
   ```

2. **Ejecutar acciones** (con act si modifica estado)
   ```tsx
   act(() => {
     result.current.someFunction();
   });
   ```

3. **Verificar resultados**
   ```tsx
   expect(result.current.someValue).toBe(expected);
   ```

### Cuándo usar cada utilidad

| Utilidad | Cuándo usar |
|----------|-------------|
| `renderHook()` | Siempre que testees un custom hook |
| `result.current` | Para acceder a los valores retornados por el hook |
| `act()` | Cuando llamas funciones que actualizan estado |
| `await act(async)` | Para operaciones asíncronas (fetch, timers) |
| `rerender()` | Para probar cambios en las props del hook |
| `unmount()` | Para verificar cleanup de efectos |

---

## Referencias

- [React Testing Library - renderHook](https://testing-library.com/docs/react-testing-library/api#renderhook)
- [Testing Custom Hooks - Kent C. Dodds](https://kentcdodds.com/blog/how-to-test-custom-react-hooks)
- [React Docs - Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
