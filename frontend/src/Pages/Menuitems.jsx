import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { FiSearch, FiFilter, FiShoppingCart } from "react-icons/fi";
import axios from "axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import 'bootstrap/dist/css/bootstrap.css';

const Menuitems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchTerm, selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_BASE_URL}/api/v1/menu`);
      const items = response.data.menuItems;
      setMenuItems(items);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const handleAddToCart = (item) => {
    addToCart(item); // Pass the item directly, CartContext will handle the structure
    toast.success(`${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="menui">
        <div className="container mt-5 pt-5">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menui">
      {/* Header */}
      <div className="menu-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img className="logo" src="/logo2.JPG" alt="logo" />
              <h1 className="menu-title">Our Menu</h1>
              <p className="menu-subtitle">Discover our delicious selection of dishes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="menu-filters">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="category-filter">
                <FiFilter className="filter-icon" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-items-section">
        <div className="container">
          {filteredItems.length > 0 ? (
            <div className="row">
              {filteredItems.map((item) => (
                <div key={item._id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="menu-item-card">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      {item.isNewItem && <span className="badge-new">New</span>}
                      {item.isPopular && <span className="badge-popular">Popular</span>}
                    </div>
                    <div className="item-content">
                      <div className="item-header">
                        <h3>{item.name}</h3>
                        <span className="price">${item.price}</span>
                      </div>
                      <p className="description">{item.description}</p>
                      <div className="item-details">
                        <span className="category">{item.category}</span>
                        <span className="prep-time">{item.preparationTime} min</span>
                      </div>
                      <div className="item-tags">
                        {item.isVegetarian && <span className="tag vegetarian">Vegetarian</span>}
                        {item.isVegan && <span className="tag vegan">Vegan</span>}
                        {item.spiceLevel !== 'Mild' && (
                          <span className={`tag spice-${item.spiceLevel.toLowerCase()}`}>
                            {item.spiceLevel}
                          </span>
                        )}
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        <FiShoppingCart className="me-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-items">
              <h4>No items found</h4>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="menu-footer">
        <div className="container">
          <Link to="/home">
            <button className="back-btn">
              Back to Home{" "}
              <span>
                <HiOutlineArrowNarrowRight />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menuitems;