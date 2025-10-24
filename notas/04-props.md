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

Aunque no se usa en este proyecto, `children` es una prop especial:

```tsx
interface Props {
  children: React.ReactNode;
}

export const Container = ({ children }: Props) => {
  return <div>{children}</div>;
};

// Uso
<Container>
  <h1>Contenido aquí</h1>
</Container>;
```

## Reglas importantes

1. **Las props son inmutables**: No puedes hacer `props.title = "nuevo"` en el hijo
2. **Flujo unidireccional**: Los datos fluyen del padre al hijo, nunca al revés
3. **Para comunicarse hacia arriba**: Usa funciones callback
4. **Tipado con TypeScript**: Siempre define interfaces para tus props
