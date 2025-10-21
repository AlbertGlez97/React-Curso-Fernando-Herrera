# Vite y Herramientas de Desarrollo

## Vite

Vite es una herramienta de build moderna para desarrollo frontend, diseñada para ser extremadamente rápida.

### ¿Por qué Vite?

- **Inicio instantáneo del servidor**: Usa ESM nativo del navegador
- **HMR (Hot Module Replacement) ultrarrápido**: Los cambios se reflejan instantáneamente
- **Build optimizado**: Usa Rollup para producción
- **Soporte TypeScript nativo**: Sin configuración adicional
- **Optimización de dependencias**: Pre-bundling con esbuild

### Comandos de Vite

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Configuración: vite.config.ts

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  server: {
    port: 5174, // Puerto del servidor de desarrollo
  },
});
```

**Opciones comunes:**

- `plugins` - Plugins de Vite (React, Vue, etc.)
- `server.port` - Puerto del servidor de desarrollo
- `build.outDir` - Directorio de salida (default: 'dist')
- `test` - Configuración de Vitest

### Estructura de Archivos

```
proyecto/
├── public/              # Recursos estáticos (imágenes, fonts, etc.)
├── src/                 # Código fuente
│   ├── main.tsx        # Punto de entrada
│   ├── App.tsx         # Componente principal
│   └── ...
├── index.html          # HTML principal (en la raíz!)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Nota importante:** A diferencia de Create React App, el `index.html` está en la raíz del proyecto, no en `public/`.

### Variables de Entorno

Vite usa archivos `.env` para variables de entorno.

**Archivos de entorno:**
```
.env                # Todas las variables
.env.local          # Variables locales (no commitear)
.env.development    # Solo en desarrollo
.env.production     # Solo en producción
```

**Sintaxis:**
```
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

**Uso en código:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;

// Variables built-in
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE;
```

**⚠️ Importante:** Solo las variables que empiezan con `VITE_` son expuestas al código cliente.

## SWC (Speedy Web Compiler)

SWC es un compilador de JavaScript/TypeScript escrito en Rust, **mucho más rápido** que Babel.

### ¿Por qué SWC?

- **20-70x más rápido** que Babel
- Compilación y minificación ultra rápida
- Compatible con TypeScript y JSX
- Menor consumo de memoria

### Plugin: @vitejs/plugin-react-swc

Este plugin permite usar SWC en lugar de Babel para React.

**Instalación:**
```bash
npm install -D @vitejs/plugin-react-swc
```

**Configuración:**
```typescript
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
})
```

### Alternativa: @vitejs/plugin-react

Si necesitas plugins de Babel específicos, usa la versión estándar:

```typescript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## ESLint

Herramienta de linting para mantener código consistente y detectar errores.

### Instalación y Configuración

```bash
npm install -D eslint
```

### Comandos

```bash
# Ejecutar linter
npm run lint

# Arreglar problemas automáticamente
npm run lint -- --fix
```

### eslint.config.js (ESLint 9+)

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])
```

### Reglas Comunes

```javascript
rules: {
  // TypeScript
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-explicit-any': 'error',

  // React
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',

  // General
  'no-console': 'warn',
  'prefer-const': 'error',
}
```

## TypeScript

### Archivos de Configuración

#### tsconfig.json (Principal)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

#### tsconfig.app.json (Aplicación)

Configuración para el código de la aplicación (src/).

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

#### tsconfig.node.json (Node)

Configuración para archivos de configuración (vite.config.ts, etc.).

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

### Comandos de TypeScript

```bash
# Verificar tipos sin compilar
npx tsc --noEmit

# Compilar proyecto
npx tsc -b

# Watch mode
npx tsc -w
```

## NPM Scripts

### package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui --api.port=9999",
    "test:coverage": "vitest run --coverage --api.port=9999"
  }
}
```

### Explicación de Scripts

- **dev**: Inicia servidor de desarrollo
- **build**: Type-check + build de producción
- **lint**: Ejecuta ESLint en todo el proyecto
- **preview**: Previsualiza build de producción
- **test**: Ejecuta tests en modo watch
- **test:ui**: Interfaz visual para tests
- **test:coverage**: Reporte de cobertura de tests

### Pasar Argumentos a Scripts

```bash
# Ejecutar en modo headless
npm run test -- --run

# Especificar puerto
npm run dev -- --port 3000

# Arreglar problemas de lint
npm run lint -- --fix
```

## Git

### .gitignore

Archivos y carpetas que no deben ser commiteados:

```gitignore
# Dependencias
node_modules/

# Build
dist/
dist-ssr/

# Logs
*.log
npm-debug.log*

# Variables de entorno
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/

# Sistema
.DS_Store
Thumbs.db

# Testing
coverage/
```

### Comandos Básicos de Git

```bash
# Ver estado
git status

# Agregar archivos
git add .
git add src/Component.tsx

# Commit
git commit -m "Mensaje descriptivo"

# Push
git push

# Ver historial
git log --oneline

# Ver diferencias
git diff
```

## Carpeta Public

Los archivos en `public/` se sirven en la raíz sin procesamiento.

**Estructura recomendada:**
```
public/
├── favicon.ico
├── robots.txt
├── images/
│   ├── logo.png
│   └── banner.jpg
└── fonts/
    └── custom-font.woff2
```

**Acceso desde HTML:**
```html
<link rel="icon" href="/favicon.ico" />
<img src="/images/logo.png" alt="Logo" />
```

**Acceso desde CSS/JS:**
```typescript
// Directamente
const logo = "/images/logo.png";

// O usando import.meta.env
const publicUrl = import.meta.env.BASE_URL;
const logo = `${publicUrl}images/logo.png`;
```

## Hot Module Replacement (HMR)

Vite incluye HMR por defecto, permitiendo ver cambios instantáneamente sin recargar la página.

### Cómo Funciona

1. Modificas un archivo
2. Vite detecta el cambio
3. Solo actualiza ese módulo
4. El estado de la app se mantiene

### Deshabilitar HMR (si es necesario)

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: false, // Deshabilita HMR
  },
})
```

## Optimización de Build

### Configuración de Build

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true, // Generar sourcemaps
    minify: 'terser', // o 'esbuild'
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'],
        },
      },
    },
  },
})
```

### Análisis de Bundle

```bash
# Instalar plugin
npm install -D rollup-plugin-visualizer

# Agregar a vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
})
```

## Recursos Adicionales

- [Vite Docs](https://vite.dev/)
- [SWC Docs](https://swc.rs/)
- [ESLint Docs](https://eslint.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)
