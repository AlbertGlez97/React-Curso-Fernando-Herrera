# Inputs Controlados

## ¿Qué es un input controlado?

Un input controlado es un elemento `<input>` cuyo valor está controlado por el estado de React. React es la "fuente de verdad" del valor del input.

## Ejemplo en el código

```tsx
export const SearchBar: FC<SearchBarProps> = ({ placeholder, onQuery }) => {
  const [query, setQuery] = useState("");

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={query}                                      // ← Controlado por estado
      onChange={(event) => setQuery(event.target.value)} // ← Actualiza estado
    />
  );
};
```

## Componentes clave

### 1. Estado
```tsx
const [query, setQuery] = useState("");
```
- Almacena el valor actual del input

### 2. Prop `value`
```tsx
value={query}
```
- Sincroniza el input con el estado
- El input siempre muestra lo que está en `query`

### 3. Evento `onChange`
```tsx
onChange={(event) => setQuery(event.target.value)}
```
- Se ejecuta cada vez que el usuario escribe
- `event.target.value`: El nuevo valor del input
- `setQuery(...)`: Actualiza el estado

## Flujo de datos

1. Usuario escribe "r" en el input
2. Se dispara `onChange`
3. `setQuery("r")` actualiza el estado
4. React re-renderiza el componente
5. El input recibe `value="r"`
6. El input muestra "r"

**Ciclo completo:** Input → Estado → Input

## Input controlado vs no controlado

### Controlado ✅ (Recomendado)
```tsx
const [value, setValue] = useState("");

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Ventajas:**
- React controla el valor
- Fácil validar, formatear, resetear
- Valor accesible en cualquier momento

### No controlado ❌
```tsx
<input defaultValue="inicial" />

// Para obtener el valor:
const value = inputRef.current.value;
```

**Desventajas:**
- DOM controla el valor
- Más difícil de manejar
- Menos "React-way"

## Casos de uso

### 1. Validación en tiempo real

```tsx
const [email, setEmail] = useState("");
const [isValid, setIsValid] = useState(true);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setEmail(value);
  setIsValid(value.includes('@'));  // Valida en tiempo real
};

<input
  value={email}
  onChange={handleChange}
  className={isValid ? 'valid' : 'invalid'}
/>
```

### 2. Formateo automático

```tsx
const [phone, setPhone] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;
  // Solo permite números
  value = value.replace(/\D/g, '');
  // Formatea: (555) 123-4567
  if (value.length > 3) {
    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  }
  setPhone(value);
};

<input value={phone} onChange={handleChange} />
```

### 3. Límite de caracteres

```tsx
const [text, setText] = useState("");
const MAX_LENGTH = 100;

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (value.length <= MAX_LENGTH) {
    setText(value);
  }
};

<input value={text} onChange={handleChange} />
<p>{text.length}/{MAX_LENGTH}</p>
```

### 4. Resetear input

```tsx
const [search, setSearch] = useState("");

const handleSubmit = () => {
  console.log(search);
  setSearch("");  // ← Limpia el input
};

<input value={search} onChange={(e) => setSearch(e.target.value)} />
<button onClick={handleSubmit}>Buscar</button>
```

En el código del proyecto:
```tsx
const handleSearch = () => {
  onQuery(query);
  setQuery("");  // ← Limpia el input después de buscar
};
```

## Múltiples inputs

```tsx
const [formData, setFormData] = useState({
  name: "",
  email: "",
  age: 0
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value  // ← Propiedad dinámica
  });
};

<input
  name="name"
  value={formData.name}
  onChange={handleChange}
/>
<input
  name="email"
  value={formData.email}
  onChange={handleChange}
/>
```

## Select controlado

```tsx
const [country, setCountry] = useState("mx");

<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="mx">México</option>
  <option value="us">USA</option>
  <option value="es">España</option>
</select>
```

## Checkbox controlado

```tsx
const [isChecked, setIsChecked] = useState(false);

<input
  type="checkbox"
  checked={isChecked}                              // ← checked, no value
  onChange={(e) => setIsChecked(e.target.checked)} // ← checked, no value
/>
```

## Textarea controlado

```tsx
const [message, setMessage] = useState("");

<textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

## Ventajas de inputs controlados

1. **Single Source of Truth**: El estado es la fuente de verdad
2. **Validación inmediata**: Valida mientras el usuario escribe
3. **Formateo**: Formatea el valor automáticamente
4. **Fácil de resetear**: Solo cambia el estado
5. **Acceso al valor**: Siempre disponible en el estado
6. **Sincronización**: El input siempre refleja el estado

## Patrón completo del proyecto

```tsx
export const SearchBar: FC<SearchBarProps> = ({ placeholder, onQuery }) => {
  // 1. Estado
  const [query, setQuery] = useState("");

  // 2. Manejador de búsqueda
  const handleSearch = () => {
    onQuery(query);   // Usa el valor del estado
    setQuery("");     // Resetea el input
  };

  // 3. Manejador de Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      handleSearch();
    }
  };

  // 4. Input controlado
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={query}                                      // ← Controlado
        onChange={(event) => setQuery(event.target.value)} // ← Actualiza
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};
```

## Error común

### El input no cambia
```tsx
// ❌ Falta onChange
<input value={query} />

// ✅ Con onChange
<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

Sin `onChange`, el input es **read-only** (solo lectura).
