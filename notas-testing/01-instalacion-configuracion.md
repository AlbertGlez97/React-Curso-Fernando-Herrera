# Instalación y Configuración de Testing

Esta guía cubre la configuración completa de Vitest y React Testing Library para testing en aplicaciones React + TypeScript + Vite.

## ¿Por qué Vitest?

**Vitest** es un framework de testing moderno diseñado específicamente para proyectos con Vite. Es la alternativa moderna a Jest.

### Ventajas de Vitest

✅ **Rápido**: Usa Vite como motor, aprovechando ESM nativo
✅ **Configuración mínima**: Compatible con Vite sin configuración extra
✅ **API compatible con Jest**: Migración fácil desde Jest
✅ **TypeScript nativo**: Soporte out-of-the-box
✅ **Watch mode inteligente**: Solo ejecuta tests afectados
✅ **UI moderna**: Interfaz gráfica para ver resultados

## Paso 1: Instalar Dependencias

### Opción 1: Instalación completa (un solo comando)

```bash
npm install --save-dev @testing-library/react @testing-library/dom vitest jsdom
```

### Opción 2: Instalación por partes

#### 1.1 Vitest y jsdom

```bash
npm install --save-dev vitest jsdom
```

- **vitest**: Framework de testing
- **jsdom**: Simula el DOM del navegador en Node.js

#### 1.2 React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/dom
```

- **@testing-library/react**: Utilidades para testear componentes React
- **@testing-library/dom**: Queries y utilidades para interactuar con el DOM

### Dependencias opcionales pero recomendadas

```bash
npm install --save-dev @vitest/ui @vitest/coverage-v8 @testing-library/jest-dom
```

- **@vitest/ui**: Interfaz gráfica para visualizar tests
- **@vitest/coverage-v8**: Generador de reportes de cobertura
- **@testing-library/jest-dom**: Matchers personalizados para testing (toHaveTextContent, toBeInTheDocument, etc.)

## Paso 2: Configurar Scripts en package.json

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```

### Explicación de los scripts

| Script | Descripción |
|--------|-------------|
| `npm run test` | Ejecuta tests en modo watch (se re-ejecutan al guardar) |
| `npm run test:ui` | Abre interfaz gráfica para ver tests |
| `npm run coverage` | Genera reporte de cobertura de código |

## Paso 3: Configurar vite.config.ts

Actualiza tu `vite.config.ts` para incluir configuración de Vitest:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Simula el navegador
    globals: true,        // Hace describe, test, expect globales
  },
});
```

### Opciones de configuración

#### `environment: "jsdom"`
- Simula un entorno de navegador en Node.js
- Permite acceder a `window`, `document`, etc.
- Necesario para testear componentes React

#### `globals: true`
- Hace que funciones de Vitest estén disponibles globalmente
- No necesitas importar `describe`, `test`, `expect` en cada archivo
- Similar al comportamiento de Jest

### Configuración avanzada (opcional)

```ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts", // Archivo de setup global
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
      ],
    },
  },
});
```

## Paso 4: Configurar jest-dom (Matchers Personalizados)

**@testing-library/jest-dom** proporciona matchers personalizados que hacen los tests más legibles.

### 4.1 Instalar jest-dom (si no lo hiciste antes)

```bash
npm install --save-dev @testing-library/jest-dom
```

### 4.2 Crear archivo de setup

Crea el archivo `src/test/setup.ts`:

```ts
// Importa los matchers personalizados de jest-dom
// Esto hace que matchers como toHaveTextContent, toBeInTheDocument, etc. estén disponibles
import "@testing-library/jest-dom/vitest";
```

### 4.3 Configurar vite.config.ts

Actualiza `vite.config.ts` para usar el archivo de setup:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts", // ← Agrega esta línea
  },
});
```

### 4.4 Configurar TypeScript

Agrega los tipos de jest-dom a `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client", "@testing-library/jest-dom"]
  }
}
```

### 4.5 Matchers Disponibles

Ahora puedes usar estos matchers en tus tests:

```tsx
// Texto y contenido
expect(element).toHaveTextContent("text");
expect(element).toContainHTML("<span>text</span>");

// Visibilidad
expect(element).toBeVisible();
expect(element).toBeInTheDocument();

// Formularios
expect(input).toHaveValue("value");
expect(input).toBeDisabled();
expect(input).toBeEnabled();
expect(checkbox).toBeChecked();

// Atributos y clases
expect(element).toHaveAttribute("href", "/home");
expect(element).toHaveClass("active");
expect(element).toHaveStyle({ color: "red" });
```

### Ejemplo con y sin jest-dom

**Sin jest-dom:**
```tsx
const heading = screen.getByRole("heading");
expect(heading.textContent).toBe("Hello");
expect(heading.style.display).toBe("block");
```

**Con jest-dom (más legible):**
```tsx
const heading = screen.getByRole("heading");
expect(heading).toHaveTextContent("Hello");
expect(heading).toBeVisible();
```

## Paso 5: Configurar TypeScript (opcional)

Si usas TypeScript y NO configuraste jest-dom, agrega tipos de Vitest a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Esto proporciona autocompletado para `describe`, `test`, `expect`, etc.

## Paso 6: Verificar Instalación

Crea un test simple para verificar que todo funciona:

```tsx
// src/App.test.tsx
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Test inicial", () => {
  test("debe funcionar", () => {
    expect(1 + 1).toBe(2);
  });

  test("debe tener matchers de jest-dom disponibles", () => {
    render(<h1>Hello World</h1>);
    const heading = screen.getByRole("heading");

    // Este matcher viene de jest-dom
    expect(heading).toHaveTextContent("Hello World");
  });
});
```

Ejecuta el test:

```bash
npm run test
```

Deberías ver:

```
✓ src/App.test.tsx (2)
  ✓ Test inicial (2)
    ✓ debe funcionar
    ✓ debe tener matchers de jest-dom disponibles

Test Files  1 passed (1)
Tests  2 passed (2)
```

## Estructura Recomendada de Archivos

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx          # Test junto al componente
├── hooks/
│   ├── useCounter.ts
│   └── useCounter.test.ts       # Test del hook
├── utils/
│   ├── formatDate.ts
│   └── formatDate.test.ts
└── test/
    └── setup.ts                 # ⭐ Setup con matchers de jest-dom
```

**Convención:** Los archivos de test usan la extensión `.test.tsx` o `.test.ts`

## Comandos Útiles

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo UI
npm run test:ui

# Ejecutar tests una sola vez (sin watch)
npm run test -- --run

# Ejecutar solo un archivo específico
npm run test Button.test.tsx

# Ejecutar tests con patrón
npm run test -- --grep="Button"

# Generar cobertura
npm run coverage
```

## Estructura de un Test Básico

```tsx
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  test("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeDefined();
  });
});
```

## Troubleshooting

### Error: "Cannot find module 'vitest'"

**Solución:** Asegúrate de haber instalado vitest como devDependency.

```bash
npm install --save-dev vitest
```

### Error: "document is not defined"

**Solución:** Verifica que `environment: "jsdom"` esté en `vite.config.ts`

### Error: "Property 'toHaveTextContent' does not exist"

**Causa:** Los matchers de jest-dom no están configurados.

**Solución:**

1. Instala jest-dom:
```bash
npm install --save-dev @testing-library/jest-dom
```

2. Crea `src/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

3. Actualiza `vite.config.ts`:
```ts
test: {
  setupFiles: "./src/test/setup.ts",
}
```

4. Actualiza `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "types": ["vite/client", "@testing-library/jest-dom"]
  }
}
```

### Los tests no se re-ejecutan al guardar

**Solución:** Asegúrate de ejecutar `npm run test` (sin `--run`)

### TypeScript no reconoce describe/test/expect

**Solución:** Agrega `"types": ["vitest/globals"]` a `tsconfig.json`

## Próximos Pasos

Una vez configurado, puedes:
1. Aprender sobre **React Testing Library** (nota 03)
2. Entender **screen vs container** (nota 04)
3. Ver **ejemplos del proyecto** (nota 05)

---

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
