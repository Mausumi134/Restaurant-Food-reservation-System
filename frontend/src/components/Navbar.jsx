import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { getCartItemsCount, setIsOpen: setCartOpen } = useCart();
  const location = useLocation();

  // Don't show navbar on login/register pages
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  const cartItemsCount = getCartItemsCount();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img src="/logo.png" alt="Restaurant" height="40" className="me-2" />
          <span className="fw-bold">FoodieHub</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menuitems">Menu</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/orders">My Orders</Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/reservations">My Reservations</Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item d-lg-none">
                <LogoutButton variant="link" className="nav-link" />
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {/* Cart Button */}
            <button
              className="btn btn-outline-light me-3 position-relative"
              onClick={() => setCartOpen(true)}
            >
              <FiShoppingCart />
              {cartItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <FiUser className="me-2" />
                  {user?.firstName || user?.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text">
                      <small className="text-muted">CUSTOMER</small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/reservations">
                      My Reservations
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <LogoutButton variant="dropdown-item" />
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <Link to="/" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;