import Stripe from 'stripe';
import { Payment } from "../models/Payment.js";
import { Order } from "../models/Order.js";
import ErrorHandler from "../error/error.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId, paymentMethod = 'stripe' } = req.body;

    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to pay for this order", 403));
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return next(new ErrorHandler("Order is already paid", 400));
    }

    let paymentIntent;
    let payment;

    if (paymentMethod === 'stripe') {
      // Create Stripe payment intent
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          customerId: req.user._id.toString()
        }
      });

      // Create payment record
      payment = new Payment({
        order: orderId,
        customer: req.user._id,
        amount: order.total,
        paymentMethod: 'stripe',
        paymentGateway: 'stripe',
        transactionId: paymentIntent.id,
        paymentStatus: 'pending'
      });
    } else if (paymentMethod === 'cash') {
      // For cash payments (pickup/dine-in only)
      if (order.orderType === 'delivery') {
        return next(new ErrorHandler("Cash payment not available for delivery orders", 400));
      }

      payment = new Payment({
        order: orderId,
        customer: req.user._id,
        amount: order.total,
        paymentMethod: 'cash',
        paymentGateway: 'cash',
        paymentStatus: 'pending'
      });
    }

    await payment.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent?.client_secret,
      paymentId: payment._id,
      amount: order.total
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment
export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentId, paymentIntentId } = req.body;

    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }

    // Check if user owns this payment
    if (payment.customer.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized", 403));
    }

    if (payment.paymentMethod === 'stripe') {
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        payment.paymentStatus = 'completed';
        payment.processedAt = new Date();
        payment.gatewayResponse = paymentIntent;
        
        // Update order payment status
        const order = await Order.findById(payment.order._id);
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      } else {
        payment.paymentStatus = 'failed';
        payment.failureReason = 'Payment not completed';
      }
    } else if (payment.paymentMethod === 'cash') {
      // Cash payment confirmation (usually done by restaurant)
      payment.paymentStatus = 'completed';
      payment.processedAt = new Date();
      
      const order = await Order.findById(payment.order._id);
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      paymentStatus: payment.paymentStatus
    });
  } catch (error) {
    next(error);
  }
};

// Get payment details
export const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order', 'orderNumber total status')
      .populate('customer', 'firstName lastName email');

    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }

    // Check authorization
    if (payment.customer._id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to view this payment", 403));
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// Get user's payment history
export const getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const payments = await Payment.find({ customer: req.user._id })
      .populate('order', 'orderNumber total status createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments({ customer: req.user._id });

    res.status(200).json({
      success: true,
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

// Process refund
export const processRefund = async (req, res, next) => {
  try {
    const { paymentId, refundAmount, refundReason } = req.body;

    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }

    // Check authorization (admin or restaurant owner)
    if (req.user.role !== 'admin' && req.user.role !== 'restaurant_owner') {
      return next(new ErrorHandler("Not authorized to process refunds", 403));
    }

    // Check if payment can be refunded
    if (payment.paymentStatus !== 'completed') {
      return next(new ErrorHandler("Payment cannot be refunded", 400));
    }

    const refundAmountToProcess = refundAmount || payment.amount;

    if (payment.paymentMethod === 'stripe') {
      // Process Stripe refund
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: Math.round(refundAmountToProcess * 100) // Convert to cents
      });

      payment.paymentStatus = 'refunded';
      payment.refundAmount = refundAmountToProcess;
      payment.refundReason = refundReason;
      payment.refundedAt = new Date();
      payment.gatewayResponse = { ...payment.gatewayResponse, refund };
    } else {
      // Cash refund
      payment.paymentStatus = 'refunded';
      payment.refundAmount = refundAmountToProcess;
      payment.refundReason = refundReason;
      payment.refundedAt = new Date();
    }

    await payment.save();

    // Update order payment status
    const order = await Order.findById(payment.order._id);
    order.paymentStatus = 'refunded';
    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refundAmount: refundAmountToProcess
    });
  } catch (error) {
    next(error);
  }
};