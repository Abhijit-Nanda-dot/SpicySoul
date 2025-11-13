import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../context/store';

const FoodItem = ({ id, name, price, description, image }) => {

  const { addToCart, decreaseFromCart, cartItems,url} = useContext(StoreContext);

  const cartItem = cartItems.find(ci => ci._id === id);
  const quantity = cartItem ? cartItem.quantity || 0 : 0;

  const handleAdd = () => {
    addToCart({ _id: id, name, price, description, image });
  };

  const handleDecrease = () => {
    decreaseFromCart(id);
  };

  // Handle both imported images (from assets) and backend image URLs
  const imageUrl = typeof image === 'string' 
    ? `${url}/images/${image}` 
    : image || assets.logo;

  return (
    <div className="food-item">
        <div className="food-item-img-container">
            <img 
              className="food-item-img" 
              src={imageUrl} 
              alt={name}
              onError={(e) => {
                e.target.src = assets.logo; // Fallback image if backend image fails to load
              }}
            />
        </div>

        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="rating" />
            </div>
            <p className="food-item-desc">{description}</p>
            <p className="food-item-price">${price}</p>

            <div className="food-item-controls">
              {quantity > 0 ? (
                <div className="qty-control">
                  <button className="qty-btn" onClick={handleDecrease}>-</button>
                  <div className="qty-count">{quantity}</div>
                  <button className="qty-btn" onClick={handleAdd}>+</button>
                </div>
              ) : (
                <button onClick={handleAdd} className="add-to-cart-btn">
                  <img src={assets.add_icon_white} alt="Add to cart" />
                  Add to Cart
                </button>
              )}
            </div>
        </div>
    </div>
  );
};

export default FoodItem;
