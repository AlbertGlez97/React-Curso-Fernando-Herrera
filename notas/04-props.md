# Props en React

## ¿Qué son?

Las **props** (propiedades) son la forma en que los componentes de React reciben datos desde su componente padre. Son **inmutables** (no se pueden modificar dentro del componente hijo).

## Flujo de datos

React usa un flujo de datos **unidireccional** (de padre a hijo):

```
Componente Padre → props → Componente Hijo
```

## Ejemplos en el código

### 1. Props de datos simples

```tsx
// Definición de la interfaz
interface CustomHeaderProps {
  title: string;
  description?: string; // ?: significa opcional
}

// Componente hijo que recibe props
export const CustomHeader: FC<CustomHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};

// Componente padre que envía props
<CustomHeader
  title="Buscador de Gifs"
  description="Descubre y comparte el Gif perfecto"
/>;
```

### 2. Props de arrays

```tsx
// Interfaz
interface PreviousSearchesProps {
  searches: string[];
  onlabelClicked: (term: string) => void;
}

// Uso
<PreviousSearches
  searches={previousTerms}
  onlabelClicked={handleTermClicked}
/>;
```

### 3. Props de funciones (callbacks)

```tsx
// Interfaz
interface SearchBarProps {
  placeholder: string;
  onQuery: (query: string) => void; // Función que recibe string
}

// Componente padre define la función
const handleSearch = async (query: string) => {
  // lógica de búsqueda
};

// Pasa la función como prop
<SearchBar placeholder="Buscar gifs..." onQuery={handleSearch} />;

// Componente hijo la usa
export const SearchBar: FC<SearchBarProps> = ({ placeholder, onQuery }) => {
  const handleSearch = () => {
    onQuery(query); // Llama a la función del padre
  };
};
```

### 4. Props de objetos complejos

```tsx
interface GifListProps {
  gifs: Gif[]; // Array de objetos
}

// Uso
<GifList gifs={gifs} />;
```

## Props opcionales vs requeridas

```tsx
interface Props {
  title: string; // Requerida
  description?: string; // Opcional (?)
}
```

Si una prop es opcional, debes manejar el caso cuando no existe:

```tsx
{
  description && <p>{description}</p>;
}
```

## Desestructuración de props

### Opción 1: En los parámetros

```tsx
export const Header = ({ title, description }: HeaderProps) => {
  return <h1>{title}</h1>;
};
```

### Opción 2: En el cuerpo

```tsx
export const Header = (props: HeaderProps) => {
  const { title, description } = props;
  return <h1>{title}</h1>;
};
```

La opción 1 es más común y concisa.

## Pasando funciones como props

### Forma simple (función ya definida)

```tsx
<PreviousSearches onlabelClicked={handleTermClicked} />
```

### Forma con arrow function inline

```tsx
<PreviousSearches onlabelClicked={(term: string) => handleTermClicked(term)} />
```

Ambas son equivalentes, pero la primera es más limpia.

## Children prop

`children` es una **prop especial** que permite pasar elementos JSX dentro de un componente para renderizarlos en su interior. Es fundamental para crear componentes contenedores y layouts reutilizables.

### ¿Qué es children?

Cuando colocas contenido entre las etiquetas de apertura y cierre de un componente, ese contenido se pasa automáticamente como la prop `children`.

```tsx
<MiComponente>
  Este contenido es "children"
</MiComponente>
```

### Ejemplo básico: Componente Box

```tsx
// Definir la interfaz
type BoxProps = {
  children: React.ReactNode; // Este es el contenido que se coloca dentro
};

// Componente que recibe children
const Box = ({ children }: BoxProps) => {
  return (
    <div style={{ border: '2px solid blue', padding: '10px' }}>
      {/* Renderiza lo que se pase dentro del componente */}
      {children}
    </div>
  );
};

export default Box;
```

### Usando el componente Box

```tsx
const App = () => {
  return (
    <div>
      {/* Pasamos elementos como children dentro del componente Box */}
      <Box>
        <h2>Hola Mundo</h2>
        <p>Este es un párrafo</p>
      </Box>

      {/* Podemos reutilizar Box con diferente contenido */}
      <Box>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Box>
    </div>
  );
};
```

### Tipos de children

`React.ReactNode` puede ser:

```tsx
// ✅ Texto simple
<Box>Hola mundo</Box>

// ✅ Un elemento
<Box><h1>Título</h1></Box>

// ✅ Múltiples elementos
<Box>
  <h1>Título</h1>
  <p>Párrafo</p>
</Box>

// ✅ Componentes
<Box>
  <CustomHeader title="Mi Título" />
</Box>

// ✅ Arrays
<Box>
  {[1, 2, 3].map(n => <p key={n}>{n}</p>)}
</Box>

// ✅ null, undefined, boolean (no se renderizan)
<Box>{false}</Box>
```

### Ejemplo avanzado: Card con estilos

```tsx
type CardProps = {
  children: React.ReactNode;
  backgroundColor?: string;
};

const Card = ({ children, backgroundColor = 'white' }: CardProps) => {
  return (
    <div
      style={{
        backgroundColor,
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </div>
  );
};

// Uso
<Card backgroundColor="lightblue">
  <h3>Tarjeta personalizada</h3>
  <p>Contenido flexible dentro de la tarjeta</p>
  <button>Acción</button>
</Card>
```

### ¿Cuándo usar children?

✅ **Usa children cuando:**
- Creas componentes contenedores (Box, Card, Modal)
- Creas layouts (Sidebar, Layout, Container)
- Necesitas flexibilidad en el contenido
- Quieres reutilizar la estructura pero cambiar el contenido

❌ **No uses children cuando:**
- Necesitas datos específicos → usa props normales
- El contenido es siempre el mismo → componente simple sin props
- Necesitas múltiples "slots" → usa props nombradas múltiples

### Children vs Props normales

```tsx
// Con children (más flexible)
<Modal>
  <h1>Título dinámico</h1>
  <p>Contenido cualquiera</p>
  <CustomComponent />
</Modal>

// Con props (más estructurado)
<Modal
  title="Título"
  content="Contenido"
/>
```

**Usa children** cuando el contenido puede variar mucho y necesitas flexibilidad.
**Usa props** cuando el contenido es predecible y estructurado.

## Reglas importantes

1. **Las props son inmutables**: No puedes hacer `props.title = "nuevo"` en el hijo
2. **Flujo unidireccional**: Los datos fluyen del padre al hijo, nunca al revés
3. **Para comunicarse hacia arriba**: Usa funciones callback
4. **Tipado con TypeScript**: Siempre define interfaces para tus props
