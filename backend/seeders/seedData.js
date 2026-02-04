import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { MenuItem } from "../models/MenuItem.js";
import { Table } from "../models/Table.js";

dotenv.config({ path: "./backend/config/config.env" });

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "restaurant",
    });
    console.log("Connected to database for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    console.log("Cleared existing data...");

    // Create sample users (customers only)
    const users = await User.create([
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        username: "johndoe",
        password: "password123",
        phone: "+1234567890",
        role: "customer"
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        username: "janesmith",
        password: "password123",
        phone: "+1234567891",
        role: "customer"
      },
      {
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike@example.com",
        username: "mikejohnson",
        password: "password123",
        phone: "+1234567892",
        role: "customer"
      },
      {
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah@example.com",
        username: "sarahwilson",
        password: "password123",
        phone: "+1234567893",
        role: "customer"
      }
    ]);

    console.log("Created sample users...");

    // Create sample tables
    const tables = await Table.create([
      {
        tableNumber: "T1",
        capacity: 2,
        location: "window",
        amenities: ["round_table"],
        description: "Cozy window table for two"
      },
      {
        tableNumber: "T2",
        capacity: 4,
        location: "indoor",
        amenities: ["square_table"],
        description: "Family table for four"
      },
      {
        tableNumber: "T3",
        capacity: 6,
        location: "indoor",
        amenities: ["round_table"],
        description: "Large round table for groups"
      },
      {
        tableNumber: "T4",
        capacity: 2,
        location: "outdoor",
        amenities: ["round_table"],
        description: "Outdoor patio seating"
      },
      {
        tableNumber: "T5",
        capacity: 8,
        location: "private",
        amenities: ["booth", "round_table"],
        pricePerHour: 25,
        description: "Private dining room"
      },
      {
        tableNumber: "B1",
        capacity: 4,
        location: "bar",
        amenities: ["high_chair"],
        description: "Bar seating area"
      }
    ]);

    console.log("Created sample tables...");

    // Create sample menu items
    const menuItems = [
      // Breakfast
      {
        name: "Classic Pancakes",
        description: "Fluffy buttermilk pancakes served with maple syrup and butter",
        price: 8.99,
        category: "Breakfast",
        image: "/item-1.jpeg",
        preparationTime: 10,
        ingredients: ["flour", "eggs", "milk", "butter", "maple syrup"],
        nutritionalInfo: { calories: 520, protein: 12, carbs: 75, fat: 18 },
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Mild",
        isPopular: true
      },
      {
        name: "French Toast",
        description: "Thick slices of brioche bread soaked in custard and grilled to perfection",
        price: 9.99,
        category: "Breakfast",
        image: "/item-4.jpeg",
        preparationTime: 12,
        ingredients: ["brioche bread", "eggs", "cream", "vanilla", "cinnamon"],
        nutritionalInfo: { calories: 580, protein: 15, carbs: 65, fat: 28 },
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Mild"
      },
      
      // Lunch
      {
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce on a toasted bun",
        price: 12.99,
        category: "Lunch",
        image: "/item-2.jpeg",
        preparationTime: 15,
        ingredients: ["beef patty", "lettuce", "tomato", "onion", "special sauce", "bun"],
        nutritionalInfo: { calories: 650, protein: 35, carbs: 45, fat: 35 },
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "Mild",
        isPopular: true
      },
      {
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables and vegan mayo",
        price: 11.99,
        category: "Lunch",
        image: "/item-5.jpeg",
        preparationTime: 12,
        ingredients: ["plant-based patty", "lettuce", "tomato", "vegan mayo", "bun"],
        nutritionalInfo: { calories: 480, protein: 20, carbs: 55, fat: 18 },
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "Mild"
      },
      
      // Dinner
      {
        name: "Grilled Chicken",
        description: "Tender grilled chicken breast with herbs and spices",
        price: 16.99,
        category: "Dinner",
        image: "/item-10.jpeg",
        preparationTime: 25,
        ingredients: ["chicken breast", "herbs", "spices", "olive oil"],
        nutritionalInfo: { calories: 420, protein: 45, carbs: 5, fat: 18 },
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "Medium",
        isPopular: true
      },
      {
        name: "Pasta Primavera",
        description: "Fresh pasta with seasonal vegetables in a light cream sauce",
        price: 14.99,
        category: "Dinner",
        image: "/dinner2.png",
        preparationTime: 20,
        ingredients: ["pasta", "mixed vegetables", "cream", "parmesan", "herbs"],
        nutritionalInfo: { calories: 580, protein: 15, carbs: 85, fat: 18 },
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Mild"
      },
      
      // Beverages
      {
        name: "Strawberry Shake",
        description: "Creamy milkshake made with fresh strawberries and vanilla ice cream",
        price: 5.99,
        category: "Beverages",
        image: "/item-3.jpeg",
        preparationTime: 5,
        ingredients: ["fresh strawberries", "vanilla ice cream", "milk", "whipped cream"],
        nutritionalInfo: { calories: 380, protein: 8, carbs: 55, fat: 15 },
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Mild"
      },
      {
        name: "Fresh Lemonade",
        description: "Freshly squeezed lemon juice with a hint of mint",
        price: 3.99,
        category: "Beverages",
        image: "/item-6.jpeg",
        preparationTime: 3,
        ingredients: ["fresh lemons", "sugar", "water", "mint"],
        nutritionalInfo: { calories: 120, protein: 0, carbs: 30, fat: 0 },
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "Mild"
      },
      
      // Desserts
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake with chocolate frosting",
        price: 6.99,
        category: "Desserts",
        image: "/dinner3.png",
        preparationTime: 5,
        ingredients: ["chocolate", "flour", "eggs", "butter", "sugar"],
        nutritionalInfo: { calories: 450, protein: 6, carbs: 65, fat: 20 },
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Mild",
        isNewItem: true
      },
      
      // Appetizers
      {
        name: "Chicken Wings",
        description: "Crispy chicken wings with your choice of sauce",
        price: 9.99,
        category: "Appetizers",
        image: "/item-7.jpeg",
        preparationTime: 15,
        ingredients: ["chicken wings", "flour", "spices", "sauce"],
        nutritionalInfo: { calories: 320, protein: 25, carbs: 10, fat: 20 },
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "Hot"
      }
    ];

    await MenuItem.create(menuItems);
    console.log("Created sample menu items...");

    console.log("✅ Single Restaurant Database seeded successfully!");
    console.log("\n📊 Sample Data Created:");
    console.log(`👥 Users: ${users.length} (All Customers)`);
    console.log(`🪑 Tables: ${tables.length}`);
    console.log(`🍽️  Menu Items: ${menuItems.length}`);
    console.log("\n🔐 Sample Login Credentials (All Customers):");
    console.log("Customer 1: john@example.com / password123");
    console.log("Customer 2: jane@example.com / password123");
    console.log("Customer 3: mike@example.com / password123");
    console.log("Customer 4: sarah@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();