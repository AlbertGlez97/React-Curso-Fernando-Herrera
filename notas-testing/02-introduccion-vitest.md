# Introducción a Vitest

Vitest es un framework de testing moderno y rápido diseñado para proyectos con Vite. Es la alternativa moderna a Jest con mejor performance y experiencia de desarrollo.

## ¿Qué es Vitest?

**Vitest** es un framework de testing unitario que:
- Usa Vite como motor de ejecución
- Es compatible con la API de Jest
- Tiene soporte nativo para TypeScript, JSX, y ESM
- Incluye watch mode inteligente
- Ofrece una interfaz UI moderna

## API Básica

### Estructura de un Test

```tsx
import { describe, test, expect } from "vitest";

describe("Nombre del grupo de tests", () => {
  test("descripción de lo que debe hacer", () => {
    // Arrange (preparar)
    const value = 1 + 1;

    // Act (actuar)
    const result = value;

    // Assert (afirmar)
    expect(result).toBe(2);
  });
});
```

### Funciones Principales

#### describe()
Agrupa tests relacionados en un bloque.

```tsx
describe("Calculator", () => {
  test("suma correctamente", () => { ... });
  test("resta correctamente", () => { ... });
});
```

**Ventaja:** Organiza tests y permite ver resultados agrupados.

#### test() o it()
Define un test individual. `test()` e `it()` son alias (hacen lo mismo).

```tsx
test("debe sumar dos números", () => {
  expect(1 + 1).toBe(2);
});

// Es lo mismo que:
it("debe sumar dos números", () => {
  expect(1 + 1).toBe(2);
});
```

**Convención:** Usa `test()` (más descriptivo).

#### expect()
Crea una "expectativa" sobre un valor.

```tsx
expect(value).toBe(expected);      // Igualdad estricta
expect(value).toEqual(expected);   // Igualdad profunda (objetos/arrays)
expect(value).toBeTruthy();        // Valor truthy
expect(value).toBeNull();          // Valor null
expect(value).toContain(item);     // Array/string contiene item
```

## Matchers (Comparadores)

### Matchers de Igualdad

```tsx
// Igualdad estricta (===)
expect(2 + 2).toBe(4);

// Igualdad de valores (objetos/arrays)
expect({ name: 'John' }).toEqual({ name: 'John' });
```

**Diferencia:**
- `toBe()` compara referencias (===)
- `toEqual()` compara valores profundamente

```tsx
const obj1 = { name: 'John' };
const obj2 = { name: 'John' };

expect(obj1).toBe(obj2);     // ❌ Falla (diferentes referencias)
expect(obj1).toEqual(obj2);  // ✅ Pasa (mismo contenido)
```

### Matchers de Truthiness

```tsx
expect(value).toBeTruthy();  // value es truthy (true, 1, "hello", etc.)
expect(value).toBeFalsy();   // value es falsy (false, 0, "", null, undefined)
expect(value).toBeNull();    // value es null
expect(value).toBeUndefined(); // value es undefined
expect(value).toBeDefined(); // value NO es undefined
```

### Matchers Numéricos

```tsx
expect(value).toBeGreaterThan(5);     // > 5
expect(value).toBeGreaterThanOrEqual(5); // >= 5
expect(value).toBeLessThan(10);       // < 10
expect(value).toBeLessThanOrEqual(10);  // <= 10
expect(value).toBeCloseTo(0.3);       // ~0.3 (decimales)
```

### Matchers de Strings

```tsx
expect(str).toContain("world");      // Contiene substring
expect(str).toMatch(/hello/);        // Coincide con regex
expect(str).toHaveLength(5);         // Longitud específica
```

### Matchers de Arrays

```tsx
expect(array).toContain(item);       // Contiene elemento
expect(array).toHaveLength(3);       // Longitud específica
expect(array).toEqual([1, 2, 3]);    // Mismo contenido
```

### Matchers de Objetos

```tsx
expect(obj).toHaveProperty('name');         // Tiene propiedad
expect(obj).toHaveProperty('name', 'John'); // Propiedad con valor
expect(obj).toMatchObject({ name: 'John' }); // Contiene propiedades
```

## Lifecycle Hooks

Los hooks permiten ejecutar código antes/después de los tests.

### beforeEach() - Antes de cada test

```tsx
describe("Counter", () => {
  let counter;

  beforeEach(() => {
    counter = 0; // Reset antes de cada test
  });

  test("incrementa el contador", () => {
    counter++;
    expect(counter).toBe(1);
  });

  test("decrementa el contador", () => {
    counter--;
    expect(counter).toBe(-1);
  });
});
```

### afterEach() - Después de cada test

```tsx
afterEach(() => {
  // Limpiar después de cada test
  cleanup();
});
```

### beforeAll() - Una vez antes de todos los tests

```tsx
beforeAll(() => {
  // Setup costoso que solo necesitas una vez
  database.connect();
});
```

### afterAll() - Una vez después de todos los tests

```tsx
afterAll(() => {
  // Limpieza final
  database.disconnect();
});
```

## Ejecutar Tests Selectivamente

### .only() - Solo este test

```tsx
test.only("solo ejecuta este test", () => {
  expect(true).toBe(true);
});

test("este NO se ejecuta", () => {
  expect(true).toBe(true);
});
```

**Uso:** Debugging de un test específico.

### .skip() - Saltar test

```tsx
test.skip("este test se salta", () => {
  expect(true).toBe(true);
});

test("este sí se ejecuta", () => {
  expect(true).toBe(true);
});
```

**Uso:** Tests temporalmente rotos o incompletos.

### .todo() - Test pendiente

```tsx
test.todo("implementar este test después");
```

**Uso:** Recordatorio de tests por hacer.

## Tests Asíncronos

### Async/Await

```tsx
test("debe obtener datos", async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Promesas

```tsx
test("debe resolver promesa", () => {
  return fetchData().then(data => {
    expect(data).toBeDefined();
  });
});
```

## Mocks

### Mock de funciones

```tsx
import { vi } from "vitest";

test("debe llamar la función", () => {
  const mockFn = vi.fn();

  mockFn("hello");
  mockFn("world");

  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith("hello");
});
```

### Mock de módulos

```tsx
import { vi } from "vitest";

vi.mock("./api", () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: "mocked" }))
}));
```

## Watch Mode

Por defecto, Vitest ejecuta en modo watch:

```bash
npm run test
```

**Comandos en watch mode:**
- `a` - Re-ejecutar todos los tests
- `f` - Re-ejecutar solo tests fallidos
- `u` - Actualizar snapshots
- `q` - Salir

## UI Mode

Interfaz gráfica para visualizar tests:

```bash
npm run test:ui
```

Abre una interfaz web con:
- Lista de tests con estado (✅/❌)
- Resultados detallados
- Cobertura de código
- Filtros y búsqueda

## Coverage (Cobertura)

Genera reporte de qué porcentaje del código está testeado:

```bash
npm run coverage
```

**Métricas:**
- **Statements**: % de líneas ejecutadas
- **Branches**: % de ramas if/else cubiertas
- **Functions**: % de funciones llamadas
- **Lines**: % de líneas de código

**Reporte HTML:** Se genera en `coverage/index.html`

## Buenas Prácticas

### 1. Un concepto por test

```tsx
// ❌ MAL - Múltiples conceptos
test("debe hacer muchas cosas", () => {
  expect(add(1, 1)).toBe(2);
  expect(subtract(5, 3)).toBe(2);
  expect(multiply(2, 3)).toBe(6);
});

// ✅ BIEN - Un concepto por test
test("debe sumar correctamente", () => {
  expect(add(1, 1)).toBe(2);
});

test("debe restar correctamente", () => {
  expect(subtract(5, 3)).toBe(2);
});
```

### 2. Nombres descriptivos

```tsx
// ❌ MAL
test("test1", () => { ... });

// ✅ BIEN
test("debe mostrar mensaje de error cuando el email es inválido", () => { ... });
```

### 3. Arrange-Act-Assert (AAA)

```tsx
test("debe calcular total con descuento", () => {
  // Arrange - Preparar
  const price = 100;
  const discount = 0.1;

  // Act - Actuar
  const total = calculateTotal(price, discount);

  // Assert - Afirmar
  expect(total).toBe(90);
});
```

### 4. Tests independientes

Cada test debe poder ejecutarse solo, sin depender de otros.

```tsx
// ❌ MAL - Tests dependientes
let counter = 0;

test("incrementa", () => {
  counter++;
  expect(counter).toBe(1);
});

test("incrementa otra vez", () => {
  counter++; // Depende del test anterior
  expect(counter).toBe(2);
});

// ✅ BIEN - Tests independientes
test("incrementa desde cero", () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});

test("incrementa desde cero (2)", () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});
```

## Ejemplo Completo

```tsx
import { describe, test, expect, beforeEach } from "vitest";

describe("Calculator", () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe("add()", () => {
    test("debe sumar dos números positivos", () => {
      const result = calculator.add(2, 3);
      expect(result).toBe(5);
    });

    test("debe sumar números negativos", () => {
      const result = calculator.add(-2, -3);
      expect(result).toBe(-5);
    });

    test("debe manejar cero", () => {
      const result = calculator.add(5, 0);
      expect(result).toBe(5);
    });
  });

  describe("divide()", () => {
    test("debe dividir correctamente", () => {
      const result = calculator.divide(10, 2);
      expect(result).toBe(5);
    });

    test("debe lanzar error al dividir por cero", () => {
      expect(() => calculator.divide(10, 0)).toThrow();
    });
  });
});
```

## Resumen

- **describe()** - Agrupa tests
- **test()** - Define un test
- **expect()** - Crea expectativas
- **beforeEach/afterEach** - Setup/cleanup por test
- **beforeAll/afterAll** - Setup/cleanup una vez
- **.only/.skip/.todo** - Controlar ejecución
- **AAA pattern** - Arrange-Act-Assert

---

## Próximos Pasos

1. Aprender [React Testing Library](./03-react-testing-library.md)
2. Entender [screen vs container](./04-screen-vs-container.md)
3. Ver [ejemplos del proyecto](./05-ejemplos-proyecto.md)

## Recursos

- [Vitest API Reference](https://vitest.dev/api/)
- [Vitest Matchers](https://vitest.dev/api/expect.html)
