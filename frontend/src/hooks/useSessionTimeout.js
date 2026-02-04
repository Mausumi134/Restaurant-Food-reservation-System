import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useSessionTimeout = (timeoutMinutes = 30) => {
  const { isAuthenticated, logout } = useAuth();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    if (isAuthenticated) {
      // Show warning 5 minutes before timeout
      warningRef.current = setTimeout(() => {
        toast('Your session will expire in 5 minutes due to inactivity', {
          duration: 10000,
          icon: '⚠️'
        });
      }, (timeoutMinutes - 5) * 60 * 1000);

      // Auto logout after timeout
      timeoutRef.current = setTimeout(() => {
        toast.error('Session expired due to inactivity');
        logout();
      }, timeoutMinutes * 60 * 1000);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimeoutHandler = () => {
      resetTimeout();
    };

    // Set initial timeout
    resetTimeout();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimeoutHandler, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeoutHandler, true);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [isAuthenticated, timeoutMinutes]);

  return { resetTimeout };
};

export default useSessionTimeout;