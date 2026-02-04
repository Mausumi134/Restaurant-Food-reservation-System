import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiX, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

const CartSidebar = () => {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();

  if (!isOpen) return null;

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
        style={{ width: '400px', zIndex: 1050, transform: 'translateX(0)' }}
      >
        <div className="d-flex flex-column h-100">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0">
              <FiShoppingBag className="me-2" />
              Cart ({getCartItemsCount()})
            </h5>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setIsOpen(false)}
            >
              <FiX />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow-1 overflow-auto p-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <FiShoppingBag size={48} className="text-muted mb-3" />
                <p className="text-muted">Your cart is empty</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={`${item.menuItem._id}-${index}`} className="card">
                    <div className="card-body p-3">
                      <div className="d-flex">
                        <img 
                          src={item.menuItem.image} 
                          alt={item.menuItem.name}
                          className="rounded"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{item.menuItem.name}</h6>
                          <p className="text-muted small mb-2">${item.price.toFixed(2)} each</p>
                          
                          {item.specialInstructions && (
                            <p className="text-muted small mb-2">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => updateQuantity(
                                  item.menuItem._id, 
                                  item.specialInstructions, 
                                  item.quantity - 1
                                )}
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => updateQuantity(
                                  item.menuItem._id, 
                                  item.specialInstructions, 
                                  item.quantity + 1
                                )}
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            
                            <div className="text-end">
                              <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                              <button 
                                className="btn btn-sm btn-link text-danger p-0"
                                onClick={() => removeFromCart(item.menuItem._id, item.specialInstructions)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-top p-3">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <Link 
                  to="/checkout" 
                  className="btn btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  to="/cart" 
                  className="btn btn-outline-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;