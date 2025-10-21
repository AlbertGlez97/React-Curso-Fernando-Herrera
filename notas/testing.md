# Guía de Testing en React

## Herramientas Utilizadas

### Vitest
Framework de testing moderno y rápido, compatible con Vite. Es el sucesor espiritual de Jest pero optimizado para proyectos con Vite.

**Instalación:**
```bash
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8
```

### Testing Library
Conjunto de herramientas para testear componentes de React de forma que simula cómo los usuarios interactúan con la aplicación.

**Instalación:**
```bash
npm install --save-dev @testing-library/react @testing-library/dom
```

### jsdom
Implementación de JavaScript del DOM y HTML, permite ejecutar tests en Node.js simulando un navegador.

**Instalación:**
```bash
npm install --save-dev jsdom
```

## Configuración

### vite.config.ts
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

## Comandos de Testing

```bash
# Ejecutar tests en modo watch
npm run test

# Ejecutar tests con interfaz visual
npm run test:ui -- --api.port=9999

# Ejecutar tests con reporte de cobertura
npm run test:coverage -- --api.port=9999
```

## Tipos de Tests

### 1. Tests Básicos de Renderizado

Verifican que un componente se renderiza correctamente con las props proporcionadas.

**Ejemplo:**
```typescript
test("should render firstName and lastName", () => {
  render(<MyAwesomeApp name="John" lastName="Doe" />);

  const h1 = screen.getByRole("heading", { level: 1 });

  expect(h1?.innerHTML).toContain("John");
});
```

### 2. Snapshot Tests

Verifican que la estructura física del componente no cambia accidentalmente. Útil para detectar cambios no intencionados en el UI.

**Ejemplo:**
```typescript
test("should match snapshot", () => {
  const { container } = render(<MyAwesomeApp name="John" lastName="Doe" />);

  expect(container).toMatchSnapshot();
});
```

**Nota:** Los snapshots se guardan en la carpeta `__snapshots__/` junto al archivo de test.

### 3. Tests de Interacción

Simulan interacciones del usuario (clicks, inputs, etc.) y verifican el comportamiento resultante.

**Ejemplo:**
```typescript
test("should increase count when +1 button is pressed", () => {
  render(<ItemCounter productName="Test item" quantity={5} />);

  const [buttonAdd] = screen.getAllByRole("button", { name: "+1" });

  fireEvent.click(buttonAdd);

  expect(screen.getByText("6")).toBeDefined();
});
```

### 4. Tests con Mocks

Permiten aislar el componente bajo prueba reemplazando dependencias con versiones simuladas.

**Ejemplo:**
```typescript
// Definir el mock DENTRO de vi.mock() para evitar errores de hoisting
vi.mock("./shopping-cart/ItemCounter", () => ({
  default: vi.fn((props: any) => {
    return (
      <div
        data-testid="ItemCounter"
        productName={props.productName}
        quantity={props.quantity}
      />
    );
  }),
}));

describe("FirstStepsApp", () => {
  afterEach(() => {
    vi.clearAllMocks(); // Limpiar mocks después de cada test
  });

  test("should render the correct number of components", () => {
    render(<FirstStepsApp />);

    const itemCounters = screen.getAllByTestId("ItemCounter");

    expect(itemCounters.length).toBe(3);
  });
});
```

## Métodos de Testing Library

### render()
Renderiza un componente React en un contenedor del DOM de prueba.

```typescript
const { container } = render(<Component />);
```

### screen
Objeto que proporciona queries para buscar elementos en el DOM renderizado.

**Queries principales:**
- `getByRole()` - Busca por rol ARIA (heading, button, textbox, etc.)
- `getByText()` - Busca por contenido de texto
- `getByTestId()` - Busca por atributo data-testid
- `getAllBy*()` - Versiones que devuelven arrays de elementos

**Ejemplo:**
```typescript
screen.getByRole("heading", { level: 1 });
screen.getByText("Hello World");
screen.getByTestId("custom-element");
screen.getAllByRole("button");
```

### fireEvent
Simula eventos del usuario sobre elementos del DOM.

```typescript
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'nuevo valor' } });
```

### screen.debug()
Imprime el estado actual del DOM en la consola. Útil para debugging.

```typescript
screen.debug(); // Imprime todo el documento
screen.debug(element); // Imprime un elemento específico
```

## Diferencias: container vs screen

### container
- Se obtiene de `render()`
- Representa un snapshot estático en el momento del render
- Útil para evaluar el estado inicial sin manipulación de eventos
- No se actualiza automáticamente

**Cuándo usar:**
```typescript
test("should render with initial state", () => {
  const { container } = render(<Component />);
  const h1 = container.querySelector("h1");
  expect(h1?.innerHTML).toBe("Initial");
});
```

### screen
- Objeto global de Testing Library
- Se actualiza cuando ocurren eventos
- Ideal para tests con interacciones del usuario
- Proporciona queries más semánticas

**Cuándo usar:**
```typescript
test("should update on button click", () => {
  render(<Component />);

  const button = screen.getByRole("button");
  fireEvent.click(button);

  expect(screen.getByText("Updated")).toBeDefined();
});
```

## Mejores Prácticas

### 1. Limpieza de Mocks
Siempre limpia los mocks después de cada test para evitar interferencias:

```typescript
afterEach(() => {
  vi.clearAllMocks();
});
```

### 2. Hoisting de vi.mock()
`vi.mock()` es hoisted (movido al inicio del archivo), por lo que no puede referenciar variables declaradas antes:

**❌ Incorrecto:**
```typescript
const mockFn = vi.fn();
vi.mock("./module", () => ({ default: mockFn })); // Error!
```

**✅ Correcto:**
```typescript
vi.mock("./module", () => ({
  default: vi.fn((props) => <div {...props} />)
}));
```

### 3. Usa Queries Semánticas
Prefiere queries que reflejen cómo los usuarios interactúan:

**Prioridad de queries:**
1. `getByRole()` - Más accesible
2. `getByLabelText()` - Para formularios
3. `getByPlaceholderText()` - Para inputs
4. `getByText()` - Para contenido
5. `getByTestId()` - Último recurso

### 4. Organiza tus Tests
```typescript
describe("ComponentName", () => {
  describe("Rendering", () => {
    test("should render with default props", () => {});
    test("should match snapshot", () => {});
  });

  describe("User Interactions", () => {
    test("should handle click", () => {});
  });

  describe("Edge Cases", () => {
    test("should not go below minimum", () => {});
  });
});
```

### 5. Tests Descriptivos
Usa nombres que describan claramente qué se está probando:

```typescript
// ❌ Poco descriptivo
test("test 1", () => {});

// ✅ Descriptivo
test("should not decrease count below 1 when -1 button is pressed", () => {});
```

## Ejemplo Completo

```typescript
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ItemCounter from "./ItemCounter";

describe("ItemCounter", () => {
  test("should render with default values", () => {
    const name = "Test item";

    render(<ItemCounter productName={name} />);

    expect(screen.getByText(name)).toBeDefined();
  });

  test("should increase count when +1 button is pressed", () => {
    render(<ItemCounter productName="Test item" quantity={5} />);

    const [buttonAdd] = screen.getAllByRole("button", { name: "+1" });

    fireEvent.click(buttonAdd);

    expect(screen.getByText("6")).toBeDefined();
  });

  test("should not decrease count below 1", () => {
    render(<ItemCounter productName="Test item" quantity={1} />);

    const [buttonSubtract] = screen.getAllByRole("button", { name: "-1" });

    fireEvent.click(buttonSubtract);

    expect(screen.getByText("1")).toBeDefined();
  });

  test("should match snapshot", () => {
    const { container } = render(
      <ItemCounter productName="Test" quantity={5} />
    );

    expect(container).toMatchSnapshot();
  });
});
```

## Recursos Adicionales

- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Common Queries Cheatsheet](https://testing-library.com/docs/queries/about)
