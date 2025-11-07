# Spies y Mocks en Vitest

En testing, necesitamos controlar y observar el comportamiento de funciones. **Spies** y **Mocks** son herramientas fundamentales para esto. Esta nota explica `vi.fn()`, `vi.spyOn()`, y cuándo usar cada uno.

## ¿Qué son los Spies y Mocks?

### Spy (Espía)
Un **spy** es una función que "observa" llamadas a otra función sin modificar su comportamiento original.

**Uso:** Verificar que una función fue llamada, cuántas veces, y con qué argumentos.

### Mock
Un **mock** es una función falsa que reemplaza completamente el comportamiento original.

**Uso:** Simular funciones complejas o costosas (APIs, bases de datos, etc.).

## vi.fn() - Crear Mock desde Cero

`vi.fn()` crea una función mock completamente nueva.

### Sintaxis Básica

```tsx
import { vi, test, expect } from 'vitest';

test('should track function calls', () => {
  // Crear mock
  const mockFn = vi.fn();

  // Usar mock
  mockFn('hello');
  mockFn('world');

  // Verificar llamadas
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith('hello');
  expect(mockFn).toHaveBeenCalledWith('world');
});
```

### Con Implementación Personalizada

```tsx
test('should use custom implementation', () => {
  // Mock con implementación
  const sum = vi.fn((a, b) => a + b);

  const result = sum(2, 3);

  expect(result).toBe(5);
  expect(sum).toHaveBeenCalledWith(2, 3);
});
```

### Cuándo usar vi.fn()

✅ **Usar cuando:**
- Necesitas crear una función callback falsa
- Pasas funciones como props a componentes
- Quieres verificar que un callback fue llamado

**Ejemplo:**
```tsx
test('should call onClick handler', () => {
  const handleClick = vi.fn();

  render(<Button onClick={handleClick} />);

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## vi.spyOn() - Espiar Funciones Existentes

`vi.spyOn()` observa una función existente de un objeto. Por defecto, mantiene el comportamiento original pero permite verificar llamadas y opcionalmente cambiar la implementación.

### Sintaxis Básica

```tsx
import { vi, test, expect } from 'vitest';

test('should spy on console.log', () => {
  // Crear spy
  const logSpy = vi.spyOn(console, 'log');

  // Usar función original
  console.log('Hello World');

  // Verificar que fue llamada
  expect(logSpy).toHaveBeenCalledWith('Hello World');
  expect(logSpy).toHaveBeenCalledTimes(1);
});
```

### Spy con Mock de Implementación

```tsx
test('should mock console.error without logging', () => {
  // Spy que reemplaza la implementación
  const errorSpy = vi.spyOn(console, 'error')
    .mockImplementation(() => {}); // No imprime nada

  console.error('This will not appear in console');

  expect(errorSpy).toHaveBeenCalled();
  // La consola NO muestra el error durante el test
});
```

### Spy de Métodos de Objetos

```tsx
import { giphyApi } from '../api/giphy.api';

test('should spy on API get method', () => {
  // Spy en método de instancia de Axios
  const getSpy = vi.spyOn(giphyApi, 'get')
    .mockResolvedValue({
      data: { data: [] }
    });

  await getGifsByQuery('goku');

  expect(getSpy).toHaveBeenCalledWith('/search', {
    params: { q: 'goku', limit: 10 }
  });
});
```

### Cuándo usar vi.spyOn()

✅ **Usar cuando:**
- Necesitas verificar que se llamó una función existente
- Quieres evitar efectos secundarios (console.error, fetch, etc.)
- Necesitas mockear métodos de bibliotecas o APIs
- Quieres preservar el comportamiento original en algunos tests

**Ejemplo real del proyecto:**
```tsx
test('should handle error when the API returns an error', async () => {
  // Spy para evitar logs de error en la consola durante tests
  const consoleErrorSpy = vi.spyOn(console, 'error')
    .mockImplementation(() => {});

  // Código que produce error...

  // Verificar que se manejó el error
  expect(consoleErrorSpy).toHaveBeenCalled();
});
```

## vi.mock() - Mockear Módulos Completos

`vi.mock()` reemplaza un módulo entero con versiones mock de sus exportaciones.

### Sintaxis

```tsx
// Mockear módulo completo
vi.mock('../api/giphy.api', () => ({
  giphyApi: {
    get: vi.fn(() => Promise.resolve({ data: { data: [] } }))
  }
}));
```

### Cuándo usar vi.mock()

✅ **Usar cuando:**
- Necesitas mockear módulos completos (APIs, bibliotecas)
- Quieres que el mock aplique a todos los tests del archivo
- El módulo tiene muchas funciones que necesitas mockear

## Comparación: vi.fn() vs vi.spyOn() vs vi.mock()

| Característica | vi.fn() | vi.spyOn() | vi.mock() |
|---------------|---------|------------|-----------|
| **Crea nueva función** | ✅ Sí | ❌ No | ✅ Sí |
| **Espía función existente** | ❌ No | ✅ Sí | ❌ No |
| **Preserva comportamiento original** | ❌ No | ✅ Por defecto | ❌ No |
| **Alcance** | Local | Local | Todo el módulo |
| **Restaurable** | N/A | ✅ Sí | ✅ Sí |

### Guía Rápida de Decisión

```
¿Necesitas crear callback/prop?
  → vi.fn()

¿Necesitas observar función existente?
  → vi.spyOn()

¿Necesitas mockear módulo completo?
  → vi.mock()
```

## Métodos de Configuración

### mockImplementation()

Cambia la implementación de la función mock.

```tsx
const mockFn = vi.fn().mockImplementation((x) => x * 2);

expect(mockFn(5)).toBe(10);
```

### mockReturnValue()

Define valor de retorno para llamadas síncronas.

```tsx
const mockFn = vi.fn().mockReturnValue(42);

expect(mockFn()).toBe(42);
expect(mockFn('any', 'args')).toBe(42); // Siempre retorna 42
```

### mockReturnValueOnce()

Define valor de retorno solo para la próxima llamada.

```tsx
const mockFn = vi.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

expect(mockFn()).toBe('first');
expect(mockFn()).toBe('second');
expect(mockFn()).toBe('default');
expect(mockFn()).toBe('default'); // Todas las siguientes
```

### mockResolvedValue()

Define valor de retorno para Promesas (async).

```tsx
const mockFn = vi.fn().mockResolvedValue({ data: 'mocked' });

const result = await mockFn();
expect(result).toEqual({ data: 'mocked' });
```

### mockRejectedValue()

Define error para Promesas rechazadas.

```tsx
const mockFn = vi.fn().mockRejectedValue(new Error('Failed'));

await expect(mockFn()).rejects.toThrow('Failed');
```

## Métodos de Verificación

### toHaveBeenCalled()

Verifica que la función fue llamada al menos una vez.

```tsx
const mockFn = vi.fn();
mockFn();

expect(mockFn).toHaveBeenCalled(); // ✅
```

### toHaveBeenCalledTimes(n)

Verifica número exacto de llamadas.

```tsx
const mockFn = vi.fn();
mockFn();
mockFn();

expect(mockFn).toHaveBeenCalledTimes(2); // ✅
```

### toHaveBeenCalledWith(...args)

Verifica que fue llamada con argumentos específicos.

```tsx
const mockFn = vi.fn();
mockFn('hello', 'world');

expect(mockFn).toHaveBeenCalledWith('hello', 'world'); // ✅
```

### toHaveBeenLastCalledWith(...args)

Verifica argumentos de la última llamada.

```tsx
const mockFn = vi.fn();
mockFn('first');
mockFn('last');

expect(mockFn).toHaveBeenLastCalledWith('last'); // ✅
```

### toHaveBeenNthCalledWith(n, ...args)

Verifica argumentos de la llamada número n.

```tsx
const mockFn = vi.fn();
mockFn('first');
mockFn('second');
mockFn('third');

expect(mockFn).toHaveBeenNthCalledWith(2, 'second'); // ✅
```

## Acceder a Información del Mock

### mock.calls

Array de todos los argumentos de cada llamada.

```tsx
const mockFn = vi.fn();
mockFn('a', 'b');
mockFn('c', 'd');

console.log(mockFn.mock.calls);
// [['a', 'b'], ['c', 'd']]

expect(mockFn.mock.calls[0][0]).toBe('a');
```

### mock.results

Resultados de cada llamada.

```tsx
const mockFn = vi.fn((x) => x * 2);
mockFn(5);
mockFn(10);

console.log(mockFn.mock.results);
// [
//   { type: 'return', value: 10 },
//   { type: 'return', value: 20 }
// ]
```

### mock.lastCall

Argumentos de la última llamada.

```tsx
const mockFn = vi.fn();
mockFn('a', 'b');
mockFn('c', 'd');

console.log(mockFn.mock.lastCall); // ['c', 'd']
```

## Limpiar y Restaurar Mocks

### mockClear()

Limpia información de llamadas pero mantiene la implementación.

```tsx
const mockFn = vi.fn().mockReturnValue(42);

mockFn();
mockFn();
expect(mockFn).toHaveBeenCalledTimes(2);

mockFn.mockClear();

expect(mockFn).toHaveBeenCalledTimes(0); // Resetea contador
expect(mockFn()).toBe(42); // Mantiene implementación
```

### mockReset()

Limpia llamadas Y remueve la implementación.

```tsx
const mockFn = vi.fn().mockReturnValue(42);

mockFn.mockReset();

expect(mockFn()).toBeUndefined(); // Implementación removida
```

### mockRestore()

Restaura implementación original (solo para spies).

```tsx
const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

console.log('Not printed'); // No se imprime

logSpy.mockRestore();

console.log('Printed!'); // Se imprime normalmente
```

### Hooks para Limpiar

```tsx
describe('Tests with mocks', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Restaurar todos los mocks después de todos los tests
    vi.restoreAllMocks();
  });
});
```

## Ejemplo Completo: Testing con Spies

Archivo real del proyecto: `get-gifs-by-query.action.test.ts`

```tsx
import { vi, test, expect } from 'vitest';
import { getGifsByQuery } from './get-gifs-by-query.action';

test('should handle error and log to console', async () => {
  // 1. Crear spy de console.error
  const consoleErrorSpy = vi.spyOn(console, 'error')
    .mockImplementation(() => {}); // Evita logs durante tests

  // 2. Simular error en API
  mock.onGet('/search').reply(400, {
    message: 'Bad Request'
  });

  // 3. Ejecutar función que debería loggear error
  const gifs = await getGifsByQuery('goku');

  // 4. Verificar comportamiento
  expect(gifs).toEqual([]); // Retorna array vacío
  expect(consoleErrorSpy).toHaveBeenCalled(); // Se llamó console.error
  expect(consoleErrorSpy).toHaveBeenCalledWith(expect.anything()); // Con algún error

  // 5. Restaurar (opcional, beforeEach lo hace automáticamente)
  consoleErrorSpy.mockRestore();
});
```

## Casos de Uso Comunes

### 1. Evitar Logs en Tests

```tsx
const consoleLogSpy = vi.spyOn(console, 'log')
  .mockImplementation(() => {});

// Tests sin ruido en consola
```

### 2. Verificar Llamadas a APIs

```tsx
const apiSpy = vi.spyOn(api, 'get');

await fetchData();

expect(apiSpy).toHaveBeenCalledWith('/endpoint', { params: { id: 1 } });
```

### 3. Simular Respuestas de API

```tsx
vi.spyOn(api, 'get').mockResolvedValue({
  data: { items: [] }
});
```

### 4. Testear Callbacks en Props

```tsx
const handleClick = vi.fn();

render(<Button onClick={handleClick} />);
fireEvent.click(screen.getByRole('button'));

expect(handleClick).toHaveBeenCalledTimes(1);
```

## Errores Comunes

### ❌ Error: No restaurar spies

```tsx
// MAL - El spy persiste entre tests
test('test 1', () => {
  vi.spyOn(console, 'log');
});

test('test 2', () => {
  // console.log aún está espiado!
});
```

**Solución:**
```tsx
beforeEach(() => {
  vi.restoreAllMocks();
});
```

### ❌ Error: Usar vi.fn() para funciones existentes

```tsx
// MAL - No puedes espiar algo que no existe en un objeto
const logSpy = vi.fn(); // No está conectado a console.log
console.log('test');
expect(logSpy).toHaveBeenCalled(); // ❌ Falla
```

**Solución:**
```tsx
// BIEN - Usar vi.spyOn() para funciones existentes
const logSpy = vi.spyOn(console, 'log');
console.log('test');
expect(logSpy).toHaveBeenCalled(); // ✅ Pasa
```

### ❌ Error: Olvidar mockImplementation con console

```tsx
// MAL - La consola se llena de logs durante tests
const spy = vi.spyOn(console, 'error');
```

**Solución:**
```tsx
// BIEN - Silenciar salida
const spy = vi.spyOn(console, 'error')
  .mockImplementation(() => {});
```

## Resumen

| Herramienta | Cuándo Usar | Ejemplo |
|------------|------------|---------|
| **vi.fn()** | Crear mocks nuevos | Callbacks, props |
| **vi.spyOn()** | Espiar funciones existentes | console.log, API methods |
| **vi.mock()** | Mockear módulos completos | Librerías, APIs |

**Puntos clave:**
- `vi.fn()` crea funciones mock desde cero
- `vi.spyOn()` observa y opcionalmente modifica funciones existentes
- Usa `.mockImplementation()` para cambiar comportamiento
- Usa `.mockResolvedValue()` para promesas
- Siempre limpia mocks con `beforeEach()` o `afterEach()`
- Usa matchers `toHaveBeenCalled*()` para verificar llamadas

**Archivo relacionado:** `src/gifs/actions/get-gifs-by-query.action.test.ts` tiene ejemplos prácticos de `vi.spyOn()` con `console.error`.
