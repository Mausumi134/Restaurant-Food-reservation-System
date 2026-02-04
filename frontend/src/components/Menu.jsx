import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/menu');
      // Get only popular items for the home page (limit to 8)
      const popularItems = response.data.menuItems
        .filter(item => item.isPopular)
        .slice(0, 8);
      setMenuItems(popularItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item); // Pass the item directly, CartContext will handle the structure
    toast.success(`${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <section className='menu' id='menu'>
        <div className="container">
          <div className="heading_section">
            <h1 className="heading">POPULAR DISHES</h1>
            <p>Loading our delicious menu items...</p>
          </div>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='menu' id='menu'>
        <div className="container">
          <div className="heading_section">
            <h1 className="heading">POPULAR DISHES</h1>
            <p>Discover our most loved dishes, crafted with the finest ingredients and authentic flavors</p>
          </div>
          <div className="dishes_container">
            {menuItems.length > 0 ? (
              menuItems.map(item => (
                <div className="card" key={item._id}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p className="dish-description">{item.description}</p>
                  <div className="dish-details">
                    <span className="price">${item.price}</span>
                    <span className="category-badge">{item.category}</span>
                  </div>
                  <div className="dish-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No popular dishes available at the moment.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <Link to="/menuitems" className="btn btn-primary btn-lg">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu
