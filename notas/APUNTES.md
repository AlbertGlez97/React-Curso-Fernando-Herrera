# Apuntes del Curso - React con TypeScript

## Conceptos Fundamentales

### SWC (Speedy Web Compiler)
- Reemplaza la utilización de Babel
- Permite construir y compilar **mucho más rápido** (20-70x más rápido)
- Escrito en Rust para máximo rendimiento
- Compatible con TypeScript y JSX nativamente

### Carpeta Public
- Contiene los recursos estáticos como imágenes, fuentes, etc.
- Los archivos se sirven directamente en la raíz sin procesamiento
- Accesibles mediante rutas absolutas: `/images/logo.png`

## Mejores Prácticas de React

### Clase 39 - Variables Constantes Fuera de Componentes
**⚠️ MUY IMPORTANTE:** Es recomendable declarar variables constantes **fuera** de los componentes de React, para que no formen parte del ciclo de vida del componente.

**Por qué es importante:**
- Evita que las variables se recreen en cada render
- Mejora el rendimiento
- Reduce el consumo de memoria

**Ejemplo:**
```typescript
// ✅ Correcto - Fuera del componente
const myStyles: CSSProperties = {
  backgroundColor: "#fafafa",
  borderRadius: 10,
};

export function MyComponent() {
  return <div style={myStyles}>Contenido</div>;
}

// ❌ Incorrecto - Dentro del componente
export function MyComponent() {
  const myStyles: CSSProperties = {
    backgroundColor: "#fafafa",
    borderRadius: 10,
  };
  return <div style={myStyles}>Contenido</div>;
}
```

## Testing

### Herramientas de Testing
Se utiliza **Testing Library** para el testeo de componentes:

```bash
npm install --save-dev @testing-library/react @testing-library/dom
```

Además se usa **Vitest** como framework de testing:

```bash
npm install --save-dev vitest @vitest/ui jsdom
```

### Tipos de Tests

#### 1. Tests de Renderizado
Verifican que un componente se renderiza correctamente:
```typescript
test("should render firstName and lastName", () => {
  render(<MyAwesomeApp name="John" lastName="Doe" />);
  const h1 = screen.getByRole("heading", { level: 1 });
  expect(h1?.innerHTML).toContain("John");
});
```

#### 2. Snapshot Tests
Verifican que la estructura del componente no cambie accidentalmente:
```typescript
test("should match snapshot", () => {
  const { container } = render(<MyAwesomeApp name="John" lastName="Doe" />);
  expect(container).toMatchSnapshot();
});
```

#### 3. Tests de Interacción
Simulan interacciones del usuario:
```typescript
test("should increase count when +1 button is pressed", () => {
  render(<ItemCounter productName="Test" quantity={5} />);
  const [buttonAdd] = screen.getAllByRole("button", { name: "+1" });
  fireEvent.click(buttonAdd);
  expect(screen.getByText("6")).toBeDefined();
});
```

### Diferencia: container vs screen

**container:**
- Snapshot estático del momento del render
- Útil para evaluar estado inicial sin manipulación de eventos
- No se actualiza automáticamente

**screen:**
- Se actualiza cuando ocurren eventos
- Ideal para tests con interacciones del usuario
- Proporciona queries más semánticas
- Tiene método `debug()` para debugging

### Mocking de Componentes

**⚠️ Importante:** `vi.mock()` es hoisted (se mueve al inicio del archivo), por lo que debes definir los mocks **dentro** de la factory function:

```typescript
// ✅ Correcto
vi.mock("./shopping-cart/ItemCounter", () => ({
  default: vi.fn((props: any) => {
    return <div data-testid="ItemCounter" {...props} />;
  }),
}));

// ❌ Incorrecto (error de hoisting)
const mockFn = vi.fn();
vi.mock("./shopping-cart/ItemCounter", () => ({
  default: mockFn,
}));
```

### Limpieza de Mocks

Siempre limpia los mocks después de cada test:

```typescript
describe("Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Tests...
});
```

## Estilos en React

### CSS Modules
Permiten estilos con scope local, evitando conflictos de nombres:

```typescript
import styles from "./ItemCounter.module.css";

const ItemCounter = () => {
  return (
    <section className={styles["item-row"]}>
      <span className={styles["item-text"]}>Producto</span>
    </section>
  );
};
```

### Estilos Inline con TypeScript
Usa el tipo `CSSProperties` para estilos inline:

```typescript
import type { CSSProperties } from "react";

const myStyles: CSSProperties = {
  backgroundColor: "#fafafa",
  borderRadius: 10,
  padding: 10,
};
```

## Componentes y Props

### Interfaces para Props
Define la estructura de las props con TypeScript:

```typescript
interface Product {
  productName: string;
  quantity?: number; // Opcional con ?
}

const ItemCounter = ({ productName, quantity = 1 }: Product) => {
  // quantity tiene valor por defecto de 1
};
```

### Exportación de Componentes

**Default Export** (para componente principal):
```typescript
export default ItemCounter;
// Importar: import ItemCounter from "./ItemCounter";
```

**Named Export** (para múltiples exports):
```typescript
export function FirstStepsApp() { }
// Importar: import { FirstStepsApp } from "./FirstStepsApp";
```

## Estado con useState

### Inicialización con Props
Puedes inicializar el estado usando valores de props:

```typescript
const ItemCounter = ({ quantity = 1 }: Product) => {
  const [count, setCount] = useState(quantity);
  // El estado inicial es el valor de quantity
};
```

### Validaciones en Actualizaciones
Valida antes de actualizar el estado:

```typescript
const handleAdd = () => {
  if (count >= 10) return; // Previene valores > 10
  setCount(count + 1);
};

const handleSubtract = () => {
  if (count === 1) return; // Previene valores < 1
  setCount(count - 1);
};
```

## Renderizado de Listas

### Array.map() con key
Usa `map()` para renderizar listas, siempre con prop `key`:

```typescript
const items = [
  { id: 1, name: "Xbox", quantity: 1 },
  { id: 2, name: "PlayStation", quantity: 2 },
];

return (
  <>
    {items.map((item) => (
      <ItemCounter
        key={item.id} // OBLIGATORIO y único
        productName={item.name}
        quantity={item.quantity}
      />
    ))}
  </>
);
```

## Configuración del Proyecto

### Vite
- Puerto por defecto: 5174 (configurado en `vite.config.ts`)
- HMR (Hot Module Replacement) habilitado por defecto
- Build optimizado con Rollup

### Testing
- **Vitest** con entorno jsdom
- API port personalizado (9999) para evitar conflictos en Windows
- UI de tests disponible con `npm run test:ui`

### Estructura de Carpetas
```
src/
├── helpers/           # Funciones auxiliares
├── shopping-cart/     # Componentes por feature
│   ├── ItemCounter.tsx
│   ├── ItemCounter.test.tsx
│   └── ItemCounter.module.css
├── FirstStepsApp.tsx
└── main.tsx
```

## Comandos Importantes

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Testing
npm run test             # Tests en modo watch
npm run test:ui          # UI de tests (puerto 9999)
npm run test:coverage    # Reporte de cobertura

# Calidad de código
npm run lint             # Ejecutar ESLint
npm run build            # Build para producción
```

## Recursos Adicionales

Ver las guías modulares en la carpeta `notas/`:
- **[testing.md](./testing.md)** - Guía completa de testing
- **[react-conceptos.md](./react-conceptos.md)** - Conceptos de React
- **[typescript.md](./typescript.md)** - TypeScript en React
- **[vite-tooling.md](./vite-tooling.md)** - Vite y herramientas

## Notas de Clases Específicas

### Clase 39
Variables constantes fuera del componente para optimizar rendimiento.

---

**Última actualización:** Enero 2025
