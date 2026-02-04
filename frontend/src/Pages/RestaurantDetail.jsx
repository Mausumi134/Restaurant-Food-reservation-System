import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FiStar, FiMapPin, FiClock, FiPhone, FiMail, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRestaurantDetails();
    fetchMenu();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/restaurants/${id}`);
      setRestaurant(response.data.restaurant);
    } catch (error) {
      toast.error('Failed to fetch restaurant details');
      console.error('Error fetching restaurant:', error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/menu/restaurant/${id}`);
      setMenu(response.data.menu);
      
      // Set first category as selected
      const categories = Object.keys(response.data.menu);
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch menu');
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    addToCart(selectedItem, quantity, specialInstructions);
    setSelectedItem(null);
    setQuantity(1);
    setSpecialInstructions('');
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setSpecialInstructions('');
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center">
          <h4>Restaurant not found</h4>
        </div>
      </div>
    );
  }

  const categories = Object.keys(menu);

  return (
    <div className="container mt-5 pt-4">
      {/* Restaurant Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={restaurant.images?.[0] || '/restaurant-placeholder.jpg'}
                  className="img-fluid rounded-start h-100"
                  alt={restaurant.name}
                  style={{ objectFit: 'cover', minHeight: '250px' }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h1 className="card-title">{restaurant.name}</h1>
                  <p className="card-text">{restaurant.description}</p>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <FiStar className="text-warning me-2" />
                        <span>{restaurant.averageRating.toFixed(1)} ({restaurant.totalReviews} reviews)</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FiMapPin className="text-muted me-2" />
                        <span>{restaurant.address.street}, {restaurant.address.city}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FiPhone className="text-muted me-2" />
                        <span>{restaurant.phone}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <FiClock className="text-muted me-2" />
                        <span>Delivery Fee: ${restaurant.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Minimum Order: ${restaurant.minimumOrderAmount.toFixed(2)}</strong>
                      </div>
                      <div className="mb-2">
                        <span className="badge bg-secondary me-1">
                          {restaurant.cuisineType.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Menu</h2>
          
          {categories.length === 0 ? (
            <div className="text-center py-5">
              <h4>No menu items available</h4>
            </div>
          ) : (
            <>
              {/* Category Tabs */}
              <ul className="nav nav-pills mb-4">
                {categories.map(category => (
                  <li key={category} className="nav-item">
                    <button
                      className={`nav-link ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category} ({menu[category].length})
                    </button>
                  </li>
                ))}
              </ul>

              {/* Menu Items */}
              <div className="row">
                {menu[selectedCategory]?.map(item => (
                  <div key={item._id} className="col-lg-6 mb-4">
                    <div className="card h-100">
                      <div className="row g-0">
                        <div className="col-4">
                          <img
                            src={item.image}
                            className="img-fluid rounded-start h-100"
                            alt={item.name}
                            style={{ objectFit: 'cover', minHeight: '120px' }}
                          />
                        </div>
                        <div className="col-8">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title mb-0">{item.name}</h6>
                              <span className="fw-bold text-primary">${item.price.toFixed(2)}</span>
                            </div>
                            
                            <p className="card-text small text-muted mb-2">
                              {item.description}
                            </p>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                {item.isVegetarian && (
                                  <span className="badge bg-success me-1">Vegetarian</span>
                                )}
                                {item.isVegan && (
                                  <span className="badge bg-success me-1">Vegan</span>
                                )}
                                {item.spiceLevel !== 'Mild' && (
                                  <span className="badge bg-warning">{item.spiceLevel}</span>
                                )}
                              </div>
                              
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openItemModal(item)}
                              >
                                <FiPlus className="me-1" />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add to Cart Modal */}
      {selectedItem && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedItem.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedItem(null)}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedItem.image}
                  className="img-fluid rounded mb-3"
                  alt={selectedItem.name}
                />
                <p>{selectedItem.description}</p>
                
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="mx-3">{quantity}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Special Instructions (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests..."
                  />
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total: ${(selectedItem.price * quantity).toFixed(2)}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;