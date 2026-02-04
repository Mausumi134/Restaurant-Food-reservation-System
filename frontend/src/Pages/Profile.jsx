import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSettings } from 'react-icons/fi';
import LogoutButton from '../components/LogoutButton';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogoutAllDevices = async () => {
    if (window.confirm('This will log you out from all devices. Continue?')) {
      try {
        // In a real app, this would call an API to invalidate all user tokens
        toast.success('Logged out from all devices successfully');
        // For now, just logout from current device
        window.location.href = '/';
      } catch (error) {
        toast.error('Failed to logout from all devices');
      }
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-lg-3">
          {/* Profile Sidebar */}
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px' }}
                >
                  <FiUser size={40} className="text-white" />
                </div>
              </div>
              <h5>{user?.firstName} {user?.lastName}</h5>
              <p className="text-muted">{user?.role?.replace('_', ' ').toUpperCase()}</p>
              <LogoutButton className="btn-sm w-100" />
            </div>
          </div>

          {/* Navigation */}
          <div className="card mt-3">
            <div className="list-group list-group-flush">
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FiUser className="me-2" />
                Profile Information
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FiSettings className="me-2" />
                Security Settings
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h5>Profile Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FiUser className="me-2" />
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.firstName || ''}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FiUser className="me-2" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.lastName || ''}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FiMail className="me-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={user?.email || ''}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FiPhone className="me-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={user?.phone || 'Not provided'}
                      readOnly
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.username || ''}
                      readOnly
                    />
                  </div>
                </div>

                <div className="alert alert-info">
                  <strong>Note:</strong> Profile editing is coming soon. Contact support to update your information.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <h5>Security Settings</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-4">
                    <h6>Account Security</h6>
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                      <div>
                        <strong>Password</strong>
                        <br />
                        <small className="text-muted">Last changed: Not available</small>
                      </div>
                      <button className="btn btn-outline-primary btn-sm" disabled>
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="col-12 mb-4">
                    <h6>Session Management</h6>
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                      <div>
                        <strong>Current Session</strong>
                        <br />
                        <small className="text-muted">This device</small>
                      </div>
                      <LogoutButton className="btn-sm" showText={false} />
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                      <div>
                        <strong>All Sessions</strong>
                        <br />
                        <small className="text-muted">Logout from all devices</small>
                      </div>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleLogoutAllDevices}
                      >
                        Logout All
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <h6>Account Actions</h6>
                    <div className="alert alert-warning">
                      <strong>Delete Account:</strong> This action cannot be undone. Contact support to delete your account.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;