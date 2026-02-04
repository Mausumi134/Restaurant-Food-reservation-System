import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState('delivery');
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryInstructions: ''
  });
  const [customerNotes, setCustomerNotes] = useState('');
  const [tip, setTip] = useState(0);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const deliveryFee = orderType === 'delivery' ? 5.99 : 0;
  const total = subtotal + tax + deliveryFee + tip;

  const handleAddressChange = (field, value) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (orderType === 'delivery' && (!deliveryAddress.street || !deliveryAddress.city)) {
      toast.error('Please provide delivery address');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.menuItem._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || ''
        })),
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        customerNotes,
        tip
      };

      console.log('Order data being sent:', orderData);
      console.log('Cart items:', cartItems);

      // Create order
      const response = await axios.post('http://localhost:3000/api/v1/orders', orderData);
      
      if (response.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order/${response.data.order._id}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center">
          <h3>Your cart is empty</h3>
          <p>Add some items before checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-lg-8">
          <h2 className="mb-4">Checkout</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Order Type */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Order Type</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="orderType"
                        id="delivery"
                        value="delivery"
                        checked={orderType === 'delivery'}
                        onChange={(e) => setOrderType(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="delivery">
                        <strong>Delivery</strong>
                        <br />
                        <small className="text-muted">Delivered to your address</small>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="orderType"
                        id="pickup"
                        value="pickup"
                        checked={orderType === 'pickup'}
                        onChange={(e) => setOrderType(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="pickup">
                        <strong>Pickup</strong>
                        <br />
                        <small className="text-muted">Pick up from restaurant</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Delivery Address</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">Street Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={deliveryAddress.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={deliveryAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={deliveryAddress.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={deliveryAddress.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Delivery Instructions</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={deliveryAddress.deliveryInstructions}
                        onChange={(e) => handleAddressChange('deliveryInstructions', e.target.value)}
                        placeholder="e.g., Ring doorbell, Leave at door, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Notes */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Order Notes</h5>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="3"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Any special requests or notes for the restaurant..."
                />
              </div>
            </div>

            {/* Tip */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Add Tip</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <button
                      type="button"
                      className={`btn w-100 ${tip === subtotal * 0.15 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setTip(subtotal * 0.15)}
                    >
                      15%
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button
                      type="button"
                      className={`btn w-100 ${tip === subtotal * 0.18 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setTip(subtotal * 0.18)}
                    >
                      18%
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button
                      type="button"
                      className={`btn w-100 ${tip === subtotal * 0.20 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setTip(subtotal * 0.20)}
                    >
                      20%
                    </button>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Custom"
                      step="0.01"
                      min="0"
                      value={tip}
                      onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              {/* Cart Items */}
              {cartItems.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {orderType === 'delivery' && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              {tip > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Tip:</span>
                  <span>${tip.toFixed(2)}</span>
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;