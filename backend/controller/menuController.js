import { MenuItem } from "../models/MenuItem.js";
import ErrorHandler from "../error/error.js";

// Get all menu items with filters
export const getMenuItems = async (req, res, next) => {
  try {
    const { 
      category, 
      isVegetarian, 
      isVegan, 
      minPrice, 
      maxPrice, 
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    const query = { isAvailable: true };
    
    if (category) query.category = category;
    if (isVegetarian === 'true') query.isVegetarian = true;
    if (isVegan === 'true') query.isVegan = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const menuItems = await MenuItem.find(query)
      .sort({ isPopular: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MenuItem.countDocuments(query);

    res.status(200).json({
      success: true,
      menuItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

// Get single menu item
export const getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return next(new ErrorHandler("Menu item not found", 404));
    }

    res.status(200).json({
      success: true,
      menuItem
    });
  } catch (error) {
    next(error);
  }
};

// Create menu item (admin only)
export const createMenuItem = async (req, res, next) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem
    });
  } catch (error) {
    next(error);
  }
};

// Update menu item
export const updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return next(new ErrorHandler("Menu item not found", 404));
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem
    });
  } catch (error) {
    next(error);
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return next(new ErrorHandler("Menu item not found", 404));
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get menu by category
export const getMenuByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = { isAvailable: true };
    if (category) query.category = category;

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    // Group by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      menu: menuByCategory,
      totalItems: menuItems.length
    });
  } catch (error) {
    next(error);
  }
};

// Toggle menu item availability
export const toggleAvailability = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return next(new ErrorHandler("Menu item not found", 404));
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: `Menu item ${menuItem.isAvailable ? 'enabled' : 'disabled'} successfully`,
      isAvailable: menuItem.isAvailable
    });
  } catch (error) {
    next(error);
  }
};

// Get popular items
export const getPopularItems = async (req, res, next) => {
  try {
    const popularItems = await MenuItem.find({ 
      isAvailable: true, 
      isPopular: true 
    }).limit(8);

    res.status(200).json({
      success: true,
      items: popularItems
    });
  } catch (error) {
    next(error);
  }
};