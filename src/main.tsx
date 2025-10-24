import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GifsApp } from "./GifsApp";
// import { MyCounter } from "./counter/components/MyCounterApp";

// Punto de entrada de la aplicación
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GifsApp />
    {/* <MyCounter /> */}
  </StrictMode>
);
