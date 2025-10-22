import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GifsApp } from "./GifsApp";

// Punto de entrada de la aplicación
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GifsApp />
  </StrictMode>
);
