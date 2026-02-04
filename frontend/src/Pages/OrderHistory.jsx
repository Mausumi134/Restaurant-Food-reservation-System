import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter ? `?status=${filter}` : '';
      const response = await axios.get(`http://localhost:3000/api/v1/orders/my-orders${params}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view your orders');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', icon: FiClock },
      confirmed: { class: 'bg-info', icon: FiCheckCircle },
      preparing: { class: 'bg-primary', icon: FiClock },
      ready: { class: 'bg-success', icon: FiCheckCircle },
      'out-for-delivery': { class: 'bg-primary', icon: FiClock },
      delivered: { class: 'bg-success', icon: FiCheckCircle },
      cancelled: { class: 'bg-danger', icon: FiXCircle }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', icon: FiClock };
    const Icon = config.icon;

    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <Icon className="me-1" size={12} />
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Order History</h2>
            
            <select
              className="form-select w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-5">
              <h4>No orders found</h4>
              <p className="text-muted">You haven't placed any orders yet.</p>
              <Link to="/menuitems" className="btn btn-primary">
                Start Ordering
              </Link>
            </div>
          ) : (
            <div className="row">
              {orders.map(order => (
                <div key={order._id} className="col-lg-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="card-title mb-1">Order #{order.orderNumber || order._id.slice(-6)}</h6>
                          <small className="text-muted">{formatDate(order.createdAt)}</small>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="mb-3">
                        <strong>FOODLICKS Restaurant</strong>
                        <br />
                        <small className="text-muted">
                          Downtown City
                        </small>
                      </div>

                      <div className="mb-3">
                        <div className="small text-muted mb-1">Items:</div>
                        {order.items && order.items.length > 0 ? (
                          <>
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="small">
                                {item.quantity}x {item.menuItem?.name || 'Unknown Item'}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="small text-muted">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="small text-muted">No items</div>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">${order.total.toFixed(2)}</div>
                          <small className="text-muted text-capitalize">
                            {order.orderType}
                          </small>
                        </div>
                        
                        <Link 
                          to={`/order/${order._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <FiEye className="me-1" />
                          View Details
                        </Link>
                      </div>

                      {order.estimatedDeliveryTime && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Estimated: {formatDate(order.estimatedDeliveryTime)}
                          </small>
                        </div>
                      )}
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

export default OrderHistory;