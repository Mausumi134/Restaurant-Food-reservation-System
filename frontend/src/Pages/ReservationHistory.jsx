import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/v1/reservation/my-reservations');
      setReservations(response.data.reservations);
    } catch (error) {
      toast.error('Failed to fetch reservations');
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/api/v1/reservation/${reservationId}/cancel`);
      toast.success('Reservation cancelled successfully');
      fetchReservations(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      confirmed: { class: 'bg-success', text: 'Confirmed' },
      seated: { class: 'bg-info', text: 'Seated' },
      completed: { class: 'bg-primary', text: 'Completed' },
      cancelled: { class: 'bg-danger', text: 'Cancelled' },
      no_show: { class: 'bg-secondary', text: 'No Show' }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', text: status };

    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canCancelReservation = (reservation) => {
    const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();
    const timeDiff = reservationDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return ['pending', 'confirmed'].includes(reservation.status) && hoursDiff > 2;
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
            <h2>My Reservations</h2>
            <Link to="/home#reservation" className="btn btn-primary">
              Make New Reservation
            </Link>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-5">
              <FiCalendar size={64} className="text-muted mb-3" />
              <h4>No reservations found</h4>
              <p className="text-muted mb-4">You haven't made any reservations yet.</p>
              <Link to="/home#reservation" className="btn btn-primary">
                Make Your First Reservation
              </Link>
            </div>
          ) : (
            <div className="row">
              {reservations.map(reservation => (
                <div key={reservation._id} className="col-lg-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="card-title mb-1">
                            Reservation #{reservation._id.slice(-6).toUpperCase()}
                          </h6>
                          <small className="text-muted">
                            Made on {new Date(reservation.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <FiCalendar className="me-2 text-muted" />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FiClock className="me-2 text-muted" />
                          <span>{formatTime(reservation.time)}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FiUsers className="me-2 text-muted" />
                          <span>{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
                        </div>
                        {reservation.table && (
                          <div className="d-flex align-items-center mb-2">
                            <FiMapPin className="me-2 text-muted" />
                            <span>Table {reservation.table.tableNumber} ({reservation.table.location})</span>
                          </div>
                        )}
                      </div>

                      {reservation.occasion && reservation.occasion !== 'other' && (
                        <div className="mb-3">
                          <span className="badge bg-info me-2">
                            {reservation.occasion.charAt(0).toUpperCase() + reservation.occasion.slice(1)}
                          </span>
                        </div>
                      )}

                      {reservation.specialRequests && (
                        <div className="mb-3">
                          <small className="text-muted">
                            <strong>Special Requests:</strong> {reservation.specialRequests}
                          </small>
                        </div>
                      )}

                      {reservation.preOrderItems && reservation.preOrderItems.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted">
                            <strong>Pre-ordered items:</strong> {reservation.preOrderItems.length} items
                          </small>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">
                            {reservation.firstName} {reservation.lastName}
                          </small>
                          <br />
                          <small className="text-muted">{reservation.phone}</small>
                        </div>
                        
                        {canCancelReservation(reservation) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => cancelReservation(reservation._id)}
                          >
                            <FiX className="me-1" />
                            Cancel
                          </button>
                        )}
                      </div>

                      {reservation.checkInTime && (
                        <div className="mt-2">
                          <small className="text-success">
                            Checked in: {new Date(reservation.checkInTime).toLocaleString()}
                          </small>
                        </div>
                      )}

                      {reservation.checkOutTime && (
                        <div className="mt-1">
                          <small className="text-info">
                            Checked out: {new Date(reservation.checkOutTime).toLocaleString()}
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

export default ReservationHistory;