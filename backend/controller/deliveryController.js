import { DeliveryTracking } from "../models/DeliveryTracking.js";
import { Order } from "../models/Order.js";
import ErrorHandler from "../error/error.js";

// Create delivery tracking
export const createDeliveryTracking = async (req, res, next) => {
  try {
    const { orderId, driverInfo, estimatedDeliveryTime } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }
    
    if (order.orderType !== 'delivery') {
      return next(new ErrorHandler("Order is not for delivery", 400));
    }
    
    const deliveryTracking = new DeliveryTracking({
      order: orderId,
      driver: driverInfo,
      estimatedDeliveryTime,
      currentLocation: {
        latitude: 40.7128, // Restaurant location (NYC example)
        longitude: -74.0060,
        address: "Restaurant Location",
        lastUpdated: new Date()
      }
    });
    
    await deliveryTracking.save();
    
    // Update order status
    order.status = 'out-for-delivery';
    order.assignedDriver = driverInfo.id;
    await order.save();
    
    res.status(201).json({
      success: true,
      message: "Delivery tracking created successfully",
      tracking: deliveryTracking
    });
  } catch (error) {
    next(error);
  }
};

// Get delivery tracking by order ID
export const getDeliveryTracking = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const tracking = await DeliveryTracking.findOne({ order: orderId })
      .populate('order', 'orderNumber customer deliveryAddress estimatedDeliveryTime');
    
    if (!tracking) {
      return next(new ErrorHandler("Delivery tracking not found", 404));
    }
    
    res.status(200).json({
      success: true,
      tracking
    });
  } catch (error) {
    next(error);
  }
};

// Update delivery location (for driver app)
export const updateDeliveryLocation = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { latitude, longitude, address } = req.body;
    
    const tracking = await DeliveryTracking.findOne({ order: orderId });
    if (!tracking) {
      return next(new ErrorHandler("Delivery tracking not found", 404));
    }
    
    // Update current location
    tracking.currentLocation = {
      latitude,
      longitude,
      address,
      lastUpdated: new Date()
    };
    
    // Add to route history
    tracking.deliveryRoute.push({
      latitude,
      longitude,
      timestamp: new Date()
    });
    
    await tracking.save();
    
    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      currentLocation: tracking.currentLocation
    });
  } catch (error) {
    next(error);
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryNotes, deliveryPhotos } = req.body;
    
    const tracking = await DeliveryTracking.findOne({ order: orderId });
    if (!tracking) {
      return next(new ErrorHandler("Delivery tracking not found", 404));
    }
    
    tracking.status = status;
    if (deliveryNotes) tracking.deliveryNotes = deliveryNotes;
    if (deliveryPhotos) tracking.deliveryPhotos = deliveryPhotos;
    
    // If delivered, set actual delivery time
    if (status === 'delivered') {
      tracking.actualDeliveryTime = new Date();
      
      // Update order status
      const order = await Order.findById(orderId);
      order.status = 'delivered';
      order.actualDeliveryTime = new Date();
      await order.save();
    }
    
    await tracking.save();
    
    res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      tracking
    });
  } catch (error) {
    next(error);
  }
};

// Get all active deliveries (for restaurant dashboard)
export const getActiveDeliveries = async (req, res, next) => {
  try {
    const activeDeliveries = await DeliveryTracking.find({
      status: { $in: ['assigned', 'picked_up', 'on_the_way', 'nearby'] }
    }).populate('order', 'orderNumber customer deliveryAddress total');
    
    res.status(200).json({
      success: true,
      deliveries: activeDeliveries
    });
  } catch (error) {
    next(error);
  }
};

// Calculate estimated delivery time based on distance
export const calculateDeliveryTime = async (req, res, next) => {
  try {
    const { customerLat, customerLng } = req.body;
    
    // Restaurant location (example coordinates)
    const restaurantLat = 40.7128;
    const restaurantLng = -74.0060;
    
    // Calculate distance using Haversine formula
    const distance = calculateDistance(restaurantLat, restaurantLng, customerLat, customerLng);
    
    // Estimate delivery time (base time + travel time)
    const basePreparationTime = 20; // minutes
    const averageSpeed = 30; // km/h in city
    const travelTime = (distance / averageSpeed) * 60; // convert to minutes
    
    const estimatedTime = basePreparationTime + travelTime;
    const deliveryFee = calculateDeliveryFee(distance);
    
    res.status(200).json({
      success: true,
      distance: Math.round(distance * 100) / 100, // round to 2 decimal places
      estimatedTime: Math.round(estimatedTime),
      deliveryFee,
      estimatedDeliveryTime: new Date(Date.now() + estimatedTime * 60000)
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Helper function to calculate delivery fee based on distance
function calculateDeliveryFee(distance) {
  if (distance <= 2) return 2.99;
  if (distance <= 5) return 4.99;
  if (distance <= 10) return 6.99;
  return 8.99;
}