# Organización de Archivos y Módulos

## Estructura del proyecto

```
src/
├── gifs/                    # Módulo de GIFs
│   ├── actions/             # Lógica de negocio
│   │   └── get-gifs-by-query.action.ts
│   ├── api/                 # Configuración de APIs
│   │   └── giphy.api.ts
│   ├── components/          # Componentes específicos de GIFs
│   │   ├── GifList.tsx
│   │   └── PreviousSearches.tsx
│   └── interfaces/          # Tipos TypeScript
│       ├── gif.interface.ts
│       └── giphy.response.ts
├── shared/                  # Código compartido
│   └── components/          # Componentes reutilizables
│       ├── CustomHeader.tsx
│       └── SearchBar.tsx
├── mock-data/               # Datos de prueba
│   └── gifs.mock.ts
├── GifsApp.tsx             # Componente raíz de la app
├── main.tsx                # Punto de entrada
└── index.css               # Estilos globales
```

## Arquitectura por características (Feature-based)

### Ventajas
1. **Escalabilidad**: Fácil agregar nuevas características
2. **Mantenibilidad**: Todo relacionado está junto
3. **Reutilización**: Módulos independientes
4. **Claridad**: Estructura intuitiva

### Carpeta `gifs/` (feature module)

```
gifs/
├── actions/       ← Lógica de negocio
├── api/           ← Configuración de HTTP
├── components/    ← UI específica de GIFs
└── interfaces/    ← Tipos TypeScript
```

**Principio**: Todo lo relacionado con GIFs está en un solo lugar.

### Carpeta `shared/` (código compartido)

```
shared/
└── components/    ← Componentes que usa toda la app
```

**Principio**: Componentes genéricos que no pertenecen a una característica específica.

## Patrón de capas

### 1. Capa de API (api/)

**Responsabilidad**: Configuración de clientes HTTP

```tsx
// gifs/api/giphy.api.ts
export const giphyApi = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
  params: {
    api_key: import.meta.env.VITE_GIPHY_API_KEY,
  },
});
```

### 2. Capa de Acciones (actions/)

**Responsabilidad**: Lógica de negocio y transformación de datos

```tsx
// gifs/actions/get-gifs-by-query.action.ts
export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
  const response = await giphyApi.get<GiphyResponse>(`/search`, {
    params: { q: query, limit: 10 },
  });

  // Transforma la respuesta de la API a nuestro formato
  return response.data.data.map((gif) => ({
    id: gif.id,
    title: gif.title,
    url: gif.images.original.url,
  }));
};
```

### 3. Capa de Componentes (components/)

**Responsabilidad**: Interfaz de usuario

```tsx
// gifs/components/GifList.tsx
export const GifList: FC<GifListProps> = ({ gifs }) => {
  return (
    <div className="gifs-container">
      {gifs.map((gif) => (
        <div key={gif.id}>
          <img src={gif.url} alt={gif.title} />
        </div>
      ))}
    </div>
  );
};
```

### 4. Capa de Interfaces (interfaces/)

**Responsabilidad**: Definición de tipos

```tsx
// gifs/interfaces/gif.interface.ts
export interface Gif {
  id: string;
  title: string;
  url: string;
}
```

## Flujo de datos entre capas

```
Componente (UI)
    ↓ llama a
Action (lógica)
    ↓ usa
API (HTTP)
    ↓ retorna
Response (datos crudos)
    ↓ transforma en
Action
    ↓ retorna
Interface (datos limpios)
    ↓ actualiza
Componente
```

**Ejemplo concreto:**
```
GifsApp.tsx
  → getGifsByQuery("react")
    → giphyApi.get("/search?q=react")
      → GiphyResponse (datos de la API)
    → transforma a Gif[]
  → setGifs(gifs)
→ GifList recibe gifs y renderiza
```

## Nomenclatura de archivos

### Componentes
```
PascalCase.tsx
- GifList.tsx
- CustomHeader.tsx
- SearchBar.tsx
```

### Acciones
```
kebab-case.action.ts
- get-gifs-by-query.action.ts
```

### APIs
```
kebab-case.api.ts
- giphy.api.ts
```

### Interfaces
```
kebab-case.interface.ts
- gif.interface.ts
- giphy.response.ts
```

## Importaciones

### Importación relativa (mismo módulo)
```tsx
// En gifs/components/GifList.tsx
import type { Gif } from "../interfaces/gif.interface";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";
```

### Importación desde otro módulo
```tsx
// En GifsApp.tsx
import { SearchBar } from "./shared/components/SearchBar";
import { GifList } from "./gifs/components/GifList";
```

## Barrel exports (index.ts)

Opcional pero útil para simplificar imports:

```tsx
// gifs/components/index.ts
export * from './GifList';
export * from './PreviousSearches';

// Uso
import { GifList, PreviousSearches } from './gifs/components';
```

## Cuándo crear un nuevo módulo

Crea un nuevo módulo cuando:
1. La funcionalidad es independiente
2. Tiene su propia lógica de negocio
3. Puede crecer en el futuro
4. Otros módulos no dependen fuertemente de él

**Ejemplo**: Si agregas usuarios:
```
src/
├── users/
│   ├── actions/
│   ├── api/
│   ├── components/
│   └── interfaces/
└── gifs/
    └── ...
```

## Anti-patrones a evitar

### ❌ Todo en una carpeta
```
components/
├── GifList.tsx
├── PreviousSearches.tsx
├── SearchBar.tsx
├── CustomHeader.tsx
├── UserProfile.tsx
└── ... (100 archivos más)
```

### ❌ Mezclar responsabilidades
```tsx
// ❌ API + Componente en el mismo archivo
export const GifList = () => {
  const fetchGifs = async () => {
    const response = await axios.get("https://...");
    // ...
  };
};
```

### ❌ Nombres genéricos
```
utils.ts        ← ¿Qué hay aquí?
helpers.ts      ← ¿Ayuda con qué?
functions.ts    ← ¿Qué funciones?
```

## Mejores prácticas

### ✅ Un componente por archivo
```tsx
// GifList.tsx - solo GifList
export const GifList = () => { ... };
```

### ✅ Interfaces en archivos separados
```tsx
// gif.interface.ts
export interface Gif { ... }
```

### ✅ Acciones con nombres descriptivos
```tsx
// get-gifs-by-query.action.ts
export const getGifsByQuery = async () => { ... };
```

### ✅ Agrupar por funcionalidad, no por tipo
```
✅ gifs/components/      (por funcionalidad)
❌ components/gifs/      (por tipo de archivo)
```

## Escalando la estructura

Si un módulo crece mucho:

```
gifs/
├── actions/
├── api/
├── components/
│   ├── list/           ← Sub-módulo de lista
│   │   ├── GifList.tsx
│   │   ├── GifCard.tsx
│   │   └── GifGrid.tsx
│   └── search/         ← Sub-módulo de búsqueda
│       ├── PreviousSearches.tsx
│       └── SearchFilters.tsx
├── hooks/              ← Nueva carpeta para custom hooks
│   └── useGifSearch.ts
└── interfaces/
```

## Archivos de configuración en la raíz

```
03-gifs-app/
├── src/                   ← Código fuente
├── public/                ← Archivos estáticos
├── node_modules/          ← Dependencias
├── package.json           ← Dependencias y scripts
├── tsconfig.json          ← Configuración TypeScript
├── vite.config.ts         ← Configuración Vite
├── eslint.config.js       ← Configuración ESLint
├── .env                   ← Variables de entorno
├── .gitignore             ← Archivos ignorados por Git
└── README.md              ← Documentación
```

## Resumen de principios

1. **Feature-based**: Agrupa por funcionalidad, no por tipo
2. **Separación de responsabilidades**: API, acciones, componentes separados
3. **Nomenclatura consistente**: Sigue convenciones claras
4. **Un archivo, una responsabilidad**: Evita archivos gigantes
5. **Modularidad**: Cada módulo debe ser independiente
