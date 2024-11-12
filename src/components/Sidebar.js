import React from 'react';
import { Box, List, ListItem, ListItemText, Divider, ListItemIcon, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { People, AccountCircle } from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
    const navigate = useNavigate();

    // Get user role from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.Role === "Admin";

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100%',
                width: 200,
                backgroundColor: '#1e2125',
                color: '#FFFFFF',
                boxSizing: 'border-box',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#FFB300', fontWeight: 'bold' }}>
                    Goyal Mittal & Co.
                </Typography>
            </Box>
            
            {/* Sidebar Navigation Links */}
            <List>
                {isAdmin && (
                    <>
                        <ListItem button component={Link} to="/employee" sx={{ color: '#FFFFFF' }}>
                            <ListItemIcon sx={{ color: '#FFB300' }}>
                                <People />
                            </ListItemIcon>
                            <ListItemText primary="Employees" />
                        </ListItem>
                        
                        <ListItem button component={Link} to="/clients" sx={{ color: '#FFFFFF' }}>
                            <ListItemIcon sx={{ color: '#FFB300' }}>
                                <ApartmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Clients" />
                        </ListItem>
                    </>
                )}
                
                <ListItem button component={Link} to="/task" sx={{ color: '#FFFFFF' }}>
                    <ListItemIcon sx={{ color: '#FFB300' }}>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tasks" />
                </ListItem>
            </List>

            {/* Profile and Logout placed at the bottom */}
            <Box>
                <List>
                    <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />
                    

                    <ListItem button onClick={handleLogout} sx={{ color: '#FFFFFF', cursor: 'pointer' }}>
                        <ListItemIcon sx={{ color: '#FFB300' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default Sidebar;
