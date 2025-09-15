import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      const token = sessionStorage.getItem('adminToken');
      const userStr = sessionStorage.getItem('adminUser');

      if (!token || !userStr) {
        setAdminUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        setAdminUser(user);
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
        setAdminUser(null);
      }

      setIsLoading(false);
    };

    checkAdminAuth();
  }, []);

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    setAdminUser(null);
    navigate('/admin/login');
  };

  const isAuthenticated = !!adminUser && !!sessionStorage.getItem('adminToken');

  return {
    adminUser,
    isAuthenticated,
    isLoading,
    logout,
  };
};
