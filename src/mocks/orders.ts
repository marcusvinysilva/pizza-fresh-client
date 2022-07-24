import { OrderItemType } from "types/OrderItemType";

export const orders: OrderItemType[] = [
  {
    product: {
      id: "507f191e810c19729de860ea",
      name: "Peperoni",
      description: "Peperoni e Mussarela",
      image: "https://i.imgur.com/enerGan.png",
      price: 40.69,
    },
    quantity: 1,
    observation: "",
  },
  {
    product: {
      id: "507f191e810c19729de860ea",
      name: "Anchovas",
      description: "Anchovas, Calabresa, Tomate, Congumelos e Cebola",
      image: "https://i.imgur.com/r9Z5Nkt.png",
      price: 40.29,
    },
    quantity: 3,
    observation: "",
  },
  {
    product: {
      id: "507f191e810c19729de860ea",
      name: "Calamussa",
      description: "Calabresa e Mussarela",
      image: "https://i.imgur.com/5XAJ5mX.png",
      price: 30.29,
    },
    quantity: 2,
    observation: "",
  },
];
