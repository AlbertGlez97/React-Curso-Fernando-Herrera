import { useEffect, useState, type FC } from "react";

interface SearchBarProps {
  placeholder: string;
  onQuery: (query: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({ placeholder, onQuery }) => {
  const [query, setQuery] = useState("");

  // Patrón debounce: ejecuta la búsqueda 1 segundo después de que el usuario deje de escribir
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onQuery(query);
    }, 1000);

    // Limpia el timeout anterior cuando query cambia
    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, onQuery]);

  const handleSearch = () => {
    onQuery(query);
    setQuery("");
  };

  // Permite buscar con la tecla Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};
