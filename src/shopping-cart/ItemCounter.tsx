import { useState } from "react";
import styles from "./ItemCounter.module.css";

/** Define las props del componente ItemCounter */
interface Product {
  productName: string;
  quantity?: number; // Opcional, valor por defecto es 1
}

/**
 * Componente contador de items con controles para incrementar/decrementar
 * Demuestra:
 * - Uso de useState para manejar estado local
 * - CSS Modules para estilos con scope local
 * - Validaciones en handlers de eventos
 * - Estilos dinámicos basados en estado
 */
const ItemCounter = ({ productName, quantity = 1 }: Product) => {
  // Estado inicializado con el valor de quantity (prop)
  const [count, setCount] = useState(quantity);

  /** Incrementa el contador (máximo 10) */
  const handleAdd = () => {
    if (count >= 10) return; // Validación: no permite más de 10
    setCount(count + 1);
  };

  /** Decrementa el contador (mínimo 1) */
  const handleSubtract = () => {
    if (count === 1) return; // Validación: no permite menos de 1
    setCount(count - 1);
  };

  return (
    <section className={styles["item-row"]}>
      {/* Texto del producto con color dinámico: rojo cuando count es 1 */}
      <span
        className={styles["item-text"]}
        style={{ color: count === 1 ? "red" : "black" }}
      >
        {productName}
      </span>
      <button onClick={handleAdd}>+1</button>
      <span>{count}</span>
      <button onClick={handleSubtract}>-1</button>
    </section>
  );
};

export default ItemCounter;
