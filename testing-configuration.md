# Instalar dependencias Testing

1. [Vitest](https://vitest.dev/guide/)

```bash
npm install --save-dev vitest jsdom
```

2. React [Testing Library](https://testing-library.com/docs/react-testing-library/intro)

```bash
npm install --save-dev @testing-library/react @testing-library/dom
```

- Todo en un sólo comando

```bash
npm install --save-dev @testing-library/react @testing-library/dom vitest jsdom
```

3. Crear estos scripts en el `package.json`

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest run --coverage"
}
```

4. Configurar `vite.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```
