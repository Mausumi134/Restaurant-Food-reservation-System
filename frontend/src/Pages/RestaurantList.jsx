import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiMapPin, FiClock, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    cuisineType: '',
    minRating: ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:3000/api/v1/restaurants?${params}`);
      setRestaurants(response.data.restaurants);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const cuisineTypes = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Thai', 'Japanese'];

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

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Restaurants Near You</h1>
          
          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search restaurants..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  />
                </div>
                
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filters.cuisineType}
                    onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                  >
                    <option value="">All Cuisines</option>
                    {cuisineTypes.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Grid */}
          {restaurants.length === 0 ? (
            <div className="text-center py-5">
              <h4>No restaurants found</h4>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="row">
              {restaurants.map(restaurant => (
                <div key={restaurant._id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={restaurant.images?.[0] || '/restaurant-placeholder.jpg'}
                        className="card-img-top"
                        alt={restaurant.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-primary">
                          <FiStar className="me-1" />
                          {restaurant.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <p className="card-text text-muted small mb-2">
                        {restaurant.cuisineType.join(', ')}
                      </p>
                      <p className="card-text flex-grow-1">
                        {restaurant.description}
                      </p>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center text-muted small mb-1">
                          <FiMapPin className="me-1" />
                          {restaurant.address.city}, {restaurant.address.state}
                        </div>
                        <div className="d-flex align-items-center text-muted small">
                          <FiClock className="me-1" />
                          Delivery: ${restaurant.deliveryFee.toFixed(2)} • Min: ${restaurant.minimumOrderAmount.toFixed(2)}
                        </div>
                      </div>
                      
                      <Link 
                        to={`/restaurant/${restaurant._id}`}
                        className="btn btn-primary"
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;