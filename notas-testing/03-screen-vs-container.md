# Screen vs Container en React Testing Library

Esta es una de las decisiones más importantes al escribir tests de componentes React. Entender cuándo usar `screen` y cuándo usar `container` es fundamental para escribir tests mantenibles.

## ¿Qué es render()?

Cuando renderizas un componente para testing, `render()` retorna un objeto con utilidades:

```tsx
import { render } from "@testing-library/react";

const { container, debug, rerender } = render(<MyComponent />);
```

Las dos formas principales de buscar elementos son:
- **screen**: Objeto global con queries
- **container**: Referencia al DOM renderizado

## screen (Recomendado) ✅

`screen` es un objeto global que contiene todas las queries de Testing Library.

### Sintaxis

```tsx
import { render, screen } from "@testing-library/react";

render(<MyComponent />);

const element = screen.getByText("Hello");
```

### Ventajas de screen

✅ **Más legible**: No necesitas desestructurar
✅ **Scope correcto**: Siempre busca en todo el documento
✅ **Mejores mensajes de error**: Muestra el árbol DOM completo
✅ **Recomendado oficialmente**: Por React Testing Library
✅ **Queries accesibles**: Promueve mejores prácticas de accesibilidad

### Ejemplo con screen

```tsx
import { render, screen } from "@testing-library/react";
import { CustomHeader } from "./CustomHeader";

test("debe renderizar el título", () => {
  render(<CustomHeader title="Buscador de Gifs" />);

  // ✅ Uso de screen
  const heading = screen.getByRole("heading");
  expect(heading).toBeDefined();
});
```

## container ❌ (Evitar en general)

`container` es una referencia directa al contenedor DOM donde se renderizó el componente.

### Sintaxis

```tsx
import { render } from "@testing-library/react";

const { container } = render(<MyComponent />);
const element = container.querySelector("h1");
```

### ¿Cuándo usar container?

⚠️ **Casi nunca**. Solo en casos muy específicos:

1. **querySelector con selectores CSS complejos**
2. **Verificar que algo NO existe**
3. **Snapshots**
4. **Casos edge muy específicos**

### Problema con container

```tsx
// ❌ MAL - Usando container innecesariamente
const { container } = render(<MyComponent />);
const h1 = container.querySelector("h1");
expect(h1?.innerHTML).toContain("Hello");

// ✅ BIEN - Usando screen
render(<MyComponent />);
expect(screen.getByRole("heading")).toHaveTextContent("Hello");
```

**Por qué es malo:**
- Acoplado a la implementación (estructura DOM)
- No promueve accesibilidad
- Más difícil de mantener
- Mensajes de error pobres

## Comparación Directa

### Ejemplo del proyecto: CustomHeader.test.tsx

Veamos cómo se usan ambos en nuestro proyecto:

#### Test 1: Usando container (menos ideal)

```tsx
test("should render the title correctly", () => {
  const { container } = render(<CustomHeader title={title} />);
  const h1 = container.querySelector("h1");
  expect(h1?.innerHTML).toContain(title);
});
```

**Problemas:**
- ❌ Busca por selector CSS (`"h1"`)
- ❌ Acoplado a la estructura HTML
- ❌ Accede a `.innerHTML` directamente
- ❌ No verifica accesibilidad

#### Versión mejorada con screen

```tsx
test("should render the title correctly", () => {
  render(<CustomHeader title={title} />);

  // Buscar por rol (accesibilidad)
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent(title);
});
```

**Ventajas:**
- ✅ Busca por rol (accesibilidad)
- ✅ No depende de la estructura HTML
- ✅ Usa matcher semántico (`toHaveTextContent`)
- ✅ Más mantenible

#### Test 2: Usando screen (mejor práctica)

```tsx
test("should render the description when provided", () => {
  const description = "Descubre y comparte el Gif perfecto";
  render(<CustomHeader title={title} description={description} />);

  // ✅ Busca por texto
  expect(screen.getByText(description)).toBeDefined();

  // ✅ Busca por rol
  expect(screen.getByRole("paragraph")).toBeDefined();

  // ✅ Verifica contenido
  expect(screen.getByRole("paragraph").innerHTML).toBe(description);
});
```

**Ventajas:**
- ✅ Usa `screen` consistentemente
- ✅ Múltiples formas de verificar (texto + rol)
- ✅ Semántico y accesible

## Queries Disponibles con screen

### Tipos de Queries

React Testing Library ofrece diferentes tipos de queries:

| Tipo | Múltiples | Espera | Lanza Error |
|------|-----------|--------|-------------|
| **getBy** | ❌ | ❌ | ✅ |
| **queryBy** | ❌ | ❌ | ❌ |
| **findBy** | ❌ | ✅ | ✅ |
| **getAllBy** | ✅ | ❌ | ✅ |
| **queryAllBy** | ✅ | ❌ | ❌ |
| **findAllBy** | ✅ | ✅ | ✅ |

### getBy - Elemento debe existir

```tsx
// Lanza error si no encuentra
const button = screen.getByRole("button");
```

**Uso:** Cuando el elemento DEBE estar presente.

### queryBy - Verificar que NO existe

```tsx
// Retorna null si no encuentra
const paragraph = screen.queryByRole("paragraph");
expect(paragraph).toBeNull();
```

**Uso:** Cuando verificas que algo NO está renderizado.

### findBy - Elemento aparece asíncronamente

```tsx
// Espera hasta que aparezca (default 1000ms)
const message = await screen.findByText("Datos cargados");
```

**Uso:** Elementos que aparecen después de un fetch/timeout.

### getAllBy - Múltiples elementos

```tsx
// Retorna array de elementos
const listItems = screen.getAllByRole("listitem");
expect(listItems).toHaveLength(3);
```

**Uso:** Listas de elementos.

## Queries por Prioridad (Recomendadas)

### 1. Queries Accesibles (Preferidas)

#### getByRole - Roles ARIA/HTML

```tsx
screen.getByRole("button");
screen.getByRole("heading", { level: 1 });
screen.getByRole("textbox", { name: /email/i });
screen.getByRole("link", { name: "Home" });
```

**Roles comunes:**
- `button` - Botones
- `heading` - `<h1>` a `<h6>`
- `textbox` - `<input type="text">`
- `link` - `<a>`
- `list` / `listitem` - `<ul>/<li>`
- `paragraph` - `<p>` (no estándar, pero funciona)

#### getByLabelText - Labels de formularios

```tsx
screen.getByLabelText("Email");
```

```tsx
<label htmlFor="email">Email</label>
<input id="email" />
```

#### getByPlaceholderText - Placeholders

```tsx
screen.getByPlaceholderText("Escribe tu nombre");
```

#### getByText - Texto visible

```tsx
screen.getByText("Bienvenido");
screen.getByText(/hola mundo/i); // Regex case-insensitive
```

### 2. Queries Semánticas

#### getByAltText - Alt de imágenes

```tsx
screen.getByAltText("Logo de la empresa");
```

#### getByTitle - Atributo title

```tsx
screen.getByTitle("Cerrar ventana");
```

### 3. Queries de Último Recurso

#### getByTestId - Test IDs

```tsx
screen.getByTestId("custom-element");
```

```tsx
<div data-testid="custom-element">Content</div>
```

**⚠️ Solo úsalo como último recurso** si no hay forma accesible de seleccionar.

## Casos de Uso: ¿Cuándo usar qué?

### Caso 1: Verificar que elemento existe

```tsx
// ✅ BIEN - screen.getBy
render(<Button>Click me</Button>);
expect(screen.getByRole("button")).toBeDefined();
```

### Caso 2: Verificar que elemento NO existe

```tsx
// ✅ BIEN - screen.queryBy
render(<CustomHeader title="Title" />);
const paragraph = screen.queryByRole("paragraph");
expect(paragraph).toBeNull();
```

### Caso 3: Elemento que carga asíncronamente

```tsx
// ✅ BIEN - screen.findBy
render(<AsyncComponent />);
const message = await screen.findByText("Loaded!");
expect(message).toBeDefined();
```

### Caso 4: Selector CSS complejo necesario

```tsx
// ⚠️ ACEPTABLE - container.querySelector
const { container } = render(<Component />);
const element = container.querySelector(".complex > .nested .selector");
```

**Nota:** Intenta evitarlo refactorizando el componente o usando test IDs.

### Caso 5: Verificar estructura exacta (raro)

```tsx
// ⚠️ ACEPTABLE - container.querySelector
const { container } = render(<Header />);
const div = container.querySelector(".content-center");
const h1 = div?.querySelector("h1");
expect(h1).toBeDefined();
```

**Mejor alternativa:**

```tsx
// ✅ MEJOR
render(<Header />);
expect(screen.getByRole("heading")).toBeDefined();
```

## Refactorización: container → screen

### Antes (container)

```tsx
test("should not render description when not provided", () => {
  const { container } = render(<CustomHeader title={title} />);

  const divElement = container.querySelector(".content-center");
  const h1 = divElement?.querySelector("h1");
  expect(h1?.innerHTML).toBe(title);

  const p = divElement?.querySelector("p");
  expect(p).toBeNull();
});
```

### Después (screen)

```tsx
test("should not render description when not provided", () => {
  render(<CustomHeader title={title} />);

  // Verificar título existe
  expect(screen.getByRole("heading")).toHaveTextContent(title);

  // Verificar párrafo NO existe
  expect(screen.queryByRole("paragraph")).toBeNull();
});
```

**Mejoras:**
- ✅ Más corto y legible
- ✅ No depende de clases CSS
- ✅ Usa queries semánticas
- ✅ Más fácil de mantener

## Reglas de Oro

### ✅ Usar screen cuando...

1. Buscas por rol, texto, label
2. Verificas que algo existe
3. Interactúas con elementos (click, type)
4. Esperas elementos asíncronos

### ⚠️ Usar container cuando...

1. Necesitas querySelector con selectores CSS complejos
2. Verificas estructura DOM muy específica
3. No hay alternativa con queries de screen
4. Snapshots (aunque también puedes usar screen)

### ❌ NUNCA uses container para...

1. Buscar por rol, texto o label
2. Elementos accesibles con queries de screen
3. Como primera opción

## Resumen

| Aspecto | screen | container |
|---------|--------|-----------|
| **Legibilidad** | ✅ Alta | ❌ Baja |
| **Mantenibilidad** | ✅ Alta | ❌ Baja |
| **Accesibilidad** | ✅ Promueve | ❌ No promueve |
| **Acoplamiento** | ✅ Bajo | ❌ Alto |
| **Mensajes error** | ✅ Detallados | ❌ Vagos |
| **Recomendado** | ✅ Sí | ❌ No (salvo casos específicos) |

**Regla simple:** Usa `screen` por defecto. Solo usa `container` si realmente no hay otra opción.

---

## Próximos Pasos

1. Ver [ejemplos del proyecto](./05-ejemplos-proyecto.md) con análisis detallado
2. Leer [React Testing Library docs](https://testing-library.com/docs/queries/about)

## Recursos

- [Which Query Should I Use?](https://testing-library.com/docs/queries/about#priority)
- [Common Mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
