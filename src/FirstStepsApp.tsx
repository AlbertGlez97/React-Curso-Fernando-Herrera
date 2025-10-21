import ItemCounter from "./shopping-cart/ItemCounter";

interface ItemInCart {
  id: number;
  productName: string;
  quantity: number;
}

const itemsInCart: ItemInCart[] = [
  { id: 2, productName: "Xbox", quantity: 1 },
  { id: 3, productName: "Nintendo", quantity: 2 },
  { id: 4, productName: "Play Station", quantity: 3 },
];

export function FirstStepsApp() {
  return (
    <>
      <h1>Hello, world!!</h1>
      {itemsInCart.map((item) => (
        <ItemCounter
          key={item.id}
          nameProduct={item.productName}
          quantity={item.quantity}
        />
      ))}

      {/* <ItemCounter nameProduct="Xbox" quantity={1} />
      <ItemCounter nameProduct="Nintendo" quantity={2} />
      <ItemCounter nameProduct="Play Station" quantity={3} /> */}
    </>
  );
}
