# Axios y Peticiones HTTP

## ¿Qué es Axios?

Axios es una librería de JavaScript para hacer peticiones HTTP. Es más fácil de usar que `fetch` nativo y viene con muchas características útiles.

## Instalación

```bash
npm install axios
```

## Configuración base en el código

### Creando una instancia de Axios

```tsx
import axios from "axios";

export const giphyApi = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
  params: {
    api_key: import.meta.env.VITE_GIPHY_API_KEY,
    lang: "en",
  },
});
```

**¿Por qué crear una instancia?**
- Define configuración común (URL base, headers, params)
- No tienes que repetir la URL completa en cada petición
- Reutilizable en toda la aplicación

### Variables de entorno (import.meta.env)

```tsx
import.meta.env.VITE_GIPHY_API_KEY
```

**Archivo .env:**
```
VITE_GIPHY_API_KEY=tu_api_key_aquí
```

- Variables con prefijo `VITE_` son accesibles en el código
- **Nunca** commitees el archivo `.env` (debe estar en `.gitignore`)
- Seguro para usar en el frontend (Vite las inyecta en tiempo de build)

## Haciendo peticiones

### GET básico

```tsx
export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
  const response = await giphyApi.get<GiphyResponse>(`/search`, {
    params: {
      q: query,
      limit: 10,
    },
  });

  return response.data.data.map((gif) => ({
    id: gif.id,
    title: gif.title,
    url: gif.images.original.url,
  }));
};
```

**Desglose:**
1. `giphyApi.get<GiphyResponse>()`: Petición GET con tipado TypeScript
2. `/search`: Endpoint (se combina con baseURL)
3. `params`: Query parameters (`?q=react&limit=10`)
4. `await`: Espera la respuesta
5. `response.data`: Axios pone los datos en `.data`
6. `.map()`: Transforma la respuesta a nuestro formato

### URL final construida

```tsx
giphyApi.get('/search', { params: { q: 'react', limit: 10 } })

// Se convierte en:
// https://api.giphy.com/v1/gifs/search?api_key=XXX&lang=en&q=react&limit=10
```

## Estructura de respuesta de Axios

```tsx
{
  data: {...},          // Los datos de la API
  status: 200,          // Código HTTP
  statusText: 'OK',     // Texto del status
  headers: {...},       // Headers de respuesta
  config: {...},        // Configuración de la petición
  request: {...}        // Objeto XMLHttpRequest
}
```

**Normalmente solo usas:** `response.data`

## Tipado con TypeScript

### Tipando la respuesta

```tsx
interface GiphyResponse {
  data: Array<{
    id: string;
    title: string;
    images: {
      original: {
        url: string;
        width: string;
        height: string;
      };
    };
  }>;
}

// Uso con tipado
const response = await giphyApi.get<GiphyResponse>('/search');
//    ^^^^^^^^ TypeScript sabe qué tipo de datos esperar
```

## Otros métodos HTTP

### POST
```tsx
const response = await axios.post('/users', {
  name: 'Juan',
  email: 'juan@example.com'
});
```

### PUT
```tsx
const response = await axios.put('/users/1', {
  name: 'Juan Actualizado'
});
```

### DELETE
```tsx
const response = await axios.delete('/users/1');
```

### PATCH
```tsx
const response = await axios.patch('/users/1', {
  email: 'nuevo@example.com'
});
```

## Parámetros de petición

### Query Parameters (en URL)
```tsx
axios.get('/search', {
  params: {
    q: 'react',
    limit: 10
  }
});
// URL: /search?q=react&limit=10
```

### Headers personalizados
```tsx
axios.get('/data', {
  headers: {
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json'
  }
});
```

### Body (POST/PUT)
```tsx
axios.post('/users', {
  name: 'Juan',
  email: 'juan@example.com'
});
```

## Configuración global vs por petición

### Global (en la instancia)
```tsx
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Por petición (override)
```tsx
api.get('/search', {
  timeout: 10000,  // Sobrescribe el timeout global
  params: { q: 'react' }
});
```

## Manejo de errores con Axios

### Con try/catch
```tsx
const fetchGifs = async (query: string) => {
  try {
    const response = await giphyApi.get('/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error de Axios:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Datos:', error.response?.data);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};
```

### Tipos de errores

```tsx
if (axios.isAxiosError(error)) {
  // Error de red
  if (error.response) {
    // El servidor respondió con status != 2xx
    console.log(error.response.status);  // 404, 500, etc.
    console.log(error.response.data);
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    console.log('Sin respuesta del servidor');
  } else {
    // Error al configurar la petición
    console.log('Error:', error.message);
  }
}
```

## Interceptors (avanzado)

Ejecuta código antes de cada petición o después de cada respuesta:

```tsx
// Request interceptor
giphyApi.interceptors.request.use(
  (config) => {
    console.log('Haciendo petición:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
giphyApi.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', response.status);
    return response;
  },
  (error) => {
    console.error('Error en respuesta:', error);
    return Promise.reject(error);
  }
);
```

## Axios vs Fetch

| Característica | Axios | Fetch |
|---------------|-------|-------|
| Automático JSON parsing | ✅ Sí | ❌ Manual |
| Request/Response interceptors | ✅ Sí | ❌ No |
| Manejo automático de errores | ✅ Mejor | ⚠️ Solo errores de red |
| Timeout | ✅ Sí | ❌ Manual |
| Sintaxis | Más simple | Más verbosa |
| Browser support | ✅ Mejor | Moderno |

**Ejemplo comparativo:**

```tsx
// Fetch
const response = await fetch(url);
if (!response.ok) throw new Error('Error');
const data = await response.json();

// Axios
const { data } = await axios.get(url);
```

## Patrón de organización en el proyecto

```
src/
├── gifs/
│   ├── api/
│   │   └── giphy.api.ts        ← Configuración de Axios
│   ├── actions/
│   │   └── get-gifs.action.ts  ← Funciones que usan la API
│   └── interfaces/
│       └── giphy.response.ts    ← Tipos de respuesta
```

**Ventajas:**
- Separación de responsabilidades
- Fácil de testear
- Fácil de mantener y cambiar la API
