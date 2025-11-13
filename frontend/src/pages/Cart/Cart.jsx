import React, {useContext} from 'react';
import  './Cart.css';
import { StoreContext } from '../../context/store';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const { cartItems, removeFromCart, getTotalCartAmount,url } = useContext(StoreContext);
  const itemsWithTotals = cartItems.map(ci => ({...ci, total: (ci.quantity || 0) * (ci.price || 0) }));
  const navigate = useNavigate();
  return (
    <div className='cart'>
      <div className="cart-items">

        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {itemsWithTotals.map((item) => (
          <div className='cart-items-title cart-items-item' key={item._id}>
            <p>{item.image ? <img src={url+"/images/"+item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} /> : '-'}</p>
            <p>{item.name}</p>
            <p>${item.price}</p>
            <p>{item.quantity}</p>
            <p>${item.total}</p>
            <p><button onClick={() => removeFromCart(item._id)}>Remove</button></p>
          </div>
        ))}
        {itemsWithTotals.length === 0 && <p>Your cart is empty.</p>}

      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p> Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>${(getTotalCartAmount()===0?0: getTotalCartAmount() + 2).toFixed(2)}</b>
            </div>
           
          </div>
          <button onClick={()=>navigate('/order')}>Proeed to Check Out !</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here.</p>
            <div className='cart-promocode-input'>
              <input type='text' placeholder='promo code'/>
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;