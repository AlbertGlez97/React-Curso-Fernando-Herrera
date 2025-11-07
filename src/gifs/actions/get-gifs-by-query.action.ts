import type { GiphyResponse } from "../interfaces/giphy.response";
import type { Gif } from "../interfaces/gif.interface";
import { giphyApi } from "../api/giphy.api";

/**
 * Obtiene GIFs desde la API de Giphy y los transforma al formato de la aplicación
 */
export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
  try {
    if (query.trim().length === 0) {
      return [];
    }

    const response = await giphyApi.get<GiphyResponse>(`/search`, {
      params: {
        q: query,
        limit: 10,
      },
    });

    // Transformar respuesta de API a interface simplificada
    return response.data.data.map((gif) => ({
      id: gif.id,
      title: gif.title,
      url: gif.images.original.url,
      width: Number(gif.images.original.width),
      height: Number(gif.images.original.height),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
