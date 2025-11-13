import { createContext } from 'react';
import { food_list } from '../assets/assets';

export const StoreContext = createContext(null);

export const defaultContextValue = {
  food_list,
  cartItems: [],
  addToCart: () => {},
  decreaseFromCart: () => {},
  removeFromCart: () => {}
};

export default StoreContext;
