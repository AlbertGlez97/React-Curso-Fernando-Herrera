# Glosario de Términos de React

Esta es una referencia rápida de los términos más importantes que debes conocer como desarrollador de React.

## Fundamentos

### React
Es una **biblioteca de JavaScript** para crear interfaces de usuario (UI). No es un framework completo, sino una biblioteca enfocada en la capa de vista.

**Características clave:**
- Basado en componentes
- Declarativo
- Virtual DOM
- Flujo de datos unidireccional

### JSX
Es un **lenguaje de marcado** que permite escribir una sintaxis similar a HTML dentro de JavaScript. JSX se transforma en JavaScript puro durante la compilación.

```tsx
// JSX
const element = <h1>Hola Mundo</h1>;

// Se transforma en JavaScript
const element = React.createElement('h1', null, 'Hola Mundo');
```

## Componentes y Estructura

### Componentes
Son **piezas de código reutilizables** que se encargan de una parte específica de la interfaz de usuario. Pueden ser funciones (componentes funcionales) o clases (componentes de clase, legacy).

```tsx
// Componente funcional
export const MiComponente = () => {
  return <h1>Hola</h1>;
};
```

**Tipos:**
- **Componentes funcionales**: Funciones que retornan JSX (moderno)
- **Componentes de clase**: Clases que extienden React.Component (legacy)

### Props
Son **datos que se pasan** a un componente para que pueda usarlos. Las props **deben ser inmutables** (no se pueden modificar dentro del componente hijo) y permiten la personalización.

```tsx
interface Props {
  name: string;
}

const Greeting = ({ name }: Props) => {
  return <h1>Hola, {name}!</h1>;
};

// Uso
<Greeting name="Fernando" />
```

**Flujo:** Padre → Props → Hijo (unidireccional)

### Children
Es una **prop especial** que representa los elementos anidados dentro de un componente.

```tsx
const Box = ({ children }: { children: React.ReactNode }) => {
  return <div className="box">{children}</div>;
};

// Uso
<Box>
  <h1>Contenido aquí</h1>
</Box>
```

### Fragment
Permite **agrupar múltiples elementos** sin añadir un nodo extra al DOM. Sintaxis: `<>...</>` o `<Fragment>...</Fragment>`.

```tsx
return (
  <>
    <h1>Título</h1>
    <p>Párrafo</p>
  </>
);
```

**Ventaja:** No contamina el DOM con divs innecesarios.

## Estado y Ciclo de Vida

### Estado (State)
Es un **objeto que contiene datos** que pueden cambiar con el tiempo en un componente. Cuando el estado cambia, React re-renderiza el componente.

```tsx
const [count, setCount] = useState(0);
```

**Características:**
- Local al componente
- Causa re-renders al cambiar
- Debe ser inmutable
- Se actualiza con funciones setter

### Renderizado (Render)
Es el **proceso de convertir** el código JSX/React en HTML y mostrarlo en el navegador.

**Flujo:**
1. React ejecuta la función del componente
2. Genera el Virtual DOM
3. Compara con el DOM real
4. Actualiza solo lo que cambió

### Re-render
Cuando React **vuelve a dibujar** un componente porque cambió su estado o props.

**Causas comunes:**
- `setState` fue llamado
- Las props del componente cambiaron
- Un contexto que usa el componente cambió
- El padre se re-renderizó

### Inmutabilidad
Es el **principio de que los datos no se pueden cambiar**, sino que se deben crear nuevos datos basados en los anteriores.

```tsx
// ❌ MAL - Mutación directa
state.push('nuevo');

// ✅ BIEN - Inmutabilidad
setState([...state, 'nuevo']);
```

**Por qué es importante:**
- React detecta cambios comparando referencias
- Permite optimizaciones de rendimiento
- Hace el código más predecible

## Hooks

### Hooks
Son **funciones especiales** que permiten a los componentes funcionales usar estado, efectos y otras características de React.

**Reglas de los Hooks:**
1. Solo llamarlos en el nivel superior (no en loops, condicionales)
2. Solo desde componentes funcionales o custom hooks
3. Los nombres deben comenzar con "use"

**Hooks básicos:**
- `useState` - Estado local
- `useEffect` - Efectos secundarios
- `useContext` - Acceso a contexto

### Custom Hook
Función que **encapsula lógica con hooks** y puede reutilizarse entre componentes. Siempre debe comenzar con "use".

```tsx
const useMessage = () => {
  const [message, setMessage] = useState('');
  return { message, setMessage };
};
```

**Beneficio:** Separar lógica de presentación.

## Renderizado y Control de Flujo

### Renderizado Condicional
Técnica para **mostrar u ocultar elementos** basándose en condiciones.

```tsx
// Con ternario
{isLoggedIn ? <Dashboard /> : <Login />}

// Con AND (&&)
{isLoggedIn && <Dashboard />}

// Early return
if (!isLoggedIn) return <Login />;
return <Dashboard />;
```

### Keys
**Identificadores únicos** usados en listas para ayudar a React a detectar qué elementos cambiaron, se agregaron o se eliminaron.

```tsx
{users.map((user) => (
  <li key={user.id}>{user.name}</li>
))}
```

**Reglas:**
- Deben ser únicas entre hermanos
- Estables (no usar índices si la lista cambia)
- Preferir IDs reales

## Eventos y Formularios

### Event Handler
**Función que se ejecuta** al ocurrir un evento como `onClick`, `onChange`, `onSubmit`, etc.

```tsx
const handleClick = (event: React.MouseEvent) => {
  console.log('Click!');
};

<button onClick={handleClick}>Haz click</button>
```

**Nota:** En React, los eventos usan camelCase: `onClick`, `onChange`, `onKeyDown`.

### Controlled Component
**Elemento de formulario** cuyo valor es manejado por el estado de React. El estado es la "fuente de verdad".

```tsx
const [value, setValue] = useState('');

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Flujo:** Input → onChange → setState → value (ciclo completo)

### Uncontrolled Component
**Elemento de formulario** que maneja su propio valor internamente, accedido mediante refs.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<input ref={inputRef} />

// Acceder al valor
const value = inputRef.current?.value;
```

**Cuándo usar:** Formularios simples o integración con librerías de terceros.

## Arquitectura y Conceptos Avanzados

### Context (Contexto)
Es un **objeto que contiene datos** que pueden ser compartidos entre múltiples componentes sin pasar props manualmente en cada nivel.

```tsx
const UserContext = createContext(null);

// Proveedor
<UserContext.Provider value={user}>
  <App />
</UserContext.Provider>

// Consumidor
const user = useContext(UserContext);
```

**Uso común:** Temas, autenticación, idioma.

### Context API
Tradicionalmente el **nombre que se da al gestor de estado** propio de React (`createContext`, `useContext`).

**Ventaja:** Evita Prop Drilling.

### Gestor de Estado (State Manager)
Es una **herramienta o patrón** que te ayuda a controlar y organizar los datos globales de la aplicación.

**Ejemplos:**
- Context API (built-in)
- Redux
- Zustand
- MobX

### Prop Drilling
Significa **pasar props** de un componente a otro, a través de muchos niveles intermedios que no usan esas props.

```tsx
// Prop drilling
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Profile user={user} /> {/* Finalmente se usa aquí */}
    </Sidebar>
  </Layout>
</App>
```

**Solución:** Context API o gestores de estado.

### Virtual DOM
**Representación en memoria** del DOM real. React lo usa para hacer actualizaciones eficientes.

**Flujo:**
1. Cambio de estado
2. React actualiza Virtual DOM
3. Compara (diffing) con versión anterior
4. Actualiza solo lo necesario en el DOM real

**Ventaja:** Actualizaciones rápidas y eficientes.

## Optimización y Rendimiento

### Memorización (Memoization)
**Optimización** para evitar cálculos o renders innecesarios guardando resultados previos.

**Herramientas:**
- `React.memo` - Memoriza componentes
- `useMemo` - Memoriza valores
- `useCallback` - Memoriza funciones

```tsx
// Memorizar componente
const MemoizedComponent = React.memo(MyComponent);

// Memorizar valor
const expensiveValue = useMemo(() => calculateValue(), [deps]);

// Memorizar función
const memoizedCallback = useCallback(() => doSomething(), [deps]);
```

### Lazy Loading
Técnica para **cargar componentes o recursos** solo cuando se necesitan, no al inicio.

```tsx
const LazyComponent = lazy(() => import('./MyComponent'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

**Ventaja:** Reduce el tamaño del bundle inicial.

## Componentes Especiales

### Suspense
Componente que **permite renderizar un fallback** mientras se carga algo (como componentes lazy).

```tsx
<Suspense fallback={<p>Cargando...</p>}>
  <LazyComponent />
</Suspense>
```

**Uso común:**
- Code splitting
- Data fetching (React 18+)

### Server Component
**Componente que se ejecuta en el servidor** (React 18+). Reduce el JavaScript enviado al cliente.

```tsx
// Server Component (sin 'use client')
async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**Ventajas:**
- Mejor rendimiento
- Acceso directo a la base de datos
- Menos JavaScript en el cliente

## Otros Conceptos

### Strict Mode
Modo de desarrollo que **activa comprobaciones adicionales** y advertencias para detectar problemas potenciales.

```tsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

**Nota:** Solo afecta en desarrollo, no en producción.

### Side Effects (Efectos Secundarios)
**Operaciones que afectan** algo fuera del componente: peticiones HTTP, timers, manipulación del DOM, suscripciones.

```tsx
useEffect(() => {
  // Side effect: fetch de datos
  fetchData();
}, []);
```

### Cleanup (Limpieza)
**Función que se ejecuta** cuando un componente se desmonta o antes de que un efecto se vuelva a ejecutar.

```tsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);

  // Cleanup
  return () => clearInterval(timer);
}, []);
```

**Uso común:** Limpiar timers, cancelar peticiones, desuscribirse.

## Nomenclatura y Convenciones

### PascalCase para Componentes
Los componentes deben nombrarse con la primera letra en mayúscula.

```tsx
// ✅ BIEN
const MyComponent = () => { ... };

// ❌ MAL
const myComponent = () => { ... };
```

### camelCase para funciones/variables
Funciones y variables normales usan camelCase.

```tsx
const handleClick = () => { ... };
const userName = 'John';
```

### "on" prefix para event handlers
Convención para props que son funciones de eventos.

```tsx
<Button onClick={handleClick} onChange={handleChange} />
```

## Términos del Ecosistema

### Bundle
El **archivo JavaScript final** que contiene toda la aplicación empaquetada.

### Tree Shaking
Proceso de **eliminar código no usado** del bundle final.

### Hot Module Replacement (HMR)
Permite **actualizar módulos** sin recargar toda la página durante el desarrollo.

### Hydration
Proceso de **añadir interactividad** a HTML pre-renderizado en el servidor (SSR).

---

## Resumen Rápido

| Término | Descripción en una línea |
|---------|--------------------------|
| **React** | Biblioteca para crear interfaces de usuario |
| **JSX** | Sintaxis HTML-like en JavaScript |
| **Componentes** | Piezas reutilizables de UI |
| **Props** | Datos que se pasan a componentes |
| **Estado** | Datos que pueden cambiar en un componente |
| **Hooks** | Funciones para usar características de React |
| **useEffect** | Hook para efectos secundarios |
| **Virtual DOM** | Representación en memoria del DOM |
| **Context** | Compartir datos sin prop drilling |
| **Inmutabilidad** | No modificar datos directamente |

---

## Recursos Adicionales

- [React Docs - Glosario Oficial](https://react.dev/learn/glossary)
- [React Docs - Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
