import { beforeEach, describe, expect, test, vi } from "vitest";
import { getGifsByQuery } from "./get-gifs-by-query.action";
import AxiosMockAdapter from "axios-mock-adapter";
import { giphyApi } from "../api/giphy.api";
import { giphySearchResponseMock } from "../../test/mocks/giphy.response.data";
import type { Gif } from "../interfaces/gif.interface";

/**
 * Suite de pruebas para la acción getGifsByQuery
 *
 * Utiliza axios-mock-adapter para mockear las peticiones HTTP a la API de Giphy.
 * Esto permite testear la lógica sin hacer llamadas reales al servidor.
 */
describe("getGifsByQuery", () => {
  // Instancia del mock que interceptará las peticiones de axios
  let mock = new AxiosMockAdapter(giphyApi);

  // Reiniciar el mock antes de cada test para evitar interferencias entre tests
  beforeEach(() => {
    //mock.reset(); // Alternativa: resetear configuración manteniendo la instancia
    mock = new AxiosMockAdapter(giphyApi);
  });

  /**
   * Test alternativo (comentado): Validación de estructura con expect.any()
   *
   * Este enfoque verifica solo el primer GIF usando toStrictEqual con expect.any()
   * para validar tipos. Es más conciso pero menos exhaustivo que el test activo.
   * Requiere configurar el mock antes de ejecutarlo.
   */
  //   test("should return a list of gifs", async () => {
  //     // Act: Ejecutar la acción con un query de búsqueda
  //     const gifs = await getGifsByQuery("goku");

  //     // Obtener el primer gif para validar su estructura
  //     const [gifs1] = gifs;

  //     // Assert: Verificar que retorna 10 gifs
  //     expect(gifs.length).toBe(10);

  //     // Assert: Verificar que el primer gif tenga la estructura esperada
  //     expect(gifs1).toStrictEqual({
  //       id: expect.any(String),
  //       title: expect.any(String),
  //       url: expect.any(String),
  //       width: expect.any(Number),
  //       height: expect.any(Number),
  //     });
  //   });

  /**
   * Test 1: Caso exitoso - Respuesta 200 con datos
   *
   * Verifica que:
   * - La función retorna 10 GIFs (límite por defecto)
   * - Cada GIF tiene la estructura correcta (id, title, url, width, height)
   * - Los tipos de datos son correctos
   */
  test("should return a list of gifs", async () => {
    // Arrange: Configurar mock para responder con datos de prueba
    mock.onGet("/search").reply(200, giphySearchResponseMock);

    // Act: Ejecutar la función con un query
    const gifs = await getGifsByQuery("goku");

    // Assert: Verificar estructura y tipos de datos
    expect(gifs.length).toBe(10);

    gifs.forEach((gif: Gif) => {
      expect(typeof gif.id).toBe("string");
      expect(typeof gif.title).toBe("string");
      expect(typeof gif.url).toBe("string");
      expect(typeof gif.width).toBe("number");
      expect(typeof gif.height).toBe("number");
    });
  });

  /**
   * Test 2: Query vacío
   *
   * Verifica que:
   * - Si el query está vacío, retorna array vacío
   * - No hace petición a la API (validación en la función)
   *
   * Nota: Se usa mock.restore() para permitir que la función
   * ejecute su lógica de validación sin interferencia del mock
   */
  test("should return a empty list of gifs if query is empty", async () => {
    //mock.onGet("/search").reply(200, {data:[]}); // No necesario

    // Arrange: Restaurar comportamiento real de axios
    mock.restore();

    // Act: Llamar con query vacío
    const gifs = await getGifsByQuery("");

    // Assert: Debe retornar array vacío
    expect(gifs.length).toBe(0);
  });

  /**
   * Test 3: Manejo de errores de API
   *
   * Verifica que:
   * - Si la API retorna error (400), la función maneja el error correctamente
   * - Retorna array vacío en caso de error
   * - Se registra el error en console.error
   *
   * Usa vi.spyOn() para:
   * - Interceptar llamadas a console.error
   * - Mockear su implementación (evitar logs en tests)
   * - Verificar que fue llamado correctamente
   */
  test("should handle error when the API returns an error", async () => {
    // Arrange: Spy en console.error para verificar que se llama
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {}); // Evita logs en consola durante tests

    // Arrange: Configurar mock para responder con error 400
    mock.onGet("/search").reply(400, {
      data: {
        message: "Bad Request",
      },
    });

    // Act: Ejecutar función que debería fallar
    const gifs = await getGifsByQuery("goku");

    // Assert: Verificar manejo de error
    expect(gifs.length).toBe(0); // Retorna array vacío
    expect(consoleErrorSpy).toHaveBeenCalled(); // Se llamó console.error
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1); // Solo una vez
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.anything()); // Con algún argumento
  });
});
