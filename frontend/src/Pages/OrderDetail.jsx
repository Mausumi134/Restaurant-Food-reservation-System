import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiMapPin, FiClock, FiPhone, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/v1/orders/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      toast.error('Failed to fetch order details');
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/api/v1/orders/${id}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'success',
      'out-for-delivery': 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = (status) => {
    return ['pending', 'confirmed'].includes(status);
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

  if (!order) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center">
          <h4>Order not found</h4>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Order #{order.orderNumber}</h2>
              <p className="text-muted mb-0">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div>
              <span className={`badge bg-${getStatusColor(order.status)} fs-6 me-2`}>
                {order.status.replace('-', ' ').toUpperCase()}
              </span>
              {canCancelOrder(order.status) && (
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Restaurant Info */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Restaurant Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <h6>FOODLICKS Restaurant</h6>
                  <div className="d-flex align-items-center mb-2">
                    <FiMapPin className="me-2 text-muted" />
                    <span>123 Main Street, Downtown City</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FiPhone className="me-2 text-muted" />
                    <span>(555) 123-4567</span>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <span className={`badge bg-${getStatusColor(order.paymentStatus)} mb-2`}>
                    Payment: {order.paymentStatus.toUpperCase()}
                  </span>
                  <br />
                  <span className="badge bg-info">
                    {order.orderType.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Order Items</h5>
            </div>
            <div className="card-body">
              {order.items.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name}
                      className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0">{item.menuItem.name}</h6>
                      <small className="text-muted">{item.menuItem.description}</small>
                      {item.specialInstructions && (
                        <div className="small text-info">
                          Note: {item.specialInstructions}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <div>{item.quantity} × ${item.price.toFixed(2)}</div>
                    <div className="fw-bold">${(item.quantity * item.price).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {order.orderType === 'delivery' && order.deliveryAddress && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>Delivery Address</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <FiMapPin className="me-2 mt-1 text-muted" />
                  <div>
                    <div>{order.deliveryAddress.street}</div>
                    <div>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</div>
                    {order.deliveryAddress.deliveryInstructions && (
                      <div className="small text-muted mt-2">
                        <strong>Instructions:</strong> {order.deliveryAddress.deliveryInstructions}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.customerNotes && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>Order Notes</h5>
              </div>
              <div className="card-body">
                <p className="mb-0">{order.customerNotes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {/* Order Summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              
              {order.deliveryFee > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              
              {order.tip > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Tip:</span>
                  <span>${order.tip.toFixed(2)}</span>
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="card">
            <div className="card-header">
              <h5>Order Timeline</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FiCheckCircle className="text-success me-2" />
                <div>
                  <div className="fw-bold">Order Placed</div>
                  <small className="text-muted">{formatDate(order.createdAt)}</small>
                </div>
              </div>
              
              {order.estimatedDeliveryTime && (
                <div className="d-flex align-items-center mb-3">
                  <FiClock className="text-info me-2" />
                  <div>
                    <div className="fw-bold">Estimated {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</div>
                    <small className="text-muted">{formatDate(order.estimatedDeliveryTime)}</small>
                  </div>
                </div>
              )}
              
              {order.actualDeliveryTime && (
                <div className="d-flex align-items-center mb-3">
                  <FiCheckCircle className="text-success me-2" />
                  <div>
                    <div className="fw-bold">Delivered</div>
                    <small className="text-muted">{formatDate(order.actualDeliveryTime)}</small>
                  </div>
                </div>
              )}

              {/* Delivery Tracking Link */}
              {order.orderType === 'delivery' && ['confirmed', 'preparing', 'ready', 'out-for-delivery'].includes(order.status) && (
                <div className="mt-3 pt-3 border-top">
                  <Link 
                    to={`/track/${order._id}`} 
                    className="btn btn-primary btn-sm w-100"
                  >
                    <FiMapPin className="me-2" />
                    Track Delivery
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;