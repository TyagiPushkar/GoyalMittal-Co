// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import { Menu } from '@mui/icons-material';

const Navbar = ({ onMenuClick }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user ? user.Name : 'Guest';

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#1e2125', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo / Brand Name */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFB300' }}>
                    Goyal Mittal & Co.
                </Typography>
                
                {/* User Greeting and Avatar */}
                <Box display="flex" alignItems="center" sx={{ color: '#FFFFFF', gap:'10px' }}>
                    <Avatar sx={{ bgcolor: '#FFB300' }}>{username.charAt(0).toUpperCase()}</Avatar>
                    <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                        Hello, {username}
                    </Typography>
                </Box>
                
                {/* Menu Button */}
                <IconButton color="inherit" edge="end" onClick={onMenuClick} sx={{ marginLeft: 1 }}>
                    <Menu />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
