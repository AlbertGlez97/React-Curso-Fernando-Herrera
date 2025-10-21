# React + TypeScript + Vite - Curso Fernando Herrera

Este proyecto es parte del curso de React con TypeScript, configurado con Vite y SWC para máximo rendimiento.

## 📚 Documentación del Proyecto

### Guías de Aprendizaje

Toda la documentación está organizada en la carpeta [`notas/`](./notas/):

- 📝 **[APUNTES.md](./notas/APUNTES.md)** - Resumen ejecutivo y conceptos clave del curso
- ⚛️ **[React Conceptos](./notas/react-conceptos.md)** - Guía completa de conceptos de React
  - Componentes y Props
  - Estado con useState
  - Renderizado de listas
  - Estilos (CSS Modules, inline, dinámicos)
  - Manejo de eventos
  - Mejores prácticas

- 🧪 **[Testing](./notas/testing.md)** - Manual completo de testing
  - Vitest + Testing Library
  - Tipos de tests (renderizado, snapshots, interacción, mocks)
  - Diferencias entre container y screen
  - Mejores prácticas de testing

- 📘 **[TypeScript](./notas/typescript.md)** - TypeScript en React
  - Tipos básicos y avanzados
  - Interfaces y tipos para props
  - Tipos para eventos y hooks
  - Utility types
  - Mejores prácticas

- ⚡ **[Vite y Tooling](./notas/vite-tooling.md)** - Herramientas de desarrollo
  - Configuración de Vite
  - SWC (Speedy Web Compiler)
  - ESLint
  - TypeScript config
  - Optimización de build

### Documentación Técnica

- 🤖 **[CLAUDE.md](./CLAUDE.md)** - Guía para Claude Code con la arquitectura del proyecto

## 🚀 Comandos Disponibles

### Desarrollo
```bash
npm run dev              # Iniciar servidor de desarrollo (puerto 5174)
npm run build            # Compilar para producción
npm run preview          # Previsualizar build de producción
```

### Testing
```bash
npm run test             # Ejecutar tests en modo watch
npm run test:ui          # Interfaz visual de tests (puerto 9999)
npm run test:coverage    # Reporte de cobertura de código
```

### Calidad de Código
```bash
npm run lint             # Ejecutar ESLint
npm run lint -- --fix    # Arreglar problemas automáticamente
```

## 🛠️ Stack Tecnológico

- **React 19.x** - Biblioteca de UI
- **TypeScript 5.8.x** - Tipado estático
- **Vite 7.x** - Build tool ultrarrápido
- **SWC** - Compilador 20-70x más rápido que Babel
- **Vitest 3.x** - Framework de testing moderno
- **Testing Library** - Testing centrado en el usuario
- **ESLint 9.x** - Linter de código

## 📁 Estructura del Proyecto

```
proyecto/
├── notas/                      # 📚 Documentación y guías
│   ├── APUNTES.md             # Resumen del curso
│   ├── react-conceptos.md     # Conceptos de React
│   ├── testing.md             # Guía de testing
│   ├── typescript.md          # TypeScript en React
│   └── vite-tooling.md        # Herramientas de desarrollo
├── src/
│   ├── helpers/               # Funciones auxiliares
│   ├── shopping-cart/         # Componentes por feature
│   │   ├── ItemCounter.tsx
│   │   ├── ItemCounter.test.tsx
│   │   └── ItemCounter.module.css
│   ├── FirstStepsApp.tsx
│   └── main.tsx
├── public/                    # Recursos estáticos
├── CLAUDE.md                  # Guía para Claude Code
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Conceptos Clave del Curso

### Variables Constantes Fuera de Componentes
**⚠️ Importante:** Declara constantes fuera de los componentes para evitar recrearlas en cada render:

```typescript
// ✅ Correcto
const myStyles: CSSProperties = {
  backgroundColor: "#fafafa",
};

export function MyComponent() {
  return <div style={myStyles}>Contenido</div>;
}
```

### CSS Modules
Estilos con scope local para evitar conflictos:

```typescript
import styles from "./Component.module.css";

const Component = () => (
  <div className={styles["my-class"]}>Contenido</div>
);
```

### Testing con Mocks
`vi.mock()` es hoisted, define mocks dentro de la factory function:

```typescript
vi.mock("./Component", () => ({
  default: vi.fn((props: any) => <div {...props} />),
}));
```

## 📖 Recursos Adicionales

### Configuración de Vite

Este proyecto usa **@vitejs/plugin-react-swc** para compilación ultra rápida:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

### Configuración de ESLint

El proyecto usa ESLint 9 con configuración plana (`eslint.config.js`).

Para habilitar reglas estrictas de TypeScript, puedes actualizar la configuración siguiendo la guía en [`notas/vite-tooling.md`](./notas/vite-tooling.md#eslint).

## 🔗 Enlaces Útiles

- [React Docs (Oficial)](https://react.dev/)
- [Vite Docs](https://vite.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🎓 Sobre el Curso

Este proyecto es parte del curso de React impartido por **Fernando Herrera**, enfocado en:

- Fundamentos de React con TypeScript
- Componentes funcionales y hooks
- Testing de componentes
- Mejores prácticas de desarrollo
- Herramientas modernas (Vite, SWC, Vitest)

---

**Última actualización:** Enero 2025
