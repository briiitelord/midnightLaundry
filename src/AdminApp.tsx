import { useState, useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { decryptPassword } from './utils/encryption';
import { ENCRYPTED_ADMIN_PASSWORD } from './config/adminConfig';

function AdminApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Decrypt the admin password for verification
  const getAdminPassword = (): string => {
    return decryptPassword(ENCRYPTED_ADMIN_PASSWORD);
  };

  // Check if user was previously logged in
  useEffect(() => {
    const adminStatus = localStorage.getItem('adminLoggedIn');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = async (password: string) => {
    setIsLoading(true);
    // Simulate auth check
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (password === getAdminPassword()) {
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      alert('Invalid password');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '/';
  };

  if (!isAdmin) {
    return <AdminLogin onLogin={handleAdminLogin} isLoading={isLoading} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

export default AdminApp;
