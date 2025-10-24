import { useRef, useState } from "react";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";
import type { Gif } from "../interfaces/gif.interface";

//const gifsCache: Record<string, Gif[]> = {};

export const useGifs = () => {
  // Estado para el historial de búsquedas
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

  // Estado para los GIFs obtenidos
  const [gifs, setGifs] = useState<Gif[]>([]);

  const gifsCache = useRef<Record<string, Gif[]>>({});

  const handleTermClicked = async (term: string) => {
    if (gifsCache.current[term]) {
      setGifs(gifsCache.current[term]);
      return;
    }

    const gifs = await getGifsByQuery(term);
    setGifs(gifs);
  };

  // Maneja la búsqueda de GIFs
  const handleSearch = async (query: string) => {
    const querySearch = query.trim().toLocaleLowerCase();

    // Validar que no esté vacío
    if (querySearch.length === 0) return;

    // Evitar búsquedas duplicadas
    if (previousTerms.includes(querySearch)) return;

    // Agregar al historial (máximo 8 términos)
    setPreviousTerms([querySearch, ...previousTerms].splice(0, 8));

    // Obtener GIFs de la API
    const gifs = await getGifsByQuery(querySearch);

    setGifs(gifs);

    gifsCache.current[query] = gifs;
  };

  return {
    //Propiedades
    previousTerms,
    gifs,

    //Metodos / Acciones
    handleTermClicked,
    handleSearch,
  };
};
