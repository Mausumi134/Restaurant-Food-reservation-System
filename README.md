# 🍽️ FOODLICKS - Single Restaurant System

A complete single restaurant platform with ordering, table reservations, delivery tracking, and customer management.

## 🚀 **Features**

### **Customer Features**
- 🔐 Customer authentication with JWT (30-min session timeout)
- 🍽️ Browse restaurant menu with categories and filters
- 🛒 Shopping cart with special instructions
- 📦 Order placement (delivery/pickup/dine-in)
- 💳 Payment integration (Stripe ready)
- 📱 Real-time order tracking and history
- 📅 Table reservations with seat selection
- 🚚 Live delivery tracking with driver information
- 📍 Multiple delivery addresses management
- 🔄 Automatic logout with confirmation dialogs

## 🛠️ **Tech Stack**

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (30-min sessions)
- Bcrypt password hashing
- Stripe payment integration
- Real-time delivery tracking

### **Frontend**
- React.js 18
- React Router v6
- Context API (Auth & Cart)
- Bootstrap 5
- Axios for API calls
- React Hot Toast
- Session timeout management

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v16+)
- MongoDB Atlas account
- Git

### **1. Clone Repository**
```bash
git clone <repository-url>
cd Restaurant-Food-reservation-System
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
```

### **4. Environment Configuration**
Update `backend/config/config.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### **5. Seed Database**
```bash
cd backend
npm run seed
```

### **6. Start Servers**

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🔐 **Demo Credentials**

| Role | Email | Password |
|------|-------|----------|
| Customer 1 | john@example.com | password123 |
| Customer 2 | jane@example.com | password123 |
| Customer 3 | mike@example.com | password123 |
| Customer 4 | sarah@example.com | password123 |

**Note**: This is a single restaurant system - all users are customers only.

## 📱 **Access URLs**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/v1/health

## 🗂️ **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/register` - Customer registration
- `POST /api/v1/auth/login` - Customer login
- `POST /api/v1/auth/logout` - Customer logout

### **Menu**
- `GET /api/v1/menu` - List all menu items
- `GET /api/v1/menu/:id` - Get menu item details

### **Orders**
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/my-orders` - Customer's orders
- `GET /api/v1/orders/:id` - Order details

### **Payments**
- `POST /api/v1/payments/create-intent` - Create payment
- `POST /api/v1/payments/confirm` - Confirm payment
- `GET /api/v1/payments/history` - Payment history

### **Reservations**
- `POST /api/v1/reservation/send` - Make table reservation
- `GET /api/v1/reservation/my-reservations` - Customer's reservations

### **Tables**
- `GET /api/v1/tables` - List available tables
- `GET /api/v1/tables/:id` - Get table details

### **Delivery Tracking**
- `GET /api/v1/delivery/track/:orderId` - Track delivery status
- `PUT /api/v1/delivery/:orderId` - Update delivery status

## 🏗️ **Project Structure**

```
Restaurant-Food-reservation-System/
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   └── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── Pages/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔄 **Order Flow**

1. **Customer** browses FOODLICKS menu and adds items to cart
2. **Customer** proceeds to checkout and places order (delivery/pickup/dine-in)
3. **System** automatically processes and confirms order
4. **Order** progresses: Confirmed → Preparing → Ready → Out for Delivery → Delivered
5. **Customer** receives real-time status updates and can track delivery
6. **Delivery tracking** shows driver info, location, and estimated delivery time

## 🎯 **System Features**

### **Single Restaurant System**
- Focused on FOODLICKS restaurant operations
- Customer-only authentication (no admin/owner roles)
- Streamlined menu management
- Integrated table reservation system
- Real-time delivery tracking

### **Table Reservation System**
- 6 different table types (2-8 capacity)
- Window, indoor, outdoor, bar, and private dining options
- Real-time availability checking
- Special amenities (booth, high chairs, etc.)

### **Delivery Tracking**
- 5-stage delivery process
- Driver information and contact details
- Real-time location updates
- Estimated delivery times
- Mobile-friendly tracking interface

### **Customer Management**
- Secure JWT authentication with 30-minute sessions
- Multiple delivery addresses
- Order history and tracking
- Reservation history
- Automatic session timeout with warnings

## 🚀 **Deployment Ready**

The application is structured for easy deployment:
- Environment-based configuration
- Production-ready build scripts
- Database connection handling
- CORS configuration
- Error handling middleware

## 🔧 **Development Commands**

```bash
# Backend
npm run dev          # Start development server
npm run start        # Start production server
npm run seed         # Seed database with sample data

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📊 **Sample Data**

The seeder creates:
- 4 customer users with different profiles
- 6 tables with varying capacities and locations
- 10 menu items across 5 categories (Breakfast, Lunch, Dinner, Beverages, Desserts, Appetizers)
- Complete table setup with amenities and pricing
- Sample delivery tracking data

### **Restaurant Information**
- **Name**: FOODLICKS
- **Location**: Downtown City
- **Cuisine**: Multi-cuisine restaurant
- **Operating Hours**: 24/7 service
- **Table Capacity**: 2-8 people per table
- **Delivery**: Available with real-time tracking

## 🔮 **Future Enhancements**

- Real-time order notifications
- Push notifications for order updates
- Mobile app (React Native)
- Advanced customer analytics
- Multi-language support
- Loyalty program with points
- GPS-based delivery tracking
- Inventory management
- Email notifications
- Social media integration
- Customer reviews and ratings
- Promotional codes and discounts

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the API documentation above
- Review the demo credentials for testing
- Use the delivery tracking system for order updates

### **Key Features to Test**
1. **Customer Registration/Login** - Use demo credentials or create new account
2. **Menu Browsing** - Browse 10+ menu items across categories
3. **Order Placement** - Test delivery, pickup, and dine-in options
4. **Table Reservations** - Reserve tables with different capacities
5. **Delivery Tracking** - Track orders with real-time updates
6. **Order History** - View past orders and their status
7. **Session Management** - Test 30-minute auto-logout feature

---

**🎉 Enjoy FOODLICKS - Your Complete Single Restaurant Experience!**