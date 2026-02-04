import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTax,
    getOrderTotal
  } = useCart();

  const subtotal = getCartTotal();
  const tax = getTax(subtotal);
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center py-5">
          <FiShoppingBag size={64} className="text-muted mb-3" />
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Add some delicious items to get started!</p>
          <Link to="/restaurants" className="btn btn-primary">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Shopping Cart</h2>
            <button 
              className="btn btn-outline-danger"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>

          {cartItems.map((item, index) => (
            <div key={`${item.menuItem._id}-${index}`} className="card mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <img 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name}
                      className="img-fluid rounded"
                      style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="d-flex justify-content-between">
                      <div className="flex-grow-1">
                        <h5>{item.menuItem.name}</h5>
                        <p className="text-muted">{item.menuItem.description}</p>
                        <p className="fw-bold">${item.price.toFixed(2)} each</p>
                        
                        {item.specialInstructions && (
                          <div className="alert alert-info py-2">
                            <small><strong>Special Instructions:</strong> {item.specialInstructions}</small>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-end">
                        <div className="d-flex align-items-center mb-2">
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(
                              item.menuItem._id, 
                              item.specialInstructions, 
                              item.quantity - 1
                            )}
                          >
                            <FiMinus />
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(
                              item.menuItem._id, 
                              item.specialInstructions, 
                              item.quantity + 1
                            )}
                          >
                            <FiPlus />
                          </button>
                        </div>
                        
                        <div className="fw-bold mb-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item.menuItem._id, item.specialInstructions)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="d-grid">
                <Link to="/checkout" className="btn btn-primary">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;