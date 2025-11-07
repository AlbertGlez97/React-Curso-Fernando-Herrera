# 07. act() - Envolviendo actualizaciones de estado

## ¿Qué es `act()`?

`act()` es una función de React Testing Library que **envuelve código que causa actualizaciones de estado** para simular cómo React maneja los cambios en una aplicación real.

---

## ¿Por qué existe?

En React, las actualizaciones de estado no ocurren inmediatamente. React agrupa (batches) múltiples actualizaciones para optimizar el rendimiento. `act()` asegura que:

1. ✅ Todas las actualizaciones de estado se procesen
2. ✅ Los efectos se ejecuten completamente
3. ✅ El DOM se actualice antes de hacer aserciones
4. ✅ No haya warnings de "act" en la consola

### El problema sin `act()`

```tsx
// ❌ Sin act() - puede causar warnings y tests inestables
test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  result.current.handleAdd(); // ⚠️ Warning: not wrapped in act()

  expect(result.current.counter).toBe(11);
});
```

### La solución con `act()`

```tsx
// ✅ Con act() - sincroniza correctamente las actualizaciones
test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.handleAdd();
  });

  expect(result.current.counter).toBe(11);
});
```

---

## ¿Cuándo usar `act()`?

### ✅ SÍ usar `act()` cuando:

```tsx
// 1. Llamas funciones que actualizan estado en hooks
act(() => {
  result.current.handleAdd();
});

// 2. Simulas eventos con fireEvent que cambian estado
act(() => {
  fireEvent.click(button);
});

// 3. Ejecutas callbacks que actualizan estado
act(() => {
  result.current.onSubmit(data);
});

// 4. Cambias valores de inputs
act(() => {
  fireEvent.change(input, { target: { value: "nuevo valor" } });
});
```

### ❌ NO usar `act()` cuando:

```tsx
// 1. Solo lees valores (no hay cambios de estado)
const value = result.current.counter; // ✅ Sin act()

// 2. Renderizas componentes (render ya usa act internamente)
render(<MyComponent />); // ✅ Sin act()

// 3. Usas userEvent (ya incluye act internamente)
await userEvent.click(button); // ✅ Sin act()

// 4. Usas queries para buscar elementos
const button = screen.getByRole("button"); // ✅ Sin act()

// 5. Montas hooks (renderHook ya usa act internamente)
const { result } = renderHook(() => useCounter()); // ✅ Sin act()
```

---

## Sintaxis de `act()`

### Sincrónico

```tsx
act(() => {
  // Código que actualiza estado
  result.current.handleAdd();
});
```

### Asincrónico

```tsx
await act(async () => {
  // Código asíncrono que actualiza estado
  await result.current.handleSearch("cats");
});
```

---

## Ejemplos prácticos

### Ejemplo 1: Testing de hooks

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  // Envolver la actualización de estado en act()
  act(() => {
    result.current.handleAdd();
  });

  expect(result.current.counter).toBe(11);
});
```

### Ejemplo 2: Múltiples actualizaciones

```tsx
test("should handle multiple updates", () => {
  const { result } = renderHook(() => useCounter());

  // Todas las actualizaciones en un solo act()
  act(() => {
    result.current.handleAdd();
    result.current.handleAdd();
    result.current.handleSubtract();
  });

  expect(result.current.counter).toBe(11);
});
```

### Ejemplo 3: Testing de componentes con fireEvent

```tsx
test("should update input value", () => {
  render(<SearchBar placeholder="Search" onQuery={mockFn} />);

  const input = screen.getByPlaceholderText("Search");

  // Envolver eventos que cambian estado
  act(() => {
    fireEvent.change(input, { target: { value: "cats" } });
  });

  expect(input).toHaveValue("cats");
});
```

### Ejemplo 4: Operaciones asíncronas

```tsx
test("should fetch data", async () => {
  const { result } = renderHook(() => useGifs());

  // act() con async/await
  await act(async () => {
    await result.current.handleSearch("cats");
  });

  expect(result.current.gifs).toHaveLength(10);
  expect(result.current.loading).toBe(false);
});
```

### Ejemplo 5: Testing de formularios

```tsx
test("should submit form", () => {
  const handleSubmit = vi.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  const emailInput = screen.getByLabelText("Email");
  const passwordInput = screen.getByLabelText("Password");
  const submitButton = screen.getByRole("button", { name: "Login" });

  // Múltiples cambios de estado en un solo act()
  act(() => {
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
  });

  expect(handleSubmit).toHaveBeenCalledWith({
    email: "user@example.com",
    password: "password123"
  });
});
```

---

## Comparación: Con/Sin `act()`

| Acción | ¿Necesita act()? | Razón |
|--------|------------------|-------|
| `result.current.counter` | ❌ No | Solo lectura |
| `result.current.handleAdd()` | ✅ Sí | Actualiza estado |
| `render(<Component />)` | ❌ No | Ya incluido en render |
| `fireEvent.click(button)` | ✅ Sí | Actualiza estado |
| `fireEvent.change(input)` | ✅ Sí | Actualiza estado |
| `await userEvent.click(button)` | ❌ No | Ya incluido en userEvent |
| `screen.getByRole("button")` | ❌ No | Solo query |
| `renderHook(() => useHook())` | ❌ No | Solo montaje inicial |

---

## Errores comunes

### ❌ Error: "not wrapped in act()"

```tsx
// ❌ MAL: Actualizar estado sin act()
test("should increment", () => {
  const { result } = renderHook(() => useCounter());
  result.current.handleAdd(); // ⚠️ Warning!
  expect(result.current.counter).toBe(11);
});

// ✅ BIEN: Envolver en act()
test("should increment", () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.handleAdd();
  });
  expect(result.current.counter).toBe(11);
});
```

### ❌ Error: Olvidar await con async act()

```tsx
// ❌ MAL: No usar await
test("should fetch data", async () => {
  const { result } = renderHook(() => useGifs());

  act(async () => {
    await result.current.handleSearch("cats");
  }); // ⚠️ Falta await!

  expect(result.current.gifs).toHaveLength(10);
});

// ✅ BIEN: await act(async)
test("should fetch data", async () => {
  const { result } = renderHook(() => useGifs());

  await act(async () => {
    await result.current.handleSearch("cats");
  });

  expect(result.current.gifs).toHaveLength(10);
});
```

### ❌ Error: Usar act() innecesariamente

```tsx
// ❌ MAL: act() innecesario para lectura
act(() => {
  const value = result.current.counter; // Solo lectura
});

// ✅ BIEN: Sin act() para lectura
const value = result.current.counter;
```

### ❌ Error: Usar act() con userEvent

```tsx
// ❌ REDUNDANTE: userEvent ya incluye act()
await act(async () => {
  await userEvent.click(button);
});

// ✅ BIEN: userEvent sin act() extra
await userEvent.click(button);
```

---

## `act()` con diferentes herramientas

### Con `renderHook()` (testing de hooks)

```tsx
test("should update hook state", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.handleAdd();
  });

  expect(result.current.counter).toBe(11);
});
```

> 💡 Para más detalles sobre testing de custom hooks, ver [nota 08-testing-custom-hooks.md](./08-testing-custom-hooks.md)

### Con `fireEvent` (eventos del DOM)

```tsx
test("should handle click", () => {
  render(<Button onClick={handleClick} />);

  act(() => {
    fireEvent.click(screen.getByRole("button"));
  });

  expect(handleClick).toHaveBeenCalled();
});
```

### Con `userEvent` (NO necesita act)

```tsx
test("should handle click", async () => {
  render(<Button onClick={handleClick} />);

  // userEvent ya incluye act() internamente
  await userEvent.click(screen.getByRole("button"));

  expect(handleClick).toHaveBeenCalled();
});
```

---

## ¿Por qué algunos métodos incluyen `act()` y otros no?

### ✅ Ya incluyen `act()` internamente:
- `render()` - Renderiza componentes
- `rerender()` - Re-renderiza componentes
- `userEvent.*` - Simula interacciones de usuario
- `waitFor()` - Espera por cambios

### ❌ NO incluyen `act()`:
- `fireEvent.*` - Eventos síncronos simples
- Llamadas directas a funciones del hook (`result.current.handleAdd()`)
- Cualquier código que modifique estado directamente

---

## Buenas prácticas

### 1. Agrupa múltiples actualizaciones en un solo `act()`

```tsx
// ✅ BIEN: Un solo act() para múltiples actualizaciones
act(() => {
  result.current.handleAdd();
  result.current.handleAdd();
  result.current.handleSubtract();
});

// ❌ INNECESARIO: Múltiples act() separados
act(() => result.current.handleAdd());
act(() => result.current.handleAdd());
act(() => result.current.handleSubtract());
```

### 2. Usa `await` con operaciones asíncronas

```tsx
// ✅ BIEN
await act(async () => {
  await result.current.fetchData();
});

// ❌ MAL: Sin await
act(async () => {
  await result.current.fetchData();
});
```

### 3. No uses `act()` para lectura

```tsx
// ✅ BIEN: Sin act() para lectura
const value = result.current.counter;
expect(value).toBe(10);

// ❌ INNECESARIO: act() para lectura
act(() => {
  const value = result.current.counter;
});
```

### 4. Prefiere `userEvent` sobre `fireEvent`

```tsx
// ✅ MEJOR: userEvent (no necesita act())
await userEvent.click(button);

// ✅ ACEPTABLE: fireEvent (necesita act())
act(() => {
  fireEvent.click(button);
});
```

---

## Resumen

### `act()` en 3 puntos

1. **¿Qué hace?** Envuelve actualizaciones de estado para simular el comportamiento de React
2. **¿Cuándo usarlo?** Cuando llamas funciones que modifican el estado
3. **¿Cuándo NO usarlo?** Para lectura, render, userEvent, o queries

### Regla simple

> **Si modificas estado directamente → usa `act()`**
> **Si solo lees o usas herramientas de alto nivel → NO uses `act()`**

### Ejemplo del proyecto

```tsx
// useCounter.test.ts
test("should increment and reset", () => {
  const { result } = renderHook(() => useCounter());

  // act() para modificar estado
  act(() => {
    result.current.handleAdd();
  });

  expect(result.current.counter).toBe(11); // Lectura sin act()

  // act() para resetear
  act(() => {
    result.current.handleReset();
  });

  expect(result.current.counter).toBe(10); // Lectura sin act()
});
```

---

## Ver también

- **[08. Testing de Custom Hooks](./08-testing-custom-hooks.md)** - Guía completa sobre `renderHook()` y testing de hooks
- **[02. Introducción a Vitest](./02-introduccion-vitest.md)** - API básica de testing
- **[05. Buenas Prácticas](./05-buenas-practicas.md)** - Patrones y convenciones

---

## Referencias

- [React Testing Library - act()](https://testing-library.com/docs/react-testing-library/api#act)
- [Kent C. Dodds - Fix the "not wrapped in act(...)" warning](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning)
- [React Docs - act() API](https://react.dev/reference/react/act)
