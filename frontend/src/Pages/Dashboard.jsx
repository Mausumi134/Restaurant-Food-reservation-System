import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp } from 'react-icons/fi';
import LogoutButton from '../components/LogoutButton';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurant orders
      const ordersResponse = await axios.get('http://localhost:3000/api/v1/orders/restaurant/orders');
      const orders = ordersResponse.data.orders;
      
      // Calculate stats
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter(order => ['pending', 'confirmed', 'preparing'].includes(order.status)).length;
      const completedOrders = orders.filter(order => order.status === 'delivered').length;
      
      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders
      });
      
      // Set recent orders (last 10)
      setRecentOrders(orders.slice(0, 10));
      
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/v1/orders/${orderId}/status`, {
        status: newStatus
      });
      toast.success('Order status updated');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      preparing: 'bg-primary',
      ready: 'bg-success',
      'out-for-delivery': 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger'
    };
    
    return statusConfig[status] || 'bg-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
            <div>
              <h2>Restaurant Dashboard</h2>
              <p className="text-muted mb-0">Welcome back, {user?.firstName}!</p>
            </div>
            <LogoutButton className="btn-sm" useModal={true} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Orders</h6>
                  <h3 className="mb-0">{stats.totalOrders}</h3>
                </div>
                <FiShoppingBag size={40} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Revenue</h6>
                  <h3 className="mb-0">${stats.totalRevenue.toFixed(2)}</h3>
                </div>
                <FiDollarSign size={40} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pending Orders</h6>
                  <h3 className="mb-0">{stats.pendingOrders}</h3>
                </div>
                <FiUsers size={40} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Completed</h6>
                  <h3 className="mb-0">{stats.completedOrders}</h3>
                </div>
                <FiTrendingUp size={40} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Orders</h5>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No orders yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>
                            <strong>#{order.orderNumber}</strong>
                          </td>
                          <td>
                            {order.customer.firstName} {order.customer.lastName}
                            <br />
                            <small className="text-muted">{order.customer.phone}</small>
                          </td>
                          <td>
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            <br />
                            <small className="text-muted text-capitalize">{order.orderType}</small>
                          </td>
                          <td>
                            <strong>${order.total.toFixed(2)}</strong>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(order.status)}`}>
                              {order.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <small>{formatDate(order.createdAt)}</small>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                Update Status
                              </button>
                              <ul className="dropdown-menu">
                                {order.status === 'pending' && (
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                    >
                                      Confirm Order
                                    </button>
                                  </li>
                                )}
                                {order.status === 'confirmed' && (
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order._id, 'preparing')}
                                    >
                                      Start Preparing
                                    </button>
                                  </li>
                                )}
                                {order.status === 'preparing' && (
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order._id, 'ready')}
                                    >
                                      Mark Ready
                                    </button>
                                  </li>
                                )}
                                {order.status === 'ready' && order.orderType === 'delivery' && (
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order._id, 'out-for-delivery')}
                                    >
                                      Out for Delivery
                                    </button>
                                  </li>
                                )}
                                {(['ready', 'out-for-delivery'].includes(order.status)) && (
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                                    >
                                      Mark Delivered
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;