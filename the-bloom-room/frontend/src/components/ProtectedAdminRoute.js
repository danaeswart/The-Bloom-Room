import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Wrap admin-only pages with this component
export default function ProtectedAdminRoute({ children }) {
  const { user } = useContext(UserContext);
  // fallback to localStorage if context not populated (on refresh)
  let localUser = null;
  try {
    const s = localStorage.getItem('user');
    localUser = s ? JSON.parse(s) : null;
  } catch (e) {
    localUser = null;
  }
  const activeUser = user || localUser;
  const rawRole = activeUser && (activeUser.Role || activeUser.role || activeUser.roleName);
  const role = rawRole ? String(rawRole).toLowerCase() : null;

  if (!activeUser || role !== 'admin') {
    // not authorized
    return <Navigate to="/login" replace />;
  }

  return children;
}
