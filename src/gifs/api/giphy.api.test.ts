import { describe, expect, test } from "vitest";
import { giphyApi } from "./giphy.api";

// Interfaz para tipar los parámetros de la API
interface paramsInterface {
  api_key: string;
  lang: string;
}

// Suite de pruebas para la instancia de Axios de Giphy
describe("giphyApi", () => {
  test("should be configured correctly", () => {
    // Obtener los parámetros de configuración por defecto
    const params: paramsInterface = giphyApi.defaults.params;

    // Verificar valores primitivos con toBe
    expect(giphyApi.defaults.baseURL).toBe("https://api.giphy.com/v1/gifs");
    expect(params.lang).toBe("es");
    expect(params.api_key).toBe(import.meta.env.VITE_GIPHY_API_KEY);

    // Verificar objeto completo con toStrictEqual
    expect(params).toStrictEqual({
      api_key: import.meta.env.VITE_GIPHY_API_KEY,
      lang: "es",
    });
  });
});
