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

### Cuándo usar toBe vs toStrictEqual

La diferencia principal está en cómo comparan valores:

**toBe()** - Usa igualdad estricta (===)
- Para valores primitivos: strings, numbers, booleans
- Compara referencias de objetos/arrays (no su contenido)

```tsx
// ✅ Valores primitivos
expect(5).toBe(5);
expect("hello").toBe("hello");
expect(true).toBe(true);

// ❌ Objetos y arrays (compara referencias)
expect({ name: "John" }).toBe({ name: "John" }); // Falla
expect([1, 2, 3]).toBe([1, 2, 3]); // Falla
```

**toStrictEqual()** - Compara contenido profundo
- Para objetos y arrays (compara su estructura y valores)
- Verifica tipos exactos (más estricto que toEqual)
- No permite propiedades undefined

```tsx
// ✅ Objetos y arrays
expect({ name: "John", age: 30 }).toStrictEqual({ name: "John", age: 30 });
expect([1, 2, 3]).toStrictEqual([1, 2, 3]);

// Verifica estructura completa
expect({
  id: "123",
  title: "Test",
  metadata: { views: 100 }
}).toStrictEqual({
  id: "123",
  title: "Test",
  metadata: { views: 100 }
});
```

**Regla práctica:**
- Primitivos → `toBe()`
- Objetos/Arrays → `toStrictEqual()`

### expect.any() - Validar tipos sin valores exactos

`expect.any()` permite verificar el tipo de un valor sin conocer su contenido exacto.

**Tipos disponibles:**
```tsx
expect.any(String)   // Cualquier string
expect.any(Number)   // Cualquier número
expect.any(Boolean)  // Cualquier booleano
expect.any(Array)    // Cualquier array
expect.any(Object)   // Cualquier objeto
expect.any(Function) // Cualquier función
expect.any(Date)     // Cualquier fecha
```

**Uso común - Validar estructura de objetos:**
```tsx
const user = {
  id: "abc-123",
  name: "John Doe",
  age: 30,
  createdAt: new Date()
};

// Verificar tipos sin saber valores exactos
expect(user).toStrictEqual({
  id: expect.any(String),      // Cualquier string como id
  name: expect.any(String),    // Cualquier nombre
  age: expect.any(Number),     // Cualquier edad
  createdAt: expect.any(Date)  // Cualquier fecha
});
```

**Ejemplo real - Respuesta de API:**
```tsx
test("debe retornar gifs con estructura correcta", async () => {
  const gifs = await getGifsByQuery("goku");
  const [firstGif] = gifs;

  // No conocemos los valores exactos, pero sabemos los tipos
  expect(firstGif).toStrictEqual({
    id: expect.any(String),      // ID generado por Giphy
    title: expect.any(String),   // Título variable
    url: expect.any(String),     // URL variable
    width: expect.any(Number),   // Dimensiones variables
    height: expect.any(Number)
  });
});
```

**Ventajas:**
- Testear datos dinámicos (IDs, timestamps, URLs)
- Verificar estructura sin hardcodear valores
- Tests más flexibles y mantenibles

**Combinando validaciones:**
```tsx
// Validar tipo Y valor específico
expect(user).toStrictEqual({
  id: expect.any(String),
  name: "John",              // Valor exacto
  age: expect.any(Number),
  active: true               // Valor exacto
});

// Validar arrays con elementos de tipo específico
expect(numbers).toEqual(
  expect.arrayContaining([expect.any(Number)])
);
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
