# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React learning project (React course by Fernando Herrera) using TypeScript, Vite, and SWC for fast compilation. The project demonstrates React fundamentals including component structure, state management, and testing.

## Development Commands

### Running the application
- `npm run dev` - Start development server on port 5174
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build

### Testing
- `npm run test` - Run tests in watch mode (Vitest)
- `npm run test:ui -- --api.port=9999` - Run tests with Vitest UI (uses custom API port 9999 to avoid permission issues on Windows)
- `npm run test:coverage -- --api.port=9999` - Run tests with coverage report

**Important testing notes:**
- The project uses Vitest with jsdom environment for component testing
- Testing Library (@testing-library/react, @testing-library/dom) is used for component tests
- Snapshot tests are used for visual regression testing
- When mocking modules with `vi.mock()`, remember that it's hoisted - define mocks directly in the factory function, not as external variables

### Code Quality
- `npm run lint` - Run ESLint

## Architecture & Patterns

### Component Structure
- Components use TypeScript interfaces for props
- Default export is used for main components (e.g., `ItemCounter`)
- Named exports are used for app-level components (e.g., `FirstStepsApp`)

### Styling Approach
- CSS Modules are used (`.module.css` files) for scoped component styles
- Import styles as: `import styles from "./Component.module.css"`
- Access classes with bracket notation: `className={styles["class-name"]}`

### State Management
- useState hook for local component state
- State initialization can use props (e.g., `useState(quantity)`)

### Best Practices (from APUNTES.md)
- Declare constant variables outside of React components to avoid them being part of the component lifecycle
- This prevents unnecessary re-creation on each render

### Testing Patterns
- Use `vi.mock()` for mocking modules, but define mocks inside the factory function due to hoisting
- Example:
  ```typescript
  vi.mock("./path/to/module", () => ({
    default: vi.fn((props: any) => <div data-testid="mock" />),
  }));
  ```
- Use `fireEvent` from Testing Library for user interactions
- Use `screen.getByRole()`, `screen.getByText()`, etc. for querying elements
- Add `afterEach(() => vi.clearAllMocks())` when testing with mocks

## File Organization

```
src/
├── helpers/           # Utility functions (e.g., math.helper.ts)
├── shopping-cart/     # Feature-specific components
│   ├── ItemCounter.tsx
│   ├── ItemCounter.test.tsx
│   └── ItemCounter.module.css
├── FirstStepsApp.tsx  # Main app component
└── main.tsx          # Entry point
```

## Technology Stack

- **Build Tool**: Vite 7.x with SWC (Speedy Web Compiler) instead of Babel for faster builds
- **Framework**: React 19.x
- **Language**: TypeScript 5.8.x
- **Testing**: Vitest 3.x with jsdom and @testing-library/react
- **Linting**: ESLint 9.x with typescript-eslint
