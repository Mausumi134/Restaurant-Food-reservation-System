import { Order } from "../models/Order.js";
import { MenuItem } from "../models/MenuItem.js";
import ErrorHandler from "../error/error.js";

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const { items, orderType, deliveryAddress, scheduledFor, customerNotes, tip, tableId, reservationId } = req.body;

    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    if (!items || items.length === 0) {
      return next(new ErrorHandler("No items in order", 400));
    }

    // Validate and calculate order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return next(new ErrorHandler(`Menu item ${item.menuItemId} not available`, 400));
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions || ""
      });
    }

    // Check minimum order amount for delivery
    const minimumOrderAmount = 15.00;
    if (orderType === 'delivery' && subtotal < minimumOrderAmount) {
      return next(new ErrorHandler(`Minimum order amount for delivery is $${minimumOrderAmount}`, 400));
    }

    // Calculate fees and total
    const deliveryFee = orderType === 'delivery' ? 5.99 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax + (tip || 0);

    // Calculate estimated delivery time
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 
      (orderType === 'delivery' ? 45 : 25)); // 45 min for delivery, 25 for pickup

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      orderType,
      subtotal,
      deliveryFee,
      tax,
      tip: tip || 0,
      total,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      estimatedDeliveryTime: scheduledFor || estimatedDeliveryTime,
      scheduledFor,
      customerNotes,
      table: tableId,
      reservation: reservationId
    });

    await order.save();

    // Populate order details for response
    await order.populate([
      { path: 'items.menuItem', select: 'name price image' },
      { path: 'table', select: 'tableNumber location' },
      { path: 'reservation', select: 'date time' }
    ]);

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      order
    });
  } catch (error) {
    next(error);
  }
};

// Get user's orders
export const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { customer: req.user._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.menuItem', 'name price image')
      .populate('table', 'tableNumber location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name price image description')
      .populate('customer', 'firstName lastName email phone')
      .populate('assignedDriver', 'firstName lastName phone')
      .populate('table', 'tableNumber location capacity')
      .populate('reservation');

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    // Check if user owns this order
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to view this order", 403));
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (for admins)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, restaurantNotes } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    // Check authorization
    if (req.user.role !== 'admin' && req.user.role !== 'restaurant_owner') {
      return next(new ErrorHandler("Not authorized to update order status", 403));
    }

    order.status = status;
    if (restaurantNotes) order.restaurantNotes = restaurantNotes;

    // Set actual delivery time when delivered
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to cancel this order", 403));
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return next(new ErrorHandler("Cannot cancel this order", 400));
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (for restaurant dashboard)
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, date, orderType } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (orderType) query.orderType = orderType;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName phone')
      .populate('items.menuItem', 'name price')
      .populate('table', 'tableNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};