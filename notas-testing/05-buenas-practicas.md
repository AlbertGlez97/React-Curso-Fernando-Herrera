# Buenas Prácticas de Testing en React

Esta guía recopila las mejores prácticas para escribir tests mantenibles, legibles y efectivos en aplicaciones React.

## Principios Fundamentales

### 1. Testea comportamiento, no implementación

**❌ Malo: Test acoplado a implementación**
```tsx
test("should have correct CSS class", () => {
  const { container } = render(<Button />);
  const button = container.querySelector(".btn-primary");
  expect(button).toBeDefined();
});
```

**✅ Bueno: Test de comportamiento**
```tsx
test("should be clickable", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole("button");
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Por qué:** Puedes cambiar el CSS sin romper el test.

### 2. Escribe tests desde la perspectiva del usuario

Los usuarios no ven el código, ven la interfaz.

**❌ Malo:**
```tsx
test("should update state correctly", () => {
  const wrapper = render(<Counter />);
  wrapper.state.count = 5; // Accediendo al estado interno
  expect(wrapper.state.count).toBe(5);
});
```

**✅ Bueno:**
```tsx
test("should display incremented count when button is clicked", () => {
  render(<Counter />);

  const button = screen.getByRole("button", { name: /increment/i });
  fireEvent.click(button);

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### 3. Tests independientes

Cada test debe poder ejecutarse solo.

**❌ Malo: Tests dependientes**
```tsx
let sharedState = 0;

test("incrementa el contador", () => {
  sharedState++;
  expect(sharedState).toBe(1);
});

test("incrementa nuevamente", () => {
  sharedState++; // Depende del test anterior
  expect(sharedState).toBe(2);
});
```

**✅ Bueno: Tests independientes**
```tsx
test("incrementa el contador desde cero", () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});

test("incrementa el contador desde cero (2)", () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});
```

## Naming (Nombres de Tests)

### Patrón: "should [acción] when [condición]"

**✅ Bueno:**
```tsx
test("should display error message when email is invalid", () => { ... });
test("should disable submit button when form is incomplete", () => { ... });
test("should show loading spinner when data is fetching", () => { ... });
```

**❌ Malo:**
```tsx
test("test1", () => { ... });
test("error", () => { ... });
test("it works", () => { ... });
```

### Nombres descriptivos y específicos

```tsx
// ✅ Específico
test("should render 5 list items when given array of 5 users", () => { ... });

// ❌ Vago
test("should render correctly", () => { ... });
```

## Arrange-Act-Assert (AAA)

Estructura tus tests en 3 fases claras.

```tsx
test("should calculate discount correctly", () => {
  // Arrange - Preparar el escenario
  const price = 100;
  const discountPercentage = 20;

  // Act - Ejecutar la acción
  const finalPrice = applyDiscount(price, discountPercentage);

  // Assert - Verificar el resultado
  expect(finalPrice).toBe(80);
});
```

### Con componentes React

```tsx
test("should show welcome message after login", () => {
  // Arrange
  const user = { name: "John", email: "john@example.com" };

  // Act
  render(<Dashboard user={user} />);

  // Assert
  expect(screen.getByText(/welcome, john/i)).toBeInTheDocument();
});
```

## Queries: Orden de Prioridad

Usa queries en este orden de prioridad:

### 1. Queries Accesibles (Preferidas)

```tsx
// ✅ 1. getByRole (mejor)
screen.getByRole("button", { name: /submit/i });

// ✅ 2. getByLabelText (formularios)
screen.getByLabelText("Email");

// ✅ 3. getByPlaceholderText
screen.getByPlaceholderText("Enter your name");

// ✅ 4. getByText
screen.getByText("Welcome back!");
```

### 2. Queries Semánticas

```tsx
// ⚠️ 5. getByAltText (imágenes)
screen.getByAltText("Company logo");

// ⚠️ 6. getByTitle
screen.getByTitle("Close dialog");
```

### 3. Último Recurso

```tsx
// ❌ 7. getByTestId (evitar si es posible)
screen.getByTestId("custom-element");
```

## Screen vs Container

### Regla: Usa screen por defecto

```tsx
// ✅ Preferido
render(<Component />);
const button = screen.getByRole("button");

// ❌ Evitar (salvo casos específicos)
const { container } = render(<Component />);
const button = container.querySelector("button");
```

### Excepciones para container

1. **Selectores CSS complejos sin alternativa**
```tsx
const { container } = render(<Component />);
const nested = container.querySelector(".parent > .child .deep");
```

2. **Verificar que elemento NO existe** (aunque `screen.queryBy` es mejor)
```tsx
const { container } = render(<Component />);
const element = container.querySelector(".optional");
expect(element).toBeNull();
```

## Matchers Semánticos

### Usa matchers de Testing Library

**❌ Malo:**
```tsx
expect(element.textContent).toBe("Hello");
expect(element.innerHTML).toContain("Hello");
expect(element.disabled).toBe(true);
```

**✅ Bueno:**
```tsx
expect(element).toHaveTextContent("Hello");
expect(element).toContainHTML("<strong>Hello</strong>");
expect(element).toBeDisabled();
```

### Matchers más comunes

**Nota:** Ver [nota 06 - Matchers de jest-dom](./06-matchers-jest-dom.md) para la lista completa y ejemplos detallados.

```tsx
// Contenido
expect(element).toHaveTextContent("text");
expect(element).toBeInTheDocument();

// Estado
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toBeEnabled();

// Formularios
expect(input).toHaveValue("value");
expect(checkbox).toBeChecked();

// Atributos
expect(element).toHaveClass("active");
expect(element).toHaveAttribute("href", "/home");
```

## Testing de Interacciones

### fireEvent vs userEvent

**fireEvent:** Dispara eventos del DOM directamente.
**userEvent:** Simula interacciones reales del usuario (preferido).

```tsx
import userEvent from "@testing-library/user-event";

// ❌ Funciona, pero no es realista
test("should handle click", () => {
  render(<Button onClick={handleClick} />);
  fireEvent.click(screen.getByRole("button"));
});

// ✅ Simula mejor el comportamiento real
test("should handle click", async () => {
  const user = userEvent.setup();
  render(<Button onClick={handleClick} />);

  await user.click(screen.getByRole("button"));
});
```

### Interacciones comunes

```tsx
const user = userEvent.setup();

// Click
await user.click(element);

// Tipear
await user.type(input, "Hello world");

// Borrar y tipear
await user.clear(input);
await user.type(input, "New text");

// Seleccionar dropdown
await user.selectOptions(select, "option1");

// Checkbox/Radio
await user.click(checkbox);

// Hover
await user.hover(element);

// Tab navigation
await user.tab();
```

## Testing Asíncrono

### waitFor - Esperar condiciones

```tsx
test("should show data after loading", async () => {
  render(<AsyncComponent />);

  // Esperar hasta que el dato aparezca
  await waitFor(() => {
    expect(screen.getByText("Data loaded")).toBeInTheDocument();
  });
});
```

### findBy - Query asíncrona

```tsx
test("should display message after fetch", async () => {
  render(<AsyncComponent />);

  // findBy espera automáticamente (más limpio)
  const message = await screen.findByText("Data loaded");
  expect(message).toBeInTheDocument();
});
```

### Comparación

```tsx
// ✅ Más limpio - findBy
const element = await screen.findByText("text");

// ⚠️ Más verboso - waitFor + getBy
await waitFor(() => {
  expect(screen.getByText("text")).toBeInTheDocument();
});
```

## Mocking

### Mock de API calls

```tsx
import { vi } from "vitest";

test("should fetch and display users", async () => {
  // Mock de fetch
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ]),
    })
  );

  render(<UserList />);

  const users = await screen.findAllByRole("listitem");
  expect(users).toHaveLength(2);
});
```

### Mock de módulos

```tsx
vi.mock("./api", () => ({
  fetchUsers: vi.fn(() => Promise.resolve([
    { id: 1, name: "John" }
  ]))
}));
```

### Mock de funciones (callbacks)

```tsx
test("should call onClick when button is clicked", () => {
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByRole("button"));

  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick).toHaveBeenCalledWith(expect.any(Object)); // event
});
```

## Testing de Custom Hooks

Usa `renderHook` de React Testing Library.

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Ejemplo con nuestro proyecto

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { useGifs } from "./useGifs";

test("should fetch gifs on search", async () => {
  const { result } = renderHook(() => useGifs());

  act(() => {
    result.current.handleSearch("cats");
  });

  await waitFor(() => {
    expect(result.current.gifs.length).toBeGreaterThan(0);
  });
});

test("should not allow duplicate searches", () => {
  const { result } = renderHook(() => useGifs());

  act(() => {
    result.current.handleSearch("cats");
    result.current.handleSearch("cats"); // Duplicado
  });

  expect(result.current.previousTerms).toHaveLength(1);
});
```

## Snapshots

### Cuándo usar snapshots

✅ **Sí usa snapshots para:**
- Componentes de UI complejos
- Como complemento a otros tests
- Errores de renderizado inesperados

❌ **No uses snapshots para:**
- Como único tipo de test
- Lógica de negocio
- Datos dinámicos (timestamps, IDs random)

### Snapshot de componente

```tsx
test("should match snapshot", () => {
  const { container } = render(<CustomHeader title="Title" />);
  expect(container).toMatchSnapshot();
});
```

### Actualizar snapshots

```bash
npm run test -- -u
```

## Coverage (Cobertura)

### Objetivo de cobertura

- **80-90%** de cobertura es un buen objetivo
- **100%** no siempre es necesario ni práctico

### Qué NO necesita 100% de cobertura

- Archivos de configuración
- Tipos de TypeScript
- Componentes de presentación simples
- Código legacy en refactoring

### Generar reporte

```bash
npm run coverage
```

## Organización de Tests

### Estructura de archivos

```
src/
├── components/
│   ├── Button.tsx
│   ├── Button.test.tsx      # ✅ Junto al componente
│   ├── Header.tsx
│   └── Header.test.tsx
└── utils/
    ├── formatDate.ts
    └── formatDate.test.ts
```

### Agrupar con describe

```tsx
describe("Calculator", () => {
  describe("add()", () => {
    test("should add positive numbers", () => { ... });
    test("should add negative numbers", () => { ... });
  });

  describe("subtract()", () => {
    test("should subtract correctly", () => { ... });
  });
});
```

## Common Mistakes (Errores Comunes)

### 1. No esperar elementos asíncronos

**❌ Malo:**
```tsx
render(<AsyncComponent />);
const data = screen.getByText("Loaded"); // Error! No está aún
```

**✅ Bueno:**
```tsx
render(<AsyncComponent />);
const data = await screen.findByText("Loaded");
```

### 2. Queries incorrectas para verificar ausencia

**❌ Malo:**
```tsx
expect(screen.getByText("Not here")).toBeNull(); // Error! lanza excepción
```

**✅ Bueno:**
```tsx
expect(screen.queryByText("Not here")).toBeNull();
```

### 3. No limpiar después de cada test

**❌ Malo:**
```tsx
// Estado persiste entre tests
let data = [];

test("test 1", () => {
  data.push("item");
  // ...
});

test("test 2", () => {
  // data ya tiene "item" del test anterior!
});
```

**✅ Bueno:**
```tsx
describe("Tests", () => {
  let data;

  beforeEach(() => {
    data = []; // Reset antes de cada test
  });

  test("test 1", () => { ... });
  test("test 2", () => { ... });
});
```

### 4. Usar container innecesariamente

**❌ Malo:**
```tsx
const { container } = render(<Component />);
const button = container.querySelector("button");
```

**✅ Bueno:**
```tsx
render(<Component />);
const button = screen.getByRole("button");
```

## Checklist de Buenas Prácticas

Antes de hacer commit de un test, verifica:

- [ ] Usa `screen` en lugar de `container` (salvo casos específicos)
- [ ] Queries por rol/texto, no por clases CSS
- [ ] Nombre descriptivo del test
- [ ] Estructura AAA (Arrange-Act-Assert)
- [ ] Test independiente (puede ejecutarse solo)
- [ ] Usa `userEvent` para interacciones (no `fireEvent`)
- [ ] Usa `findBy` para elementos asíncronos
- [ ] Usa `queryBy` para verificar ausencia
- [ ] Matchers semánticos (`toHaveTextContent`, no `.textContent`)
- [ ] Mock de APIs y funciones cuando sea necesario
- [ ] El test es legible sin ver el componente

## Recursos

- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Vitest Best Practices](https://vitest.dev/guide/best-practices)
