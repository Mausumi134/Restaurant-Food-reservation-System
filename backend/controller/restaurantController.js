import { Restaurant } from "../models/Restaurant.js";
import ErrorHandler from "../error/error.js";

// Get all restaurants with filters
export const getRestaurants = async (req, res, next) => {
  try {
    const { 
      city, 
      cuisineType, 
      minRating, 
      search,
      latitude,
      longitude,
      radius = 10, // km
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (cuisineType) query.cuisineType = { $in: [cuisineType] };
    if (minRating) query.averageRating = { $gte: parseFloat(minRating) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisineType: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Location-based search
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'firstName lastName')
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      restaurants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

// Get single restaurant
export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone');

    if (!restaurant || !restaurant.isActive) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }

    res.status(200).json({
      success: true,
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

// Create restaurant (restaurant owners only)
export const createRestaurant = async (req, res, next) => {
  try {
    const restaurantData = {
      ...req.body,
      owner: req.user._id
    };

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

// Update restaurant
export const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }

    // Check authorization
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorHandler("Not authorized to update this restaurant", 403));
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant
    });
  } catch (error) {
    next(error);
  }
};

// Delete restaurant
export const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }

    // Check authorization
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorHandler("Not authorized to delete this restaurant", 403));
    }

    // Soft delete by setting isActive to false
    restaurant.isActive = false;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get user's restaurants (for restaurant owners)
export const getMyRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};