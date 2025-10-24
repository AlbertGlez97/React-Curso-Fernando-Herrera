# 🎯 GIFs App - React + TypeScript + Vite

Aplicación de búsqueda de GIFs utilizando la API de Giphy. Proyecto educativo del curso de React de Fernando Herrera.

## 📚 Notas de Aprendizaje

Esta carpeta contiene notas detalladas sobre los conceptos clave de React implementados en este proyecto:

### Fundamentos de React

1. **[Componentes Funcionales](./notas/01-componentes-funcionales.md)**
   - ¿Qué son los componentes funcionales?
   - Sintaxis con arrow functions
   - Exportación e importación
   - FC vs desestructuración directa

2. **[Props](./notas/04-props.md)**
   - Comunicación entre componentes
   - Flujo unidireccional de datos
   - Props opcionales vs requeridas
   - Funciones como props (callbacks)

3. **[Renderizado Condicional](./notas/06-renderizado-condicional.md)**
   - Operador AND (&&)
   - Operador ternario (? :)
   - Early return
   - Casos de uso comunes

4. **[Listas y Keys](./notas/07-listas-y-keys.md)**
   - Método `.map()` para renderizar listas
   - Importancia de la propiedad `key`
   - Buenas y malas prácticas
   - Listas anidadas

### React Hooks

5. **[useState](./notas/02-hooks-useState.md)**
   - Manejo de estado en componentes funcionales
   - Sintaxis y uso básico
   - Actualización de estado (inmutabilidad)
   - Estado con arrays y objetos
   - Tabla completa de todos los hooks de React

6. **[useEffect](./notas/03-hooks-useEffect.md)**
   - Efectos secundarios en React
   - Array de dependencias
   - Función de limpieza (cleanup)
   - Patrón Debounce implementado

7. **[useRef](./notas/14-useRef.md)**
   - Referencias mutables sin re-renders
   - useRef vs useState
   - Cache de datos (implementado en el proyecto)
   - Referencias a elementos DOM
   - Timers e intervals
   - Cuándo usar useRef

### Manejo de Formularios

8. **[Eventos](./notas/05-eventos.md)**
   - onClick, onChange, onKeyDown
   - Event handlers
   - Tipado de eventos en TypeScript
   - Prevención de comportamiento por defecto

9. **[Inputs Controlados](./notas/11-inputs-controlados.md)**
   - ¿Qué es un input controlado?
   - Flujo de datos bidireccional
   - Validación en tiempo real
   - Reseteo de formularios

### Peticiones HTTP y Asincronía

10. **[Async/Await](./notas/08-async-await.md)**
    - Programación asíncrona en JavaScript
    - Sintaxis async/await
    - Manejo de errores con try/catch
    - Async/await en useEffect

11. **[Axios y HTTP](./notas/09-axios-http.md)**
    - Configuración de Axios
    - Instancias de API
    - Variables de entorno
    - Interceptors y manejo de errores

### TypeScript

12. **[TypeScript e Interfaces](./notas/10-typescript-interfaces.md)**
    - Interfaces para props
    - Tipos primitivos y complejos
    - Genéricos en React
    - Tipos para eventos
    - Type vs Interface

### Custom Hooks y Patrones Avanzados

13. **[Custom Hooks](./notas/13-custom-hook.md)**
    - ¿Qué son los Custom Hooks?
    - Extracción y reutilización de lógica
    - Anatomía de un Custom Hook (useGifs)
    - useRef para caching
    - Reglas de los Hooks
    - Separación de responsabilidades
    - Testing y patrones comunes

### Arquitectura

14. **[Organización de Archivos](./notas/12-organizacion-de-archivos.md)**
    - Estructura feature-based
    - Patrón de capas (API, Actions, Components)
    - Nomenclatura de archivos
    - Mejores prácticas

### Referencia

15. **[Glosario de React](./notas/15-glosario.md)**
    - Términos fundamentales de React
    - Conceptos clave explicados
    - Referencia rápida para desarrollo

---

## 🚀 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar linter
npm run lint

# Preview del build de producción
npm run preview
```

## 🛠️ Tecnologías

- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite 7** - Build tool y dev server
- **Axios** - Cliente HTTP
- **SWC** - Compilador rápido de JavaScript/TypeScript
- **ESLint** - Linter de código

## 📁 Estructura del Proyecto

```
src/
├── gifs/                    # Módulo de GIFs
│   ├── actions/             # Lógica de negocio
│   ├── api/                 # Configuración de Axios
│   ├── components/          # Componentes de UI
│   └── interfaces/          # Tipos TypeScript
├── shared/                  # Código compartido
│   └── components/          # Componentes reutilizables
├── GifsApp.tsx             # Componente raíz
└── main.tsx                # Punto de entrada
```

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GIPHY_API_KEY=tu_api_key_aquí
```

Obtén tu API key en: [Giphy Developers](https://developers.giphy.com/dashboard/)

## 📖 Características Implementadas

- ✅ Búsqueda de GIFs con debounce (1 segundo)
- ✅ Historial de búsquedas previas (máximo 8)
- ✅ Prevención de búsquedas duplicadas
- ✅ Inputs controlados con validación
- ✅ Tipado completo con TypeScript
- ✅ Arquitectura modular y escalable
- ✅ Manejo de peticiones HTTP con Axios

## 📝 Conceptos Aprendidos

Este proyecto cubre los siguientes conceptos fundamentales de React:

- Componentes funcionales y props
- Hooks (useState, useEffect)
- Eventos y formularios
- Inputs controlados
- Renderizado de listas
- Renderizado condicional
- Peticiones HTTP asíncronas
- TypeScript en React
- Patrón Debounce
- Organización de código por características

---

## 📚 Recursos Adicionales

- [Documentación oficial de React](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Giphy API Documentation](https://developers.giphy.com/docs/api)

---

**Curso:** React de Cero a Experto - Fernando Herrera
**Proyecto:** 03 - GIFs App
