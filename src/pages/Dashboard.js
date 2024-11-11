// Dashboard.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');  // Remove user data from localStorage
    navigate('/');  // Redirect to login page
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ mt: 5 }}>
        Welcome to the Dashboard!
      </Typography>
      <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}

export default Dashboard;
