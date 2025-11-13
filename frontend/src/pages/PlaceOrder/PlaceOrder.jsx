import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, token, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Please login to place an order');
      return;
    }
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const orderData = {
        items: cartItems,
        totalAmount: getTotalCartAmount() + 2, // Including delivery fee
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod
      };
      
      const response = await axios.post(`${url}/api/order/create`, orderData, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success('Order placed successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        setTimeout(() => navigate('/'), 3000);
      } else {
        toast.error(response.data.message || 'Failed to place order');
        setError(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <ToastContainer />
      {error && <div className="error-message">{error}</div>}
      
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input 
            type="text" 
            name="firstName"
            placeholder='First Name' 
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="lastName"
            placeholder='Last Name' 
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input 
          type="email" 
          name="email"
          placeholder='Email Address' 
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          type="text" 
          name="street"
          placeholder='Street' 
          value={formData.street}
          onChange={handleChange}
          required
        />

        <div className="multi-fields">
          <input 
            type="text" 
            name="city"
            placeholder='City' 
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="state"
            placeholder='State' 
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="multi-fields">
          <input 
            type="text" 
            name="zipCode"
            placeholder='Zip-Code' 
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="country"
            placeholder='Country' 
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <input 
          type="text" 
          name="phone"
          placeholder='Phone Number' 
          value={formData.phone}
          onChange={handleChange}
          required
        />
        
        <div className="payment-method">
          <p>Payment Method</p>
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>$2.00</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>${(getTotalCartAmount() + 2).toFixed(2)}</b>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;