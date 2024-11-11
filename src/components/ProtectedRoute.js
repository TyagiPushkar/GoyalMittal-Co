import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));  // Get the user data from localStorage

    // If there's no user, redirect to the login page
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;  // If the user exists, show the protected content
};

export default ProtectedRoute;
