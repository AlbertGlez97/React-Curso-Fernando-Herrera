# Ejemplos de Testing en el Proyecto

Esta nota analiza los tests existentes en el proyecto, explicando cada decisión y mostrando mejoras potenciales.

## Archivos de Test en el Proyecto

```
src/
├── GifsApp.test.tsx               # Test del componente principal
└── shared/
    └── components/
        └── CustomHeader.test.tsx  # Test del componente CustomHeader
```

## Test 1: GifsApp.test.tsx

### Código Actual

```tsx
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { GifsApp } from "./GifsApp";

describe("GifsApp", () => {
  test("should render component properly", () => {
    const { container } = render(<GifsApp />);

    expect(container).toMatchSnapshot();
  });
});
```

### Análisis

**¿Qué hace este test?**
- Renderiza el componente `GifsApp`
- Crea un snapshot del HTML generado
- Compara futuras ejecuciones con este snapshot

**Concepto: Snapshot Testing**

Los snapshots guardan una "foto" del HTML renderizado:

```html
<!-- __snapshots__/GifsApp.test.tsx.snap -->
<div>
  <div class="content-center">
    <h1>Buscador de Gifs</h1>
    <p>Descubre y comparte el Gif perfecto</p>
  </div>
  <div class="search-container">
    ...
  </div>
</div>
```

Si el HTML cambia, el test falla y debes revisar si el cambio es intencional.

**Ventajas:**
- ✅ Detecta cambios no intencionales en la UI
- ✅ Rápido de escribir

**Desventajas:**
- ❌ Tests frágiles (cualquier cambio rompe el snapshot)
- ❌ No verifica funcionalidad real
- ❌ Dificulta refactoring

### Mejora Sugerida

```tsx
describe("GifsApp", () => {
  test("should render main components", () => {
    render(<GifsApp />);

    // Verificar que los componentes principales existen
    expect(screen.getByRole("heading", { name: /buscador de gifs/i })).toBeDefined();
    expect(screen.getByPlaceholderText(/buscar gifs/i)).toBeDefined();
  });

  test("should render empty gif list initially", () => {
    render(<GifsApp />);

    // Verificar que no hay GIFs al inicio
    const gifsList = screen.queryByRole("list");
    expect(gifsList).toBeNull();
  });
});
```

**Por qué es mejor:**
- ✅ Verifica funcionalidad específica
- ✅ Más mantenible
- ✅ Tests más descriptivos
- ✅ No se rompe con cambios de CSS

## Test 2: CustomHeader.test.tsx

Analicemos cada test del componente CustomHeader.

### Componente CustomHeader

```tsx
interface CustomHeaderProps {
  title: string;
  description?: string; // Opcional
}

export const CustomHeader: FC<CustomHeaderProps> = ({ title, description }) => {
  return (
    <div className="content-center">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};
```

### Test 2.1: Renderizar el título

```tsx
test("should render the title correctly", () => {
  const { container } = render(<CustomHeader title={title} />);
  const h1 = container.querySelector("h1");
  expect(h1?.innerHTML).toContain(title);
});
```

**Análisis:**
- ✅ Verifica que el título se renderiza
- ❌ Usa `container.querySelector` (no ideal)
- ❌ Verifica `.innerHTML` directamente
- ❌ Acoplado a la estructura HTML

**Problemas:**
1. Si cambias `<h1>` por `<h2>`, el test se rompe
2. No verifica accesibilidad
3. Selector CSS puede fallar si cambias la estructura

**Mejora:**

```tsx
test("should render the title correctly", () => {
  const title = "Buscador de Gifs";
  render(<CustomHeader title={title} />);

  // Buscar por rol de heading
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent(title);
});
```

**Ventajas:**
- ✅ Usa `screen` (recomendado)
- ✅ Busca por rol (accesibilidad)
- ✅ Más mantenible
- ✅ Matcher semántico `toHaveTextContent`

### Test 2.2: Renderizar descripción cuando se provee

```tsx
test("should rendern the description when provided", () => {
  const description = "Descubre y comparte el Gif perfecto";
  render(<CustomHeader title={title} description={description} />);

  expect(screen.getByText(description)).toBeDefined();
  expect(screen.getByRole("paragraph")).toBeDefined();
  expect(screen.getByRole("paragraph").innerHTML).toBe(description);
});
```

**Análisis:**
- ✅ Usa `screen` (bien!)
- ✅ Verifica por texto y por rol
- ⚠️ Verifica 3 veces lo mismo (redundante)
- ⚠️ Accede a `.innerHTML` directamente

**Nota:** `paragraph` no es un rol ARIA estándar, pero funciona en algunos casos.

**Mejora:**

```tsx
test("should render the description when provided", () => {
  const title = "Buscador de Gifs";
  const description = "Descubre y comparte el Gif perfecto";

  render(<CustomHeader title={title} description={description} />);

  // Una sola verificación es suficiente
  expect(screen.getByText(description)).toBeDefined();
});
```

**O más robusto:**

```tsx
test("should render the description when provided", () => {
  const title = "Buscador de Gifs";
  const description = "Descubre y comparte el Gif perfecto";

  render(<CustomHeader title={title} description={description} />);

  // Verificar que el texto está visible
  const paragraph = screen.getByText(description);
  expect(paragraph).toBeInTheDocument();
  expect(paragraph.tagName).toBe("P"); // Verificar que es un <p>
});
```

### Test 2.3: NO renderizar descripción cuando no se provee

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

**Análisis:**
- ✅ Verifica renderizado condicional
- ❌ Usa `container` y `querySelector` excesivamente
- ❌ Acoplado a la estructura HTML y clases CSS
- ❌ Muy verboso

**Mejora:**

```tsx
test("should not render description when not provided", () => {
  const title = "Buscador de Gifs";
  render(<CustomHeader title={title} />);

  // Verificar que el título existe
  expect(screen.getByRole("heading")).toHaveTextContent(title);

  // Verificar que NO hay párrafo
  const paragraph = screen.queryByText(/descubre/i);
  expect(paragraph).toBeNull();
});
```

**Aún mejor (si sabes qué buscar):**

```tsx
test("should not render description when not provided", () => {
  const title = "Buscador de Gifs";
  render(<CustomHeader title={title} />);

  // Solo verificar que no hay descripción
  expect(screen.queryByRole("paragraph")).toBeNull();
});
```

**Ventajas:**
- ✅ Más corto (3 líneas vs 10)
- ✅ No depende de CSS
- ✅ Usa `screen.queryBy` (correcto para verificar ausencia)
- ✅ Mucho más mantenible

## Suite Completa Refactorizada

### CustomHeader.test.tsx (Versión Mejorada)

```tsx
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomHeader } from "./CustomHeader";

describe("CustomHeader", () => {
  test("should render the title", () => {
    const title = "Buscador de Gifs";
    render(<CustomHeader title={title} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(title);
  });

  test("should render description when provided", () => {
    const title = "Buscador de Gifs";
    const description = "Descubre y comparte el Gif perfecto";

    render(<CustomHeader title={title} description={description} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  test("should not render description when not provided", () => {
    const title = "Buscador de Gifs";
    render(<CustomHeader title={title} />);

    expect(screen.getByRole("heading")).toHaveTextContent(title);
    expect(screen.queryByText(/descubre/i)).toBeNull();
  });
});
```

### GifsApp.test.tsx (Versión Mejorada)

```tsx
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { GifsApp } from "./GifsApp";

describe("GifsApp", () => {
  test("should render header with title and description", () => {
    render(<GifsApp />);

    expect(screen.getByRole("heading", { name: /buscador de gifs/i })).toBeDefined();
    expect(screen.getByText(/descubre y comparte/i)).toBeDefined();
  });

  test("should render search bar", () => {
    render(<GifsApp />);

    const searchInput = screen.getByPlaceholderText(/buscar gifs/i);
    expect(searchInput).toBeDefined();
  });

  test("should render empty state initially", () => {
    render(<GifsApp />);

    // Verificar que no hay GIFs al inicio
    const gifs = screen.queryAllByRole("img");
    expect(gifs).toHaveLength(0);
  });
});
```

## Comparación: Antes vs Después

### Antes (Original)

```tsx
// ❌ Acoplado a implementación
test("should render the title correctly", () => {
  const { container } = render(<CustomHeader title={title} />);
  const h1 = container.querySelector("h1");
  expect(h1?.innerHTML).toContain(title);
});
```

**Problemas:**
- Usa `querySelector`
- Depende de la estructura HTML
- Accede a `.innerHTML`
- Difícil de leer

### Después (Mejorado)

```tsx
// ✅ Enfocado en comportamiento
test("should render the title", () => {
  render(<CustomHeader title="Buscador de Gifs" />);

  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent("Buscador de Gifs");
});
```

**Ventajas:**
- Usa `screen`
- Busca por rol (accesibilidad)
- Matcher semántico
- Fácil de leer y mantener

## Patrones Identificados en el Proyecto

### Patrón 1: Usar container para querySelector

```tsx
// Encontrado en el código
const { container } = render(<Component />);
const element = container.querySelector(".class");
```

**Cuándo es aceptable:**
- Selector CSS muy específico sin alternativa
- Verificar estructura DOM exacta (raro)

**Alternativa preferida:**
```tsx
render(<Component />);
const element = screen.getByRole("role");
```

### Patrón 2: Verificar con innerHTML

```tsx
// Encontrado en el código
expect(element?.innerHTML).toBe(value);
```

**Alternativa preferida:**
```tsx
expect(element).toHaveTextContent(value);
```

### Patrón 3: Snapshots para todo

```tsx
// Encontrado en el código
expect(container).toMatchSnapshot();
```

**Cuándo usar snapshots:**
- Componentes visuales complejos
- Como complemento, no como único test
- Cuando estructura HTML es crítica

**Alternativa preferida:**
- Tests de comportamiento específico
- Verificar funcionalidad real

## Lecciones del Proyecto

### 1. Preferir screen sobre container

**❌ Evitar:**
```tsx
const { container } = render(<Component />);
const element = container.querySelector("selector");
```

**✅ Preferir:**
```tsx
render(<Component />);
const element = screen.getByRole("role");
```

### 2. Verificar comportamiento, no implementación

**❌ Evitar:**
```tsx
const div = container.querySelector(".class");
const h1 = div?.querySelector("h1");
expect(h1).toBeDefined();
```

**✅ Preferir:**
```tsx
expect(screen.getByRole("heading")).toBeInTheDocument();
```

### 3. Usar matchers semánticos

**❌ Evitar:**
```tsx
expect(element?.innerHTML).toBe("text");
```

**✅ Preferir:**
```tsx
expect(element).toHaveTextContent("text");
```

### 4. Snapshots con moderación

**❌ Evitar:**
```tsx
// Único test
expect(container).toMatchSnapshot();
```

**✅ Preferir:**
```tsx
// Tests específicos de funcionalidad
test("should render title", () => { ... });
test("should handle click", () => { ... });

// Snapshot como complemento (opcional)
test("should match snapshot", () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot();
});
```

## Próximos Tests Sugeridos

### Para CustomHeader

```tsx
test("should render with different titles", () => {
  const { rerender } = render(<CustomHeader title="Title 1" />);
  expect(screen.getByText("Title 1")).toBeDefined();

  rerender(<CustomHeader title="Title 2" />);
  expect(screen.getByText("Title 2")).toBeDefined();
});
```

### Para GifsApp

```tsx
test("should perform search on user input", async () => {
  render(<GifsApp />);

  const input = screen.getByPlaceholderText(/buscar gifs/i);
  const user = userEvent.setup();

  await user.type(input, "cats");

  // Esperar a que aparezcan los GIFs
  const gifs = await screen.findAllByRole("img");
  expect(gifs.length).toBeGreaterThan(0);
});
```

## Resumen

**Mejoras principales:**
1. ✅ Usar `screen` en lugar de `container`
2. ✅ Queries por rol/texto en lugar de selectores CSS
3. ✅ Matchers semánticos (`toHaveTextContent`)
4. ✅ Tests de comportamiento, no implementación
5. ✅ Menos verboso y más mantenible

---

## Recursos

- Ver [screen vs container](./03-screen-vs-container.md) para más detalles
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
