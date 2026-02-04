import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import useSessionTimeout from './hooks/useSessionTimeout';

// Pages
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Success from './Pages/Success';
import Menuitems from './Pages/Menuitems';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import OrderHistory from './Pages/OrderHistory';
import OrderDetail from './Pages/OrderDetail';
import Profile from './Pages/Profile';
import ReservationHistory from './Pages/ReservationHistory';
import DeliveryTracking from './Pages/DeliveryTracking';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';

// Styles
import './App.css'
import './login.css';
import './menuitems.css';

const AppContent = () => {
  // Session timeout hook (30 minutes)
  useSessionTimeout(30);

  return (
    <div className="App">
      <Navbar />
      <CartSidebar />
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/menuitems' element={<Menuitems/>}/>
        <Route path='/cart' element={<Cart/>}/>
        
        {/* Protected Routes */}
        <Route path='/checkout' element={
          <ProtectedRoute>
            <Checkout/>
          </ProtectedRoute>
        }/>
        <Route path='/orders' element={
          <ProtectedRoute>
            <OrderHistory/>
          </ProtectedRoute>
        }/>
        <Route path='/order/:id' element={
          <ProtectedRoute>
            <OrderDetail/>
          </ProtectedRoute>
        }/>
        <Route path='/reservations' element={
          <ProtectedRoute>
            <ReservationHistory/>
          </ProtectedRoute>
        }/>
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }/>
        <Route path='/track/:orderId' element={
          <ProtectedRoute>
            <DeliveryTracking/>
          </ProtectedRoute>
        }/>
        
        <Route path='/success' element={<Success/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
