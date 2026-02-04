import { Table } from "../models/Table.js";
import { Reservation } from "../models/reservationSchema.js";
import ErrorHandler from "../error/error.js";

// Get all tables
export const getTables = async (req, res, next) => {
  try {
    const { date, time, partySize } = req.query;
    
    let query = {};
    
    // If checking availability for specific date/time
    if (date && time) {
      const reservationDate = new Date(date);
      
      // Find tables that are not reserved at this time
      const reservedTables = await Reservation.find({
        date: {
          $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
          $lt: new Date(reservationDate.setHours(23, 59, 59, 999))
        },
        time: time,
        status: { $in: ['confirmed', 'seated'] }
      }).select('table');
      
      const reservedTableIds = reservedTables.map(r => r.table).filter(Boolean);
      
      query._id = { $nin: reservedTableIds };
    }
    
    // Filter by party size
    if (partySize) {
      query.capacity = { $gte: parseInt(partySize) };
    }
    
    query.isAvailable = true;
    
    const tables = await Table.find(query).sort({ tableNumber: 1 });
    
    res.status(200).json({
      success: true,
      tables,
      total: tables.length
    });
  } catch (error) {
    next(error);
  }
};

// Get single table
export const getTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return next(new ErrorHandler("Table not found", 404));
    }
    
    res.status(200).json({
      success: true,
      table
    });
  } catch (error) {
    next(error);
  }
};

// Create table (admin only)
export const createTable = async (req, res, next) => {
  try {
    const table = new Table(req.body);
    await table.save();
    
    res.status(201).json({
      success: true,
      message: "Table created successfully",
      table
    });
  } catch (error) {
    next(error);
  }
};

// Update table
export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!table) {
      return next(new ErrorHandler("Table not found", 404));
    }
    
    res.status(200).json({
      success: true,
      message: "Table updated successfully",
      table
    });
  } catch (error) {
    next(error);
  }
};

// Delete table
export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    
    if (!table) {
      return next(new ErrorHandler("Table not found", 404));
    }
    
    res.status(200).json({
      success: true,
      message: "Table deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get table availability for a specific date
export const getTableAvailability = async (req, res, next) => {
  try {
    const { date } = req.params;
    const reservationDate = new Date(date);
    
    // Get all tables
    const allTables = await Table.find({ isAvailable: true });
    
    // Get all reservations for this date
    const reservations = await Reservation.find({
      date: {
        $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
        $lt: new Date(reservationDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['confirmed', 'seated'] }
    }).populate('table');
    
    // Create availability map
    const availability = {};
    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
      '21:00', '21:30', '22:00'
    ];
    
    allTables.forEach(table => {
      availability[table._id] = {};
      timeSlots.forEach(slot => {
        availability[table._id][slot] = true;
      });
    });
    
    // Mark reserved slots as unavailable
    reservations.forEach(reservation => {
      if (reservation.table) {
        const tableId = reservation.table._id.toString();
        const reservationTime = reservation.time;
        const duration = reservation.duration || 2; // default 2 hours
        
        // Block the reserved time slot and duration
        const startTime = timeSlots.indexOf(reservationTime);
        if (startTime !== -1) {
          for (let i = 0; i < duration * 2; i++) { // 30-minute slots
            const slotIndex = startTime + i;
            if (slotIndex < timeSlots.length) {
              availability[tableId][timeSlots[slotIndex]] = false;
            }
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      date,
      tables: allTables,
      availability,
      timeSlots
    });
  } catch (error) {
    next(error);
  }
};