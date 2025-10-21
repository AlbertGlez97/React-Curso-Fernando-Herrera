/**
 * Punto de entrada de la aplicación React
 * Renderiza el componente principal en el DOM
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FirstStepsApp } from "./FirstStepsApp";
import { MyAwesomeApp } from "./MyAwesomeApp";

// Crea el root de React y renderiza la aplicación
// StrictMode ayuda a identificar problemas potenciales en la aplicación
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FirstStepsApp />
  </StrictMode>
);
