import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiMapPin, FiClock, FiTruck, FiPhone, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DeliveryTracking = () => {
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackingInfo();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchTrackingInfo, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchTrackingInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/delivery/track/${orderId}`);
      setTracking(response.data.tracking);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch tracking information');
      }
      console.error('Error fetching tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      assigned: { 
        icon: FiTruck, 
        color: 'text-info', 
        title: 'Driver Assigned', 
        description: 'A driver has been assigned to your order' 
      },
      picked_up: { 
        icon: FiCheckCircle, 
        color: 'text-success', 
        title: 'Order Picked Up', 
        description: 'Your order has been picked up from the restaurant' 
      },
      on_the_way: { 
        icon: FiTruck, 
        color: 'text-primary', 
        title: 'On The Way', 
        description: 'Your order is on the way to your location' 
      },
      nearby: { 
        icon: FiMapPin, 
        color: 'text-warning', 
        title: 'Driver Nearby', 
        description: 'Your driver is nearby and will arrive soon' 
      },
      delivered: { 
        icon: FiCheckCircle, 
        color: 'text-success', 
        title: 'Delivered', 
        description: 'Your order has been delivered successfully' 
      }
    };

    return statusConfig[status] || { 
      icon: FiClock, 
      color: 'text-muted', 
      title: 'Processing', 
      description: 'Your order is being processed' 
    };
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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

  if (!tracking) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center">
          <h4>Tracking information not available</h4>
          <p className="text-muted">This order may not be eligible for delivery tracking.</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(tracking.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Track Your Delivery</h2>
          <p className="text-muted mb-4">Order #{tracking.order.orderNumber}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Current Status */}
          <div className="card mb-4">
            <div className="card-body text-center py-4">
              <StatusIcon size={48} className={`${statusInfo.color} mb-3`} />
              <h4 className={statusInfo.color}>{statusInfo.title}</h4>
              <p className="text-muted mb-0">{statusInfo.description}</p>
              
              {tracking.estimatedDeliveryTime && tracking.status !== 'delivered' && (
                <div className="mt-3">
                  <small className="text-muted">
                    Estimated delivery: {formatTime(tracking.estimatedDeliveryTime)}
                  </small>
                </div>
              )}
              
              {tracking.actualDeliveryTime && (
                <div className="mt-3">
                  <small className="text-success">
                    Delivered at: {formatTime(tracking.actualDeliveryTime)}
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Driver Information */}
          {tracking.driver && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>Driver Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      {tracking.driver.photo ? (
                        <img 
                          src={tracking.driver.photo} 
                          alt={tracking.driver.name}
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                          style={{ width: '50px', height: '50px' }}
                        >
                          <span className="text-white fw-bold">
                            {tracking.driver.name?.charAt(0) || 'D'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h6 className="mb-0">{tracking.driver.name}</h6>
                        <small className="text-muted">{tracking.driver.vehicleType}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {tracking.driver.phone && (
                      <div className="d-flex align-items-center mb-2">
                        <FiPhone className="me-2 text-muted" />
                        <span>{tracking.driver.phone}</span>
                      </div>
                    )}
                    {tracking.driver.vehicleNumber && (
                      <div className="d-flex align-items-center">
                        <FiTruck className="me-2 text-muted" />
                        <span>{tracking.driver.vehicleNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Delivery Address</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-start">
                <FiMapPin className="me-2 mt-1 text-muted" />
                <div>
                  <div>{tracking.order.deliveryAddress?.street}</div>
                  <div>{tracking.order.deliveryAddress?.city}, {tracking.order.deliveryAddress?.state} {tracking.order.deliveryAddress?.zipCode}</div>
                  {tracking.order.deliveryAddress?.deliveryInstructions && (
                    <div className="small text-muted mt-2">
                      <strong>Instructions:</strong> {tracking.order.deliveryAddress.deliveryInstructions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Delivery Timeline */}
          <div className="card">
            <div className="card-header">
              <h5>Delivery Timeline</h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className={`timeline-item ${['delivered', 'nearby', 'on_the_way', 'picked_up', 'assigned'].includes(tracking.status) ? 'completed' : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h6>Order Confirmed</h6>
                    <small className="text-muted">Your order has been confirmed</small>
                  </div>
                </div>
                
                <div className={`timeline-item ${['delivered', 'nearby', 'on_the_way', 'picked_up'].includes(tracking.status) ? 'completed' : tracking.status === 'assigned' ? 'active' : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h6>Driver Assigned</h6>
                    <small className="text-muted">A driver has been assigned</small>
                  </div>
                </div>
                
                <div className={`timeline-item ${['delivered', 'nearby', 'on_the_way'].includes(tracking.status) ? 'completed' : tracking.status === 'picked_up' ? 'active' : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h6>Order Picked Up</h6>
                    <small className="text-muted">Order collected from restaurant</small>
                  </div>
                </div>
                
                <div className={`timeline-item ${['delivered', 'nearby'].includes(tracking.status) ? 'completed' : tracking.status === 'on_the_way' ? 'active' : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h6>On The Way</h6>
                    <small className="text-muted">Driver is heading to you</small>
                  </div>
                </div>
                
                <div className={`timeline-item ${tracking.status === 'delivered' ? 'completed' : tracking.status === 'nearby' ? 'active' : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h6>Delivered</h6>
                    <small className="text-muted">Order delivered successfully</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;