import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { FiUsers, FiMapPin, FiClock } from "react-icons/fi";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [tableId, setTableId] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [occasion, setOccasion] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const navigate = useNavigate();

  // Fetch available tables when date, time, or party size changes
  useEffect(() => {
    if (date && time && partySize) {
      fetchAvailableTables();
    }
  }, [date, time, partySize]);

  const fetchAvailableTables = async () => {
    try {
      setLoadingTables(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/tables?date=${date}&time=${time}&partySize=${partySize}`
      );
      setAvailableTables(response.data.tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to fetch available tables');
    } finally {
      setLoadingTables(false);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !phone || !date || !time || !partySize) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const reservationData = {
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        partySize,
        tableId: tableId || undefined,
        specialRequests: specialRequests || undefined,
        occasion: occasion || undefined
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/reservation/send`,
        reservationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      
      // Reset form
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setTime("");
      setDate("");
      setPartySize(2);
      setTableId("");
      setSpecialRequests("");
      setOccasion("");
      setAvailableTables([]);
      
      navigate("/success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to make reservation");
    }
  };

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="res" />
        </div>
        <div className="banner">
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>Reserve your perfect table for an unforgettable dining experience</p>
            <form>
              {/* Personal Information */}
              <div>
                <input
                  type="text"
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Reservation Details */}
              <div>
                <input
                  type="date"
                  placeholder="Date *"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <input
                  type="time"
                  placeholder="Time *"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  min="09:00"
                  max="22:00"
                  required
                />
              </div>

              <div>
                <div className="party-size-container">
                  <FiUsers className="input-icon" />
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(parseInt(e.target.value))}
                    required
                  >
                    <option value="">Party Size *</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(size => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="">Occasion (Optional)</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="date">Date Night</option>
                  <option value="business">Business Meeting</option>
                  <option value="celebration">Celebration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Table Selection */}
              {date && time && partySize && (
                <div className="table-selection">
                  <label>
                    <FiMapPin className="input-icon" />
                    Select Table (Optional)
                  </label>
                  {loadingTables ? (
                    <div className="loading-tables">
                      <div className="spinner"></div>
                      <span>Finding available tables...</span>
                    </div>
                  ) : availableTables.length > 0 ? (
                    <div className="tables-grid">
                      <div 
                        className={`table-option ${!tableId ? 'selected' : ''}`}
                        onClick={() => setTableId("")}
                      >
                        <div className="table-info">
                          <h4>Any Available Table</h4>
                          <p>Let us choose the best table for you</p>
                        </div>
                      </div>
                      {availableTables.map(table => (
                        <div 
                          key={table._id}
                          className={`table-option ${tableId === table._id ? 'selected' : ''}`}
                          onClick={() => setTableId(table._id)}
                        >
                          <div className="table-info">
                            <h4>Table {table.tableNumber}</h4>
                            <p>
                              <FiUsers /> {table.capacity} seats • {table.location}
                              {table.pricePerHour > 0 && (
                                <span className="premium"> • Premium (+${table.pricePerHour}/hr)</span>
                              )}
                            </p>
                            {table.description && (
                              <small>{table.description}</small>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-tables">
                      <p>No tables available for selected date/time. Please choose different time.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Special Requests */}
              <div className="full-width">
                <textarea
                  placeholder="Special Requests (Optional)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows="3"
                  maxLength="200"
                />
                <small className="char-count">{specialRequests.length}/200</small>
              </div>

              <button type="submit" onClick={handleReservation}>
                RESERVE NOW{" "}
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
