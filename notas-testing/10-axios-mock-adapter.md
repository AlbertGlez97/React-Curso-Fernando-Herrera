# Mocking HTTP Requests con axios-mock-adapter

Cuando testeamos funciones que hacen peticiones HTTP, no queremos depender de la API real. **axios-mock-adapter** permite interceptar y simular peticiones de Axios sin hacer llamadas reales al servidor.

## ¿Por qué usar axios-mock-adapter?

**Razones para mockear peticiones HTTP:**
- **Velocidad**: Tests más rápidos (sin latencia de red)
- **Confiabilidad**: Sin dependencia de servicios externos
- **Casos de error**: Fácil simulación de errores 400, 500, etc.
- **Datos controlados**: Respuestas predecibles para tests
- **Sin límites de API**: No consumes rate limits

## Instalación

```bash
npm install axios-mock-adapter --save-dev
```

## Uso Básico

### 1. Importar y Configurar

```tsx
import AxiosMockAdapter from 'axios-mock-adapter';
import { giphyApi } from '../api/giphy.api';

// Crear mock del cliente Axios
const mock = new AxiosMockAdapter(giphyApi);
```

### 2. Configurar Respuestas Mock

```tsx
// Mock de respuesta exitosa (200)
mock.onGet('/search').reply(200, {
  data: [
    { id: '1', title: 'Test GIF', url: 'http://...' }
  ]
});

// Mock de error (400, 500, etc.)
mock.onGet('/search').reply(400, {
  message: 'Bad Request'
});
```

### 3. Limpiar entre Tests

```tsx
beforeEach(() => {
  // Reiniciar el mock antes de cada test
  mock.reset();
  // O crear una nueva instancia
  mock = new AxiosMockAdapter(giphyApi);
});
```

## Ejemplo: Testing de getGifsByQuery

Archivo: `src/gifs/actions/get-gifs-by-query.action.test.ts`

```tsx
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { getGifsByQuery } from './get-gifs-by-query.action';
import AxiosMockAdapter from 'axios-mock-adapter';
import { giphyApi } from '../api/giphy.api';
import { giphySearchResponseMock } from '../../test/mocks/giphy.response.data';

describe('getGifsByQuery', () => {
  let mock = new AxiosMockAdapter(giphyApi);

  beforeEach(() => {
    mock = new AxiosMockAdapter(giphyApi);
  });

  // Test de caso exitoso
  test('should return a list of gifs', async () => {
    // Configurar mock para responder con datos de prueba
    mock.onGet('/search').reply(200, giphySearchResponseMock);

    // Ejecutar función
    const gifs = await getGifsByQuery('goku');

    // Verificar resultados
    expect(gifs.length).toBe(10);
    expect(gifs[0]).toHaveProperty('id');
    expect(gifs[0]).toHaveProperty('url');
  });

  // Test de caso de error
  test('should handle error when the API returns an error', async () => {
    // Mock de respuesta de error
    mock.onGet('/search').reply(400, {
      message: 'Bad Request'
    });

    const gifs = await getGifsByQuery('goku');

    // Debe retornar array vacío en caso de error
    expect(gifs.length).toBe(0);
  });
});
```

## Métodos del Mock

### Configurar Respuestas

```tsx
// GET request
mock.onGet('/search').reply(200, data);

// GET con parámetros específicos
mock.onGet('/search', { params: { q: 'goku' } }).reply(200, data);

// POST request
mock.onPost('/create').reply(201, { id: 1 });

// Cualquier request
mock.onAny('/search').reply(200, data);
```

### Respuestas Dinámicas

```tsx
// Responder según parámetros
mock.onGet('/search').reply((config) => {
  if (config.params?.q === 'error') {
    return [400, { message: 'Error' }];
  }
  return [200, { data: [] }];
});
```

### Control del Mock

```tsx
// Resetear todas las respuestas configuradas
mock.reset();

// Restaurar comportamiento original de Axios
mock.restore();

// Resetear historial de requests
mock.resetHistory();
```

## Patrón: Mock Data Separado

Es buena práctica separar los datos mock en archivos dedicados:

```
src/test/mocks/
├── giphy.response.data.ts    # Respuestas mock de Giphy API
└── user.data.ts              # Otros mocks
```

**Ejemplo:**
```tsx
// src/test/mocks/giphy.response.data.ts
export const giphySearchResponseMock = {
  data: [
    {
      id: 'MQ08dsDSArNtEzf2kk',
      title: 'Goku SSJ',
      images: {
        original: {
          url: 'https://media.giphy.com/...',
          width: '480',
          height: '270'
        }
      }
    },
    // ... más GIFs
  ]
};
```

## Casos de Uso Comunes

### 1. Test de Query Vacío

```tsx
test('should return empty array for empty query', async () => {
  // No configurar mock, restaurar comportamiento
  mock.restore();

  const gifs = await getGifsByQuery('');

  expect(gifs).toEqual([]);
});
```

### 2. Test de Manejo de Errores

```tsx
test('should handle network errors', async () => {
  const consoleErrorSpy = vi.spyOn(console, 'error')
    .mockImplementation(() => {});

  mock.onGet('/search').networkError();

  const gifs = await getGifsByQuery('goku');

  expect(gifs).toEqual([]);
  expect(consoleErrorSpy).toHaveBeenCalled();
});
```

### 3. Test de Timeout

```tsx
test('should handle timeout', async () => {
  mock.onGet('/search').timeout();

  const gifs = await getGifsByQuery('goku');

  expect(gifs).toEqual([]);
});
```

## axios-mock-adapter vs Otras Alternativas

| Característica | axios-mock-adapter | MSW | fetch-mock |
|---------------|-------------------|-----|------------|
| **Específico para Axios** | ✅ Sí | ❌ No | ❌ No |
| **Facilidad de uso** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Mockea a nivel de red** | ❌ No | ✅ Sí | ✅ Sí |
| **Ideal para** | Tests unitarios de acciones | Tests de integración | Tests con fetch API |

**Recomendación:** Si usas Axios, `axios-mock-adapter` es la mejor opción por su simplicidad y precisión.

## Buenas Prácticas

1. **Siempre resetear entre tests:**
   ```tsx
   beforeEach(() => {
     mock.reset();
   });
   ```

2. **Restaurar después de las pruebas:**
   ```tsx
   afterAll(() => {
     mock.restore();
   });
   ```

3. **Usar datos mock realistas:** Copia respuestas reales de la API para tus mocks

4. **Organizar mocks en archivos separados:** Mantén los datos de prueba centralizados

5. **Testear tanto éxito como error:** Asegúrate de cubrir ambos casos

## Resumen

- **axios-mock-adapter** intercepta peticiones de Axios sin llamar al servidor real
- Se instala con: `npm install axios-mock-adapter --save-dev`
- Permite mockear respuestas exitosas, errores, timeouts, etc.
- Ideal para tests unitarios rápidos y confiables
- Se integra perfectamente con Vitest y React Testing Library

**Archivo relacionado:** `src/gifs/actions/get-gifs-by-query.action.test.ts` contiene ejemplos completos de uso con la API de Giphy.
