// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFB300', // Match the sidebar's accent color
    },
    background: {
      default: '#1e2125', // Dark background for page
      paper: '#2a2d33', // Dark background for form container
    },
    text: {
      primary: '#FFFFFF', // White text for better contrast
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://namami-infotech.com/GoyalMittal&CoBackend/src/auth/login.php', {
        identifier,
        password,
      });

      if (response.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setTimeout(() => {
          setLoading(false);
          navigate('/task');
        }, 1500);
      } else {
        setLoading(false);
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', justifyContent: 'center',bgcolor: 'background.default' }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={10} sx={{ padding: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.primary' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" align="center" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Login to Dashboard
                </Typography>
                {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Username (EmpId / Mobile / Email)"
                    margin="normal"
                    variant="outlined"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    InputProps={{ style: { color: '#FFF' } }}
                    InputLabelProps={{ style: { color: '#FFB300' } }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: 'primary.main' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: { color: '#FFF' },
                    }}
                    InputLabelProps={{ style: { color: '#FFB300' } }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 3, py: 1.5, fontWeight: 'bold', color: '#1e2125' }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                  </Button>
                </form>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
