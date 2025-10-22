import { useState } from "react";
import { GifList } from "./gifs/components/GifList";
import { PreviousSearches } from "./gifs/components/PreviousSearches";
import { CustomHeader } from "./shared/components/CustomHeader";
import { SearchBar } from "./shared/components/SearchBar";
import { getGifsByQuery } from "./gifs/actions/get-gifs-by-query.action";
import type { Gif } from "./gifs/interfaces/gif.interface";

export const GifsApp = () => {
  // Estado para el historial de búsquedas
  const [previusTerms, setPreviousTerms] = useState<string[]>([]);

  // Estado para los GIFs obtenidos
  const [gifs, setGifs] = useState<Gif[]>([]);

  const handleTermClicked = (term: string) => {
    console.log({ term });
  };

  // Maneja la búsqueda de GIFs
  const handleSearch = async (query: string) => {
    const querySearch = query.trim().toLocaleLowerCase();

    // Validar que no esté vacío
    if (querySearch.length === 0) return;

    // Evitar búsquedas duplicadas
    if (previusTerms.includes(querySearch)) return;

    // Agregar al historial (máximo 8 términos)
    setPreviousTerms([querySearch, ...previusTerms].splice(0, 8));

    // Obtener GIFs de la API
    const gifs = await getGifsByQuery(querySearch);

    setGifs(gifs);
  };

  return (
    <>
      <CustomHeader
        title="Buscador de Gifs"
        description="Descubre y comparte el Gif perfecto"
      />

      <SearchBar placeholder="Buscar gifs..." onQuery={handleSearch} />

      <PreviousSearches
        searches={previusTerms}
        onlabelClicked={handleTermClicked}
      />

      <GifList gifs={gifs} />
    </>
  );
};
