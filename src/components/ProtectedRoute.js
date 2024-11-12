import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    // Redirect to login if the user is not authenticated
    if (!user) {
        return <Navigate to="/" />;
    }

    // Check if the user's role is in the allowed roles
    if (allowedRoles && !allowedRoles.includes(user.Role)) {
        // Redirect non-admins to the task page if they try to access restricted routes
        return <Navigate to="/task" state={{ from: location }} />;
    }

    // If authenticated and authorized, render the child components
    return children;
};

export default ProtectedRoute;
