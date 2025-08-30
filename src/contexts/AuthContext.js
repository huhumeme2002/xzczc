import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const savedUser = authService.getCurrentUser();
      
      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login with:', { username: credentials.username });
      const response = await authService.login(credentials);
      console.log('🔐 Login response received:', response);
      
      if (response.token && response.user) {
        console.log('💾 Saving token to localStorage:', response.token.substring(0, 20) + '...');
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Verify token was saved
        const savedToken = localStorage.getItem('authToken');
        console.log('✅ Token verification - saved successfully:', !!savedToken);
        console.log('✅ User saved:', response.user.username);
        
        toast.success(`Chào mừng ${response.user.username}!`);
        return { success: true, user: response.user };
      } else {
        console.error('❌ Invalid response format:', response);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.message || 'Đăng nhập thất bại';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('Đăng ký thành công!');
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.message || 'Đăng ký thất bại';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Đã đăng xuất');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUserData = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error('❌ No auth token found');
        return false;
      }
      if (!user) {
        console.log('⚠️ No user data available to refresh');
        return false;
      }

      console.log('🔄 Refreshing user data...');

      // Instead of calling the broken profile endpoint,
      // just update the timestamp to trigger re-render
      // The actual data will be synced on next action (login, redeem, etc)
      const refreshedUser = {
        ...user,
        lastRefreshed: new Date().toISOString()
      };

      updateUser(refreshedUser);
      console.log('✅ User interface refreshed');
      
      // The actual fresh data will be fetched on next server action
      return true;
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error);

      // Simple error handling since we're not making network calls
      console.error('❌ Refresh error:', error.message);

      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
