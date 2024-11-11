import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography, Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';

const ClientDetail = () => {
  const { id } = useParams();  // Extract client ID from the URL
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alternateContacts, setAlternateContacts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAlternate, setNewAlternate] = useState({
    AlternatePersonName: '',
    AlternateEmail: '',
    AlternateMobile: '',
  });

  useEffect(() => {
    // Fetch Client Details
    const fetchClientDetail = async () => {
      try {
        const response = await fetch(`https://namami-infotech.com/GoyalMittal&CoBackend/src/client/get_one_client.php?id=${id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setClient(data.client);
        } else {
          setError('Client not found');
        }
      } catch (err) {
        setError('Error fetching client details');
      } finally {
        setLoading(false);
      }
    };

    // Fetch Alternate Contacts with ClientID
    const fetchAlternateContacts = async () => {
      try {
        const response = await fetch(`https://namami-infotech.com/GoyalMittal&CoBackend/src/client/get_one_alternate.php?id=${id}`);
        const data = await response.json();

        if (data.status === 'success') {
          setAlternateContacts([data.client]); // Assuming the data contains one alternate contact
        } else {
          setError('No alternate contacts found');
        }
      } catch (err) {
        setError('Error fetching alternate contacts');
      }
    };

    fetchClientDetail();
    fetchAlternateContacts();
  }, [id]);

  // Handle input change for new alternate contact
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlternate((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit for adding new alternate contact
  const handleFormSubmit = async () => {
    try {
      const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/client/add_alternate.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ClientID: id,
          ...newAlternate,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setAlternateContacts((prev) => [...prev, newAlternate]);
        setOpenDialog(false);
        setNewAlternate({
          AlternatePersonName: '',
          AlternateEmail: '',
          AlternateMobile: '',
        });
      } else {
        setError('Failed to add alternate contact');
      }
    } catch (err) {
      setError('Failed to add alternate contact');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 0, maxWidth: '1000px', margin: 'auto' }}>
      {/* Check if client data exists before rendering client details */}
      {client ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#333' }} gutterBottom>
            {client.CompanyName}
          </Typography>

          <Divider sx={{ marginBottom: 2 }} />

          {/* Client Details in Grid */}
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Contact Person:</strong> {client.ContactPerson}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Mobile:</strong> {client.Mobile}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Email:</strong> {client.Email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Address:</strong> {client.Address}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>GST Number:</strong> {client.GSTNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>PAN Number:</strong> {client.PANNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Status:</strong> {client.Status}</Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="body2" sx={{ color: '#555' }}>Client details not available.</Typography>
      )}

      {/* Add Alternate Contact Button */}
      <Divider sx={{ marginTop: 2 }} />
      <br/>
      <div style={{display:'flex', justifyContent:"space-between"}}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Alternate Contacts</Typography>
        <Button size='small' sx={{ backgroundColor: '#1e2125' }} variant="contained"  onClick={() => setOpenDialog(true)}>
          Add Alternate Contact
        </Button>
      </div>

      {/* Alternate Contacts Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', marginTop: 1 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e2125' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e2125' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e2125' }}>Mobile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alternateContacts.length > 0 ? (
              alternateContacts.map((alt, index) => (
                <TableRow key={index}>
                  <TableCell>{alt.AlternatePersonName}</TableCell>
                  <TableCell>{alt.AlternateEmail}</TableCell>
                  <TableCell>{alt.AlternateMobile}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center' }}>No alternate contacts found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding New Alternate Contact */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Alternate Contact</DialogTitle>
        <DialogContent>
          <TextField
            label="Alternate Person Name"
            name="AlternatePersonName"
            fullWidth
            variant="outlined"
            value={newAlternate.AlternatePersonName}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Alternate Email"
            name="AlternateEmail"
            fullWidth
            variant="outlined"
            value={newAlternate.AlternateEmail}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Alternate Mobile"
            name="AlternateMobile"
            fullWidth
            variant="outlined"
            value={newAlternate.AlternateMobile}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Add Contact</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDetail;
