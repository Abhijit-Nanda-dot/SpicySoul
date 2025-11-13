import React, { useState, useEffect } from 'react'
import './Order.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const url = "https://spicysoul.onrender.com"

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/order/all`)
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error fetching orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`${url}/api/order/update-status/${orderId}`, { status })
      if (response.data.success) {
        toast.success('Order status updated successfully')
        fetchOrders()
      } else {
        toast.error(response.data.message || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Error updating order status. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#e67e22'
      case 'Processing': return '#3498db'
      case 'Delivered': return '#2ecc71'
      case 'Cancelled': return '#e74c3c'
      default: return '#7f8c8d'
    }
  }

  return (
    <div className="orders-container">
      <ToastContainer />
      <h1>Customer Orders</h1>
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-content">
          <div className="orders-list">
            <div className="orders-list-header">
              <p>Order ID</p>
              <p>Date</p>
              <p>Customer</p>
              <p>Total</p>
              <p>Status</p>
              <p>Actions</p>
            </div>
            
            {orders.map((order) => (
              <div 
                key={order._id} 
                className={`order-item ${selectedOrder?._id === order._id ? 'selected' : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <p className="order-id">{order._id.substring(order._id.length - 8)}</p>
                <p>{formatDate(order.createdAt)}</p>
                <p>{order.user.name || 'Customer'}</p>
                <p>${order.totalAmount.toFixed(2)}</p>
                <p className="order-status" style={{ color: getStatusColor(order.status) }}>
                  {order.status}
                </p>
                <div className="order-actions">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          
          {selectedOrder && (
            <div className="order-details">
              <h2>Order Details</h2>
              <div className="order-info">
                <div className="order-info-item">
                  <span>Order ID:</span>
                  <span>{selectedOrder._id}</span>
                </div>
                <div className="order-info-item">
                  <span>Date:</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="order-info-item">
                  <span>Status:</span>
                  <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span>
                </div>
                <div className="order-info-item">
                  <span>Payment Method:</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
              </div>
              
              <h3>Delivery Address</h3>
              <div className="delivery-address">
                <p>{selectedOrder.deliveryAddress.street}</p>
                <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.zipCode}</p>
              </div>
              
              <h3>Order Items</h3>
              <div className="order-items">
                <div className="order-items-header">
                  <p>Item</p>
                  <p>Price</p>
                  <p>Quantity</p>
                  <p>Total</p>
                </div>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <div className="item-name">
                      {item.image && (
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <p>${item.price.toFixed(2)}</p>
                    <p>{item.quantity}</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>${(selectedOrder.totalAmount - 2).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery Fee:</span>
                  <span>$2.00</span>
                </div>
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Orders