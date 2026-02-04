# 🍽️ Complete Restaurant Food Ordering & Reservation System

A full-stack restaurant platform with ordering, delivery, payments, and reservation management.

## 🚀 **Features**

### **Customer Features**
- 🔐 User authentication with JWT
- 🏪 Browse restaurants by location, cuisine, rating
- 🍽️ Dynamic menu with categories and filters
- 🛒 Shopping cart with special instructions
- 📦 Order placement (delivery/pickup/dine-in)
- 💳 Payment integration (Stripe ready)
- 📱 Order tracking and history
- 📅 Table reservations
- ⭐ Reviews and ratings

### **Restaurant Owner Features**
- 🏢 Restaurant profile management
- 📋 Menu item management
- 📊 Order management dashboard
- 📈 Sales analytics
- 🔄 Real-time order status updates
- 💰 Revenue tracking

### **Admin Features**
- 👥 User management
- 🏪 Restaurant management
- 📦 Order oversight
- 💸 Refund processing

## 🛠️ **Tech Stack**

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt password hashing
- Stripe payment integration
- Socket.io (ready for real-time)

### **Frontend**
- React.js 18
- React Router v6
- Context API (Auth & Cart)
- Bootstrap 5
- Axios for API calls
- React Hot Toast

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
| Customer | john@example.com | password123 |
| Restaurant Owner | jane@restaurant.com | password123 |
| Admin | admin@restaurant.com | password123 |

## 📱 **Access URLs**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/v1/health

## 🗂️ **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### **Restaurants**
- `GET /api/v1/restaurants` - List restaurants
- `GET /api/v1/restaurants/:id` - Get restaurant details
- `POST /api/v1/restaurants` - Create restaurant (owner)

### **Menu**
- `GET /api/v1/menu` - List menu items
- `GET /api/v1/menu/restaurant/:id` - Get restaurant menu
- `POST /api/v1/menu` - Create menu item (owner)

### **Orders**
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/my-orders` - User's orders
- `GET /api/v1/orders/:id` - Order details
- `PATCH /api/v1/orders/:id/status` - Update status (owner)

### **Payments**
- `POST /api/v1/payments/create-intent` - Create payment
- `POST /api/v1/payments/confirm` - Confirm payment
- `GET /api/v1/payments/history` - Payment history

### **Reservations**
- `POST /api/v1/reservation/send` - Make reservation

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

1. **Customer** browses restaurants and adds items to cart
2. **Customer** proceeds to checkout and places order
3. **Restaurant** receives order notification
4. **Restaurant** confirms and updates order status
5. **Customer** receives real-time status updates
6. **Order** progresses: Confirmed → Preparing → Ready → Delivered

## 🎯 **User Roles & Permissions**

### **Customer**
- Browse restaurants and menus
- Place orders and make reservations
- Track order status
- View order history
- Leave reviews

### **Restaurant Owner**
- Manage restaurant profile
- Add/edit menu items
- Process incoming orders
- Update order status
- View sales analytics

### **Admin**
- Full system access
- User management
- Restaurant oversight
- Order management
- Refund processing

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
- 3 users (customer, restaurant owner, admin)
- 2 restaurants with different cuisines
- 8 menu items across categories
- Complete restaurant profiles with operating hours

## 🔮 **Future Enhancements**

- Real-time order tracking with Socket.io
- Push notifications
- Mobile app (React Native)
- Advanced analytics dashboard
- Multi-language support
- Loyalty program
- Driver tracking for delivery
- Inventory management
- Email notifications
- Social media integration

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
- Check the API documentation
- Review the demo credentials above

---

**🎉 Enjoy your complete restaurant management system!**