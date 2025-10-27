import { useRef, useState } from "react";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";
import type { Gif } from "../interfaces/gif.interface";

/**
 * Custom Hook para manejar la búsqueda de GIFs
 *
 * Funcionalidades:
 * - Gestión de estado de GIFs y términos de búsqueda
 * - Cache de resultados para búsquedas previas
 * - Validación de búsquedas duplicadas
 * - Historial limitado a 8 términos
 */
export const useGifs = () => {
  // Estado: historial de búsquedas (máximo 8)
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

  // Estado: GIFs actuales a mostrar
  const [gifs, setGifs] = useState<Gif[]>([]);

  // Cache: almacena resultados previos (no causa re-renders)
  const gifsCache = useRef<Record<string, Gif[]>>({});

  /**
   * Maneja el click en un término de búsqueda previo
   * Usa cache si existe, sino hace petición a la API
   */
  const handleTermClicked = async (term: string) => {
    // Optimización: usar cache si existe
    if (gifsCache.current[term]) {
      setGifs(gifsCache.current[term]);
      return;
    }

    // Si no está en cache, obtener de la API
    const gifs = await getGifsByQuery(term);
    setGifs(gifs);
  };

  /**
   * Maneja nueva búsqueda de GIFs
   * Incluye: sanitización, validaciones, historial y cache
   */
  const handleSearch = async (query: string) => {
    // Sanitización: normalizar término
    const querySearch = query.trim().toLocaleLowerCase();

    // Validación: no buscar vacíos
    if (querySearch.length === 0) return;

    // Validación: evitar duplicados en historial
    if (previousTerms.includes(querySearch)) return;

    // Actualizar historial (mantener solo 8 términos)
    setPreviousTerms([querySearch, ...previousTerms].splice(0, 8));

    // Obtener GIFs de la API
    const gifs = await getGifsByQuery(querySearch);
    setGifs(gifs);

    // Guardar en cache para futuras búsquedas
    gifsCache.current[query] = gifs;
  };

  return {
    // Propiedades (datos)
    previousTerms,
    gifs,

    // Métodos / Acciones (funciones)
    handleTermClicked,
    handleSearch,
  };
};
