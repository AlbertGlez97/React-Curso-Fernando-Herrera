import axios from "axios";

// Instancia de Axios configurada para la API de Giphy
export const giphyApi = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
  params: {
    api_key: import.meta.env.VITE_GIPHY_API_KEY, // API key desde variables de entorno
    lang: "es",
  },
});
