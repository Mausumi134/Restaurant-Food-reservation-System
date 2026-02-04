import ErrorHandler from "../error/error.js";
import { Reservation } from "../models/reservationSchema.js";
import { Table } from "../models/Table.js";

export const sendReservation = async (req, res, next) => {
  const { 
    firstName, lastName, email, date, time, phone, partySize, 
    tableId, specialRequests, occasion, preOrderItems 
  } = req.body;
  
  if (!firstName || !lastName || !email || !date || !time || !phone || !partySize) {
    return next(new ErrorHandler("Please fill all required fields!", 400));
  }

  try {
    const reservationDate = new Date(date);
    
    // Check if table is available
    if (tableId) {
      const table = await Table.findById(tableId);
      if (!table || !table.isAvailable) {
        return next(new ErrorHandler("Selected table is not available", 400));
      }
      
      // Check if table is already reserved at this time
      const existingReservation = await Reservation.findOne({
        table: tableId,
        date: {
          $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
          $lt: new Date(reservationDate.setHours(23, 59, 59, 999))
        },
        time: time,
        status: { $in: ['confirmed', 'seated'] }
      });
      
      if (existingReservation) {
        return next(new ErrorHandler("Table is already reserved at this time", 400));
      }
      
      // Check if table capacity is sufficient
      if (table.capacity < partySize) {
        return next(new ErrorHandler("Table capacity is insufficient for party size", 400));
      }
    }
    
    const reservation = await Reservation.create({
      customer: req.user?._id,
      firstName,
      lastName,
      email,
      date: reservationDate,
      time,
      phone,
      partySize,
      table: tableId,
      specialRequests,
      occasion,
      preOrderItems
    });
    
    await reservation.populate('table');
    
    res.status(200).json({
      success: true,
      message: "Reservation sent successfully!",
      reservation
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }
    return next(error);
  }
};

// Get user's reservations
export const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ customer: req.user._id })
      .populate('table')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      reservations
    });
  } catch (error) {
    next(error);
  }
};

// Get single reservation
export const getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('table')
      .populate('preOrderItems.menuItem');
    
    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }
    
    // Check if user owns this reservation
    if (reservation.customer.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to view this reservation", 403));
    }
    
    res.status(200).json({
      success: true,
      reservation
    });
  } catch (error) {
    next(error);
  }
};

// Update reservation status (admin only)
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { status, restaurantNotes } = req.body;
    
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }
    
    reservation.status = status;
    if (restaurantNotes) reservation.restaurantNotes = restaurantNotes;
    
    // Set check-in time when seated
    if (status === 'seated' && !reservation.checkInTime) {
      reservation.checkInTime = new Date();
    }
    
    // Set check-out time when completed
    if (status === 'completed' && !reservation.checkOutTime) {
      reservation.checkOutTime = new Date();
    }
    
    await reservation.save();
    
    res.status(200).json({
      success: true,
      message: "Reservation status updated successfully",
      reservation
    });
  } catch (error) {
    next(error);
  }
};

// Cancel reservation
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }
    
    // Check if user owns this reservation
    if (reservation.customer.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to cancel this reservation", 403));
    }
    
    // Check if reservation can be cancelled
    if (['completed', 'cancelled'].includes(reservation.status)) {
      return next(new ErrorHandler("Cannot cancel this reservation", 400));
    }
    
    reservation.status = 'cancelled';
    await reservation.save();
    
    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get all reservations (admin)
export const getAllReservations = async (req, res, next) => {
  try {
    const { date, status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (date) {
      const reservationDate = new Date(date);
      query.date = {
        $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
        $lt: new Date(reservationDate.setHours(23, 59, 59, 999))
      };
    }
    if (status) query.status = status;
    
    const reservations = await Reservation.find(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('table')
      .sort({ date: -1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Reservation.countDocuments(query);
    
    res.status(200).json({
      success: true,
      reservations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

export default sendReservation;

