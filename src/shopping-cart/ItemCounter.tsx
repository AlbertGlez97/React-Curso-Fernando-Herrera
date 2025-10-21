import { useState } from "react";

//import "./ItemCounter.css";
import styles from "./ItemCounter.module.css";

interface Product {
  nameProduct: string;
  quantity?: number;
}

const ItemCounter = ({ nameProduct, quantity = 1 }: Product) => {
  const [count, setCount] = useState(quantity);

  const handleAdd = () => {
    if (count >= 10) return;
    setCount(count + 1);
  };

  const handleSubtract = () => {
    if (count === 1) return;
    setCount(count - 1);
  };

  return (
    <section
      className={styles["item-row"]}
      //className="item-row"
      // style={{
      //   display: "flex",
      //   alignItems: "center",
      //   gap: 10,
      //   marginTop: 10,
      // }}
    >
      <span
        className={styles["item-text"]}
        style={{ color: count === 1 ? "red" : "black" }}
      >
        {nameProduct}
      </span>
      <button onClick={handleAdd}>+1</button>
      <span>{count}</span>
      <button onClick={handleSubtract}>-1</button>
    </section>
  );
};

export default ItemCounter;
