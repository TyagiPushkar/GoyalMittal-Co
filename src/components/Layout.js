// Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div>
            {/* Navbar at the top */}
            <Navbar />

            {/* Main content below the Navbar */}
            <main style={{ padding: '16px' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
