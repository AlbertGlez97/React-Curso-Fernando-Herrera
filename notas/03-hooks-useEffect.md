# Hook: useEffect

## ¿Qué es?

`useEffect` es un Hook que permite ejecutar código como "efecto secundario" en tu componente. Se usa para operaciones como llamadas a APIs, suscripciones, timers, etc.

## Sintaxis

```tsx
useEffect(() => {
  // Código que se ejecuta

  return () => {
    // Función de limpieza (cleanup)
  };
}, [dependencias]);
```

## Ejemplo en el código: Debounce Pattern

```tsx
useEffect(() => {
  const timeoutId = setTimeout(() => {
    onQuery(query);
  }, 1000);

  return () => {
    clearTimeout(timeoutId);
  };
}, [query, onQuery]);
```

### ¿Qué hace este código?

1. **Efecto**: Cada vez que `query` o `onQuery` cambian, programa una búsqueda después de 1 segundo
2. **Cleanup**: Antes de ejecutar el efecto nuevamente (o al desmontar), cancela el timer anterior
3. **Resultado**: Solo busca después de que el usuario dejó de escribir por 1 segundo

## Patrón Debounce explicado

Imagina que el usuario escribe "react":
- Escribe "r" → programa búsqueda en 1s
- Escribe "e" (antes de 1s) → **cancela** búsqueda anterior, programa nueva en 1s
- Escribe "a" (antes de 1s) → **cancela** búsqueda anterior, programa nueva en 1s
- Escribe "c" (antes de 1s) → **cancela** búsqueda anterior, programa nueva en 1s
- Escribe "t" (antes de 1s) → **cancela** búsqueda anterior, programa nueva en 1s
- Espera 1s → **ejecuta** búsqueda con "react"

**Beneficio**: Evita hacer una petición HTTP por cada letra, solo cuando el usuario termina de escribir.

## Array de dependencias

```tsx
useEffect(() => {
  // código
}, [dependencia1, dependencia2]);
```

- **`[]` vacío**: Se ejecuta solo una vez cuando el componente se monta
- **`[valor]`**: Se ejecuta cuando `valor` cambia
- **Sin array**: Se ejecuta en cada renderizado (generalmente no recomendado)

## Función de limpieza (cleanup)

```tsx
return () => {
  clearTimeout(timeoutId);
};
```

### ¿Cuándo se ejecuta?
1. **Antes de ejecutar el efecto nuevamente** (cuando cambia una dependencia)
2. **Cuando el componente se desmonta** (cuando se elimina del DOM)

### ¿Para qué sirve?
- Cancelar timers
- Cancelar peticiones HTTP
- Desuscribirse de eventos
- Limpiar recursos

### Explicación detallada del flujo de ejecución

Vamos a ver paso a paso cuándo se ejecuta el cleanup con el ejemplo del debounce:

```tsx
useEffect(() => {
  console.log('1. Efecto ejecutándose');
  const timeoutId = setTimeout(() => {
    console.log('3. Timer ejecutado');
    onQuery(query);
  }, 1000);

  return () => {
    console.log('2. Cleanup ejecutándose');
    clearTimeout(timeoutId);
  };
}, [query]);
```

#### Escenario 1: Usuario escribe rápido

```
Usuario escribe "r"
→ 1. Efecto ejecutándose (query = "r")
→ Se programa timer de 1s

Usuario escribe "e" (antes de 1s)
→ 2. Cleanup ejecutándose (cancela timer de "r")
→ 1. Efecto ejecutándose (query = "re")
→ Se programa nuevo timer de 1s

Usuario escribe "a" (antes de 1s)
→ 2. Cleanup ejecutándose (cancela timer de "re")
→ 1. Efecto ejecutándose (query = "rea")
→ Se programa nuevo timer de 1s

Usuario espera 1s sin escribir
→ 3. Timer ejecutado (búsqueda con "rea")
```

**Clave**: El cleanup se ejecuta **ANTES** del siguiente efecto, cancelando el timer anterior.

#### Escenario 2: Componente se desmonta

```
Usuario tiene "react" en el input
→ 1. Efecto ejecutándose (query = "react")
→ Se programa timer de 1s

Usuario navega a otra página (componente se desmonta)
→ 2. Cleanup ejecutándose (cancela timer)
→ El componente ya no existe
```

**Clave**: El cleanup se ejecuta cuando el componente desaparece para evitar memory leaks.

### Visualización del ciclo completo

```tsx
useEffect(() => {
  // A. Se ejecuta cuando:
  //    - El componente se monta (primera vez)
  //    - Alguna dependencia cambia

  const subscription = subscribeToSomething();

  return () => {
    // B. Se ejecuta ANTES de A (excepto en el primer render)
    //    - Antes de que el efecto se ejecute nuevamente
    //    - Al desmontar el componente
    subscription.unsubscribe();
  };
}, [dependency]);
```

### Orden de ejecución con dependencias

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(`Efecto: count es ${count}`);

  return () => {
    console.log(`Cleanup: count era ${count}`);
  };
}, [count]);

// Usuario hace click en un botón que incrementa count

// Render inicial (count = 0)
// → "Efecto: count es 0"

// Click 1 (count cambia a 1)
// → "Cleanup: count era 0"     ← Limpia el efecto anterior
// → "Efecto: count es 1"       ← Ejecuta el nuevo efecto

// Click 2 (count cambia a 2)
// → "Cleanup: count era 1"     ← Limpia el efecto anterior
// → "Efecto: count es 2"       ← Ejecuta el nuevo efecto

// Componente se desmonta
// → "Cleanup: count era 2"     ← Limpieza final
```

### ¿Qué pasa si NO usas cleanup?

#### Ejemplo sin cleanup (❌ Problema)

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Ejecutando cada segundo');
  }, 1000);

  // ❌ No hay cleanup
}, []);

// Problema: Si el componente se desmonta, el interval sigue ejecutándose
// Esto causa un "memory leak" (fuga de memoria)
```

#### Ejemplo con cleanup (✅ Correcto)

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Ejecutando cada segundo');
  }, 1000);

  return () => {
    clearInterval(interval); // ✅ Limpia el interval al desmontar
  };
}, []);
```

### Casos donde NO necesitas cleanup

Si tu efecto no crea suscripciones, timers o recursos, no necesitas cleanup:

```tsx
// ✅ No necesita cleanup - solo actualiza el título
useEffect(() => {
  document.title = `Clicks: ${count}`;
}, [count]);

// ✅ No necesita cleanup - solo hace un fetch
useEffect(() => {
  fetchData();
}, []);
```

### Regla simple

**¿Necesitas cleanup?** Pregúntate:
- ¿Creé un timer (setTimeout, setInterval)? → ✅ Sí, usa cleanup
- ¿Me suscribí a algo (addEventListener, WebSocket)? → ✅ Sí, usa cleanup
- ¿Inicié algo que debe detenerse? → ✅ Sí, usa cleanup
- ¿Solo leo o modifico datos locales? → ❌ No, no necesitas cleanup

## Casos de uso comunes

1. **Fetch de datos al montar**
   ```tsx
   useEffect(() => {
     fetchData();
   }, []);
   ```

2. **Reaccionar a cambios en props/state**
   ```tsx
   useEffect(() => {
     buscarGifs(searchTerm);
   }, [searchTerm]);
   ```

3. **Suscripciones y eventos**
   ```tsx
   useEffect(() => {
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);
   ```
