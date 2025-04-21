import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getMyUserInfo } from '../services/userService';

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const storedUserData = JSON.parse(localStorage.getItem('userData')); // Retrieve stored user data

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token && !storedUserData) { // Fetch only if user data is not in localStorage
        try {
          const response = await getMyUserInfo(token);
          const userData = response.data;

          // Store user data (name and role) in localStorage
          localStorage.setItem('userData', JSON.stringify({
            name: userData.name,
            role: userData.role,
          }));

          // Check if the user is an admin
          if (userData.role === 'admin') {
            setIsAdmin(true);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user info:', err);
          setError('Failed to verify admin status.');
          setLoading(false);
        }
      } else if (storedUserData) {
        // If user data is already in localStorage, use it
        setIsAdmin(storedUserData.role === 'admin');
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, storedUserData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!token || !isAdmin) {
    return <Navigate to="/masuk" />;
  }

  return <Outlet />;
};

export default AdminRoute;