# Matchers de jest-dom

Esta nota cubre todos los matchers personalizados de `@testing-library/jest-dom` que hacen los tests más legibles y expresivos.

## ¿Qué es jest-dom?

**@testing-library/jest-dom** es una librería que extiende Vitest/Jest con matchers personalizados específicos para testing del DOM. Hace que los tests sean más semánticos y los mensajes de error más claros.

### Instalación

```bash
npm install --save-dev @testing-library/jest-dom
```

Ver [nota 01](./01-instalacion-configuracion.md) para la configuración completa con `setup.ts`.

## Por Qué Usar jest-dom

### Sin jest-dom ❌

```tsx
const button = screen.getByRole("button");

// Verbose y poco claro
expect(button.textContent).toBe("Click me");
expect(button.disabled).toBe(false);
expect(button.className).toContain("active");
```

### Con jest-dom ✅

```tsx
const button = screen.getByRole("button");

// Expresivo y claro
expect(button).toHaveTextContent("Click me");
expect(button).toBeEnabled();
expect(button).toHaveClass("active");
```

**Ventajas:**
- ✅ Más legible
- ✅ Mejores mensajes de error
- ✅ Semántico
- ✅ Auto-documentado

## Matchers de Presencia

### toBeInTheDocument()

Verifica que un elemento existe en el DOM.

```tsx
test("should render heading", () => {
  render(<h1>Hello</h1>);

  const heading = screen.getByRole("heading");
  expect(heading).toBeInTheDocument();
});
```

**Caso de uso:** Verificar que un elemento se renderizó.

### toBeEmptyDOMElement()

Verifica que un elemento está vacío (sin hijos).

```tsx
test("should be empty", () => {
  render(<div data-testid="container"></div>);

  const container = screen.getByTestId("container");
  expect(container).toBeEmptyDOMElement();
});
```

### toContainElement()

Verifica que un elemento contiene otro elemento específico.

```tsx
test("should contain child", () => {
  render(
    <div>
      <span data-testid="child">Child</span>
    </div>
  );

  const parent = screen.getByRole("generic");
  const child = screen.getByTestId("child");

  expect(parent).toContainElement(child);
});
```

## Matchers de Visibilidad

### toBeVisible()

Verifica que un elemento es visible para el usuario.

```tsx
test("should be visible", () => {
  render(<button>Click me</button>);

  const button = screen.getByRole("button");
  expect(button).toBeVisible();
});

test("should not be visible when hidden", () => {
  render(<button style={{ display: "none" }}>Hidden</button>);

  const button = screen.getByRole("button", { hidden: true });
  expect(button).not.toBeVisible();
});
```

**Considera invisible si:**
- `display: none`
- `visibility: hidden`
- `opacity: 0`
- Tamaño 0x0

## Matchers de Contenido

### toHaveTextContent()

Verifica el contenido de texto de un elemento.

```tsx
test("should have text content", () => {
  render(<p>Hello World</p>);

  const paragraph = screen.getByRole("paragraph");

  // Texto exacto
  expect(paragraph).toHaveTextContent("Hello World");

  // Texto parcial
  expect(paragraph).toHaveTextContent("Hello");

  // Con regex (case-insensitive)
  expect(paragraph).toHaveTextContent(/hello world/i);
});
```

**Ventaja sobre `.textContent`:**
- Ignora espacios extra
- Mejores mensajes de error
- Soporta regex

### toContainHTML()

Verifica que un elemento contiene HTML específico.

```tsx
test("should contain HTML", () => {
  render(
    <div>
      <strong>Bold</strong> text
    </div>
  );

  const div = screen.getByRole("generic");
  expect(div).toContainHTML("<strong>Bold</strong>");
});
```

**Uso:** Verificar estructura HTML interna.

## Matchers de Atributos

### toHaveAttribute()

Verifica que un elemento tiene un atributo específico.

```tsx
test("should have href attribute", () => {
  render(<a href="/home">Home</a>);

  const link = screen.getByRole("link");

  // Verificar atributo con valor
  expect(link).toHaveAttribute("href", "/home");

  // Verificar que atributo existe (cualquier valor)
  expect(link).toHaveAttribute("href");
});

test("should have data attribute", () => {
  render(<div data-testid="custom" data-value="123">Content</div>);

  const element = screen.getByTestId("custom");

  expect(element).toHaveAttribute("data-value", "123");
  expect(element).toHaveAttribute("data-testid");
});
```

### toHaveClass()

Verifica que un elemento tiene clases CSS específicas.

```tsx
test("should have class", () => {
  render(<button className="btn btn-primary active">Click</button>);

  const button = screen.getByRole("button");

  // Una clase
  expect(button).toHaveClass("btn");

  // Múltiples clases (en cualquier orden)
  expect(button).toHaveClass("btn", "btn-primary");

  // Clase exacta (todas y solo esas)
  expect(button).toHaveClass("btn btn-primary active", { exact: true });
});
```

### toHaveStyle()

Verifica que un elemento tiene estilos CSS específicos.

```tsx
test("should have style", () => {
  render(
    <div style={{ display: "flex", color: "red", fontSize: "16px" }}>
      Styled
    </div>
  );

  const div = screen.getByText("Styled");

  // Un estilo
  expect(div).toHaveStyle({ color: "red" });

  // Múltiples estilos
  expect(div).toHaveStyle({
    display: "flex",
    color: "red",
  });

  // Con string CSS
  expect(div).toHaveStyle("color: red; display: flex");
});
```

**Nota:** Solo verifica estilos inline o computados.

## Matchers de Formularios

### toHaveValue()

Verifica el valor de un input, textarea o select.

```tsx
test("should have input value", () => {
  render(<input type="text" value="Hello" readOnly />);

  const input = screen.getByRole("textbox");
  expect(input).toHaveValue("Hello");
});

test("should have number value", () => {
  render(<input type="number" value={42} readOnly />);

  const input = screen.getByRole("spinbutton");
  expect(input).toHaveValue(42);
});

test("should have select value", () => {
  render(
    <select value="option2">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
    </select>
  );

  const select = screen.getByRole("combobox");
  expect(select).toHaveValue("option2");
});
```

### toHaveDisplayValue()

Verifica el valor visible de un input o textarea.

```tsx
test("should have display value", () => {
  render(
    <select>
      <option value="1">First</option>
      <option value="2" selected>Second</option>
    </select>
  );

  const select = screen.getByRole("combobox");

  // Verifica el texto visible, no el value
  expect(select).toHaveDisplayValue("Second");
});
```

**Diferencia con `toHaveValue()`:**
- `toHaveValue()` → verifica el atributo `value`
- `toHaveDisplayValue()` → verifica el texto visible

### toBeChecked()

Verifica que un checkbox o radio está marcado.

```tsx
test("should be checked", () => {
  render(<input type="checkbox" checked readOnly />);

  const checkbox = screen.getByRole("checkbox");
  expect(checkbox).toBeChecked();
});

test("should not be checked", () => {
  render(<input type="checkbox" />);

  const checkbox = screen.getByRole("checkbox");
  expect(checkbox).not.toBeChecked();
});
```

### toBePartiallyChecked()

Verifica que un checkbox está en estado indeterminado.

```tsx
test("should be partially checked", () => {
  render(<input type="checkbox" indeterminate={true} />);

  const checkbox = screen.getByRole("checkbox");
  expect(checkbox).toBePartiallyChecked();
});
```

## Matchers de Estado

### toBeDisabled() / toBeEnabled()

Verifica si un elemento está habilitado o deshabilitado.

```tsx
test("should be disabled", () => {
  render(<button disabled>Click</button>);

  const button = screen.getByRole("button");
  expect(button).toBeDisabled();
});

test("should be enabled", () => {
  render(<button>Click</button>);

  const button = screen.getByRole("button");
  expect(button).toBeEnabled();
});

test("fieldset disables children", () => {
  render(
    <fieldset disabled>
      <input type="text" />
    </fieldset>
  );

  const input = screen.getByRole("textbox");
  expect(input).toBeDisabled(); // Heredado del fieldset
});
```

### toBeRequired()

Verifica que un campo de formulario es requerido.

```tsx
test("should be required", () => {
  render(<input type="text" required />);

  const input = screen.getByRole("textbox");
  expect(input).toBeRequired();
});

test("should not be required", () => {
  render(<input type="text" />);

  const input = screen.getByRole("textbox");
  expect(input).not.toBeRequired();
});
```

### toBeInvalid() / toBeValid()

Verifica el estado de validación de un formulario.

```tsx
test("should be invalid", () => {
  render(<input type="email" value="not-an-email" aria-invalid="true" />);

  const input = screen.getByRole("textbox");
  expect(input).toBeInvalid();
});

test("should be valid", () => {
  render(<input type="email" value="test@example.com" />);

  const input = screen.getByRole("textbox");
  expect(input).toBeValid();
});
```

## Matchers de Enfoque

### toHaveFocus()

Verifica que un elemento tiene el foco.

```tsx
test("should have focus", () => {
  render(<input type="text" autoFocus />);

  const input = screen.getByRole("textbox");
  expect(input).toHaveFocus();
});

test("should focus on click", async () => {
  const user = userEvent.setup();
  render(<button>Click me</button>);

  const button = screen.getByRole("button");
  await user.click(button);

  expect(button).toHaveFocus();
});
```

## Matchers Avanzados

### toHaveAccessibleName()

Verifica el nombre accesible de un elemento.

```tsx
test("should have accessible name from label", () => {
  render(
    <>
      <label htmlFor="username">Username</label>
      <input id="username" />
    </>
  );

  const input = screen.getByRole("textbox");
  expect(input).toHaveAccessibleName("Username");
});

test("should have accessible name from aria-label", () => {
  render(<button aria-label="Close dialog">X</button>);

  const button = screen.getByRole("button");
  expect(button).toHaveAccessibleName("Close dialog");
});
```

### toHaveAccessibleDescription()

Verifica la descripción accesible de un elemento.

```tsx
test("should have accessible description", () => {
  render(
    <>
      <input aria-describedby="hint" />
      <div id="hint">Enter your email</div>
    </>
  );

  const input = screen.getByRole("textbox");
  expect(input).toHaveAccessibleDescription("Enter your email");
});
```

### toHaveErrorMessage()

Verifica el mensaje de error asociado a un elemento.

```tsx
test("should have error message", () => {
  render(
    <>
      <input aria-invalid="true" aria-errormessage="error" />
      <div id="error" role="alert">Invalid email</div>
    </>
  );

  const input = screen.getByRole("textbox");
  expect(input).toHaveErrorMessage("Invalid email");
});
```

## Comparación Rápida

| Sin jest-dom | Con jest-dom | Ventaja |
|--------------|--------------|---------|
| `element.textContent === "text"` | `toHaveTextContent("text")` | Más expresivo |
| `element.disabled === true` | `toBeDisabled()` | Semántico |
| `element.className.includes("active")` | `toHaveClass("active")` | Robusto |
| `element.getAttribute("href") === "/"` | `toHaveAttribute("href", "/")` | Claro |
| `element === document.activeElement` | `toHaveFocus()` | Legible |

## Negación

Todos los matchers soportan negación con `.not`:

```tsx
expect(element).not.toBeInTheDocument();
expect(element).not.toBeVisible();
expect(element).not.toHaveClass("active");
expect(element).not.toBeDisabled();
```

## Mejores Mensajes de Error

### Sin jest-dom

```
Expected: true
Received: false
```

### Con jest-dom

```
Expected element to be in the document.
Received element: <button>Click me</button>

The element was not found in the document.
```

**Ventaja:** Mensajes mucho más descriptivos y útiles para debugging.

## Resumen de Matchers

### Por Categoría

**Presencia:**
- `toBeInTheDocument()`
- `toBeEmptyDOMElement()`
- `toContainElement()`

**Visibilidad:**
- `toBeVisible()`

**Contenido:**
- `toHaveTextContent()`
- `toContainHTML()`

**Atributos:**
- `toHaveAttribute()`
- `toHaveClass()`
- `toHaveStyle()`

**Formularios:**
- `toHaveValue()`
- `toHaveDisplayValue()`
- `toBeChecked()`
- `toBePartiallyChecked()`

**Estado:**
- `toBeDisabled()` / `toBeEnabled()`
- `toBeRequired()`
- `toBeInvalid()` / `toBeValid()`

**Enfoque:**
- `toHaveFocus()`

**Accesibilidad:**
- `toHaveAccessibleName()`
- `toHaveAccessibleDescription()`
- `toHaveErrorMessage()`

## Uso en el Proyecto

En nuestro proyecto, ya usamos `toHaveTextContent()`:

```tsx
// src/shared/components/CustomHeader.test.tsx
test("should render the title correctly", () => {
  render(<CustomHeader title={title} />);

  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent(title); // ← jest-dom matcher
});
```

## Recursos

- [jest-dom Documentation](https://github.com/testing-library/jest-dom)
- [All Matchers Reference](https://github.com/testing-library/jest-dom#custom-matchers)
- Ver [nota 01](./01-instalacion-configuracion.md) para configuración
