import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';
import LogoutModal from './LogoutModal';

const LogoutButton = ({ 
  variant = 'button', 
  className = '', 
  showIcon = true, 
  showText = true,
  useModal = false,
  confirmMessage = 'Are you sure you want to logout?'
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    if (useModal) {
      setShowModal(true);
    } else {
      if (window.confirm(confirmMessage)) {
        logout();
        navigate('/');
      }
    }
  };

  const confirmLogout = () => {
    setShowModal(false);
    logout();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  if (variant === 'link') {
    return (
      <>
        <button 
          className={`btn btn-link text-decoration-none p-0 ${className}`}
          onClick={handleLogout}
        >
          {showIcon && <FiLogOut className={showText ? 'me-2' : ''} />}
          {showText && 'Logout'}
        </button>
        <LogoutModal 
          isOpen={showModal}
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      </>
    );
  }

  if (variant === 'dropdown-item') {
    return (
      <>
        <button 
          className={`dropdown-item d-flex align-items-center logout-item ${className}`}
          onClick={handleLogout}
        >
          {showIcon && <FiLogOut className={showText ? 'me-2' : ''} />}
          {showText && 'Logout'}
        </button>
        <LogoutModal 
          isOpen={showModal}
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      </>
    );
  }

  return (
    <>
      <button 
        className={`btn btn-outline-danger logout-btn ${className}`}
        onClick={handleLogout}
      >
        {showIcon && <FiLogOut className={showText ? 'me-2' : ''} />}
        {showText && 'Logout'}
      </button>
      <LogoutModal 
        isOpen={showModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};

export default LogoutButton;