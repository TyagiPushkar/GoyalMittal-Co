import React, { useState, useEffect } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Visibility } from '@mui/icons-material';  // Import Visibility Icon
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    ContactPerson: '',
    CompanyName: '',
    Mobile: '',
    Email: '',
    Address: '',
    GSTNumber: '',
    PANNumber: '',
    Status: 'Active',
  });

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/client/get_client.php'); // Replace with actual API URL
        const data = await response.json();
        
        if (data.status === "success") {
          setClients(data.clients);
        } else {
          setError('No clients found');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Handle open and close dialog
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    console.log('Submitting client data:', newClient);

    try {
      const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/client/add_client.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });
      const data = await response.json();

      if (data.status === 'success') {
        setClients([...clients, newClient]);
        setOpenDialog(false);
      } else {
        setError('Failed to add client');
      }
    } catch (err) {
      setError('Failed to add client');
    }
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#FFB300' }}>
          Client List
        </Typography>
        <Button variant="contained" size='small' sx={{ backgroundColor: '#1e2125' }} onClick={handleDialogOpen}>
          Add New Client
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      )}

      {/* {error && !loading && (
        <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
      )} */}

      {!loading && !error && (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
          <Table size='small'>
            <TableHead sx={{ bgcolor: '#1e2125' }}>
              <TableRow>
                {['Client Name', 'Company Name',  'GST Number', 'Status', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index} hover sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}>
                  <TableCell>{client.ContactPerson}</TableCell>
                  <TableCell>{client.CompanyName}</TableCell>
                 
                  <TableCell>{client.GSTNumber}</TableCell>
                  <TableCell>{client.Status}</TableCell>
                  <TableCell>
                    {/* View Button with Icon */}
                    <Link to={`/client-detail/${client.ClientID}`}>
                      <Visibility color="primary" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          {['CompanyName','ContactPerson',  'Mobile', 'Email', 'Address', 'GSTNumber', 'PANNumber'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.replace(/([A-Z])/g, ' $1').trim()}
              name={field}
              fullWidth
              variant="outlined"
              value={newClient[field]}
                  onChange={handleInputChange}
                  size='small'
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Add Client</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientList;
