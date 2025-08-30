import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Cart, OrderItem } from "@/types";
import { calcDeliveryDateAndPrice } from "@/lib/actions/order.actions";

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
};

interface CartState {
  cart: Cart;
  addItem: (item: OrderItem, quantity: number) => Promise<string>;
  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => Promise<void>;
  init: () => void;
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      addItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart;
        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        // Check stock availability
        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error("Not enough items in stock");
          }
        } else {
          if (item.countInStock < quantity) {
            throw new Error("Not enough items in stock");
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }];

        try {
          const deliveryInfo = await calcDeliveryDateAndPrice({
            items: updatedCartItems,
          });

          set({
            cart: {
              ...get().cart,
              items: updatedCartItems,
              ...deliveryInfo,
            },
          });

          const newItem = updatedCartItems.find(
            (x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
          );

          if (!newItem?.clientId) {
            throw new Error("Failed to add item to cart");
          }

          return newItem.clientId;
        } catch (error) {
          throw new Error(
            `Failed to calculate delivery: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      },

      updateItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart;
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (!exist) return;

        // Stock validation for update
        if (exist.countInStock < quantity) {
          throw new Error("Not enough items in stock");
        }

        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity }
            : x
        );

        try {
          const deliveryInfo = await calcDeliveryDateAndPrice({
            items: updatedCartItems,
            // Removed shippingAddress since it's not defined
          });

          set({
            cart: {
              ...get().cart,
              items: updatedCartItems,
              ...deliveryInfo,
            },
          });
        } catch (error) {
          throw new Error(
            `Failed to update item: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      },

      removeItem: async (item: OrderItem) => {
        const { items } = get().cart;
        const updatedCartItems = items.filter(
          (x) =>
            !(
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
            )
        );

        try {
          const deliveryInfo = await calcDeliveryDateAndPrice({
            items: updatedCartItems,
          });

          set({
            cart: {
              ...get().cart,
              items: updatedCartItems,
              ...deliveryInfo,
            },
          });
        } catch (error) {
          throw new Error(
            `Failed to remove item: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      },

      init: () => set({ cart: initialState }),
    }),
    {
      name: "cart-store",
    }
  )
);

export default useCartStore;
