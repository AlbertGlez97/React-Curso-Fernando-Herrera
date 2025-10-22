# Async/Await en React

## ¿Qué es?

`async/await` es la sintaxis moderna de JavaScript para trabajar con código asíncrono (operaciones que toman tiempo, como peticiones HTTP).

## Conceptos básicos

### Función asíncrona
```tsx
const miFuncion = async () => {
  // código asíncrono
};
```

- `async`: Marca la función como asíncrona
- `await`: Espera a que una promesa se resuelva
- La función `async` siempre retorna una `Promise`

## Ejemplos en el código

### Petición HTTP con async/await

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
    width: Number(gif.images.original.width),
    height: Number(gif.images.original.height),
  }));
};
```

**Desglose:**
1. `async`: La función es asíncrona
2. `await giphyApi.get(...)`: Espera a que la petición HTTP termine
3. `response`: Contiene la respuesta cuando la petición termina
4. `.map(...)`: Transforma los datos
5. `return`: Retorna el array de GIFs

### Llamando una función asíncrona

```tsx
const handleSearch = async (query: string) => {
  const gifs = await getGifsByQuery(query);
  setGifs(gifs);
};
```

**Flujo:**
1. Llama a `getGifsByQuery(query)`
2. Espera (`await`) a que termine
3. Cuando termina, guarda el resultado en `gifs`
4. Actualiza el estado con `setGifs(gifs)`

## Comparación: Promises vs Async/Await

### Con Promises (.then)
```tsx
const handleSearch = (query: string) => {
  getGifsByQuery(query)
    .then((gifs) => {
      setGifs(gifs);
    })
    .catch((error) => {
      console.error(error);
    });
};
```

### Con Async/Await
```tsx
const handleSearch = async (query: string) => {
  try {
    const gifs = await getGifsByQuery(query);
    setGifs(gifs);
  } catch (error) {
    console.error(error);
  }
};
```

**Async/await es más legible** y parece código síncrono.

## Manejo de errores

### Con try/catch
```tsx
const fetchData = async () => {
  try {
    const data = await getGifsByQuery("react");
    setGifs(data);
  } catch (error) {
    console.error("Error al obtener GIFs:", error);
    setError("No se pudieron cargar los GIFs");
  }
};
```

### Sin try/catch (¡peligroso!)
```tsx
// ❌ Si hay error, la app puede romperse
const fetchData = async () => {
  const data = await getGifsByQuery("react");
  setGifs(data);
};
```

## Async/Await en useEffect

⚠️ **No puedes hacer el callback de useEffect async directamente**

### ❌ Incorrecto
```tsx
useEffect(async () => {  // ❌ Error
  const data = await fetchData();
}, []);
```

### ✅ Correcto - Opción 1: Función interna
```tsx
useEffect(() => {
  const fetchData = async () => {
    const data = await getGifsByQuery("react");
    setGifs(data);
  };

  fetchData();
}, []);
```

### ✅ Correcto - Opción 2: IIFE (Immediately Invoked Function Expression)
```tsx
useEffect(() => {
  (async () => {
    const data = await getGifsByQuery("react");
    setGifs(data);
  })();
}, []);
```

## Múltiples awaits

### Secuencial (uno después del otro)
```tsx
const fetchAll = async () => {
  const gifs1 = await getGifsByQuery("react");     // Espera
  const gifs2 = await getGifsByQuery("vue");       // Luego espera
  const gifs3 = await getGifsByQuery("angular");   // Luego espera

  setGifs([...gifs1, ...gifs2, ...gifs3]);
};
```

### Paralelo (todos al mismo tiempo)
```tsx
const fetchAll = async () => {
  const [gifs1, gifs2, gifs3] = await Promise.all([
    getGifsByQuery("react"),
    getGifsByQuery("vue"),
    getGifsByQuery("angular"),
  ]);

  setGifs([...gifs1, ...gifs2, ...gifs3]);
};
```

**Promise.all** es más rápido porque las peticiones ocurren en paralelo.

## Return en funciones async

```tsx
// Retorna una promesa que resuelve a un array
const getGifs = async (): Promise<Gif[]> => {
  const response = await giphyApi.get("/search");
  return response.data.data;  // Retorna Gif[]
};

// Uso
const gifs = await getGifs();  // gifs es Gif[]
```

## Axios con async/await

```tsx
// Axios automáticamente maneja promesas
const response = await axios.get(url);
console.log(response.data);  // Los datos están aquí
```

**Métodos comunes:**
```tsx
await axios.get(url)        // GET
await axios.post(url, data) // POST
await axios.put(url, data)  // PUT
await axios.delete(url)     // DELETE
```

## Patrón Loading/Error/Success

```tsx
const [gifs, setGifs] = useState<Gif[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchGifs = async (query: string) => {
  setIsLoading(true);
  setError(null);

  try {
    const data = await getGifsByQuery(query);
    setGifs(data);
  } catch (err) {
    setError("Error al cargar GIFs");
  } finally {
    setIsLoading(false);  // Siempre se ejecuta
  }
};
```

**Renderizado:**
```tsx
{isLoading && <p>Cargando...</p>}
{error && <p>{error}</p>}
{!isLoading && !error && <GifList gifs={gifs} />}
```

## Importante: await solo funciona en async

```tsx
// ❌ Error: await solo dentro de funciones async
const getData = () => {
  const data = await fetchData();  // ❌ Error
};

// ✅ Correcto
const getData = async () => {
  const data = await fetchData();  // ✅ OK
};
```

## Then vs Await

Ambos son válidos, pero async/await es más moderno y legible:

```tsx
// Estilo antiguo (promesas)
getGifsByQuery("react")
  .then((gifs) => setGifs(gifs))
  .catch((error) => console.error(error));

// Estilo moderno (async/await)
try {
  const gifs = await getGifsByQuery("react");
  setGifs(gifs);
} catch (error) {
  console.error(error);
}
```
