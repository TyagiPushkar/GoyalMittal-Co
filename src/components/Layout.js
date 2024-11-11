import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For route change detection
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation(); // Get the current location object

    // Open the sidebar
    const handleSidebarOpen = () => {
        setSidebarOpen(true);
    };

    // Close the sidebar
    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    // Close the sidebar when the route changes
    useEffect(() => {
        // Close the sidebar whenever the route changes
        handleSidebarClose();
    }, [location]); // Runs every time the route changes

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
            
            <div style={{ flexGrow: 1 }}>
                {/* Navbar */}
                <Navbar onMenuClick={handleSidebarOpen} />

                {/* Main Content Area */}
                <main style={{ padding: '20px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
