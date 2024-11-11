// Sidebar.js
import React from 'react';
import { Box, List, ListItem, ListItemText, Divider, Drawer, IconButton, ListItemIcon, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ChevronLeft, Dashboard, People, AccountCircle, Settings } from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
const Sidebar = ({ open, onClose }) => {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 240,
                    backgroundColor: '#1e2125',
                    color: '#FFFFFF',
                    boxSizing: 'border-box',
                },
            }}
        >
            {/* Close Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <IconButton onClick={onClose} sx={{ color: '#FFFFFF' }}>
                    <ChevronLeft />
                </IconButton>
            </Box>

            {/* Sidebar Header */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#FFB300', fontWeight: 'bold' }}>Admin Panel</Typography>
            </Box>
            
            {/* Sidebar Navigation Links */}
            <List>
                <ListItem button component={Link} to="/dashboard" sx={{ color: '#FFFFFF' }}>
                    <ListItemIcon sx={{ color: '#FFB300' }}>
                        <Dashboard />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                
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
                <ListItem button component={Link} to="/task" sx={{ color: '#FFFFFF' }}>
                    <ListItemIcon sx={{ color: '#FFB300' }}>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tasks" />
                </ListItem>
                
                <ListItem button component={Link} to="/profile" sx={{ color: '#FFFFFF' }}>
                    <ListItemIcon sx={{ color: '#FFB300' }}>
                        <AccountCircle />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                
                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />
                
                <ListItem button component={Link} to="/settings" sx={{ color: '#FFFFFF' }}>
                    <ListItemIcon sx={{ color: '#FFB300' }}>
                        <Settings />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
