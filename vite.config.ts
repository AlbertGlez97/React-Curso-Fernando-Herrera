/**
 * Configuración de Vite con soporte para Vitest
 * - Plugin de React con SWC para compilación ultra rápida
 * - Configuración de tests con jsdom
 * - Puerto personalizado del servidor de desarrollo
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  // Plugin de React usando SWC (20-70x más rápido que Babel)
  plugins: [react()],

  // Configuración de Vitest
  test: {
    environment: "jsdom", // Simula el DOM del navegador para tests de React
    globals: true, // Permite usar expect, describe, test sin importarlos
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 5174, // Puerto personalizado
  },
});
