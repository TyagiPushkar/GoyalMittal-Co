// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, Menu, MenuItem, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Assignment as AssignmentIcon, People as PeopleIcon, Apartment as ApartmentIcon, Logout as LogoutIcon } from '@mui/icons-material';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user ? user.Name : 'Guest';
    const isAdmin = user?.Role === "Admin";
    const [anchorEl, setAnchorEl] = React.useState(null);

    // Handle Menu open and close
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#1e2125' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFB300' }}>
                    Goyal Mittal & Co.
                </Typography>

                <Box display="flex" alignItems="center" sx={{ color: '#FFFFFF' }}>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>
                        Hello, {username}
                    </Typography>
                    <Avatar sx={{ bgcolor: '#FFB300', mr: 2 }}>{username.charAt(0).toUpperCase()}</Avatar>
                    
                    <IconButton onClick={handleMenuOpen} color="inherit">
                        <AssignmentIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        {isAdmin && (
                            <>
                                <MenuItem component={Link} to="/employee" onClick={handleMenuClose}>
                                    <PeopleIcon fontSize="small" sx={{ mr: 1 }} /> Employees
                                </MenuItem>
                                <MenuItem component={Link} to="/clients" onClick={handleMenuClose}>
                                    <ApartmentIcon fontSize="small" sx={{ mr: 1 }} /> Clients
                                </MenuItem>
                            </>
                        )}
                        <MenuItem component={Link} to="/task" onClick={handleMenuClose}>
                            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> Tasks
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
