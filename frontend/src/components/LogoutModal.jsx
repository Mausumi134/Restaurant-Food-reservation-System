import React from 'react';
import { FiLogOut, FiX } from 'react-icons/fi';

const LogoutModal = ({ isOpen, onConfirm, onCancel, title = "Confirm Logout" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block logout-confirm" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center">
              <FiLogOut className="me-2 text-warning" />
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to logout? You will need to login again to access your account.</p>
            <div className="alert alert-info">
              <small>
                <strong>Note:</strong> Your cart items will be cleared when you logout.
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger d-flex align-items-center"
              onClick={onConfirm}
            >
              <FiLogOut className="me-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;