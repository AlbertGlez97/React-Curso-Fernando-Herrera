import ItemCounter from "./shopping-cart/ItemCounter";

/** Define la estructura de un item en el carrito */
interface ItemInCart {
  id: number;
  productName: string;
  quantity: number;
}

// Lista de items declarada fuera del componente para evitar recrearla en cada render
const itemsInCart: ItemInCart[] = [
  { id: 2, productName: "Xbox", quantity: 1 },
  { id: 3, productName: "Nintendo", quantity: 2 },
  { id: 4, productName: "Play Station", quantity: 3 },
];

/**
 * Componente principal que renderiza una lista de contadores de items
 * Demuestra el uso de renderizado de listas con map() y props key
 */
export function FirstStepsApp() {
  return (
    <>
      <h1>Hello, world!!</h1>
      {/* Renderiza un ItemCounter por cada item en el carrito */}
      {itemsInCart.map((item) => (
        <ItemCounter
          key={item.id} // Key es obligatoria para identificar elementos en listas
          productName={item.productName}
          quantity={item.quantity}
        />
      ))}
    </>
  );
}
