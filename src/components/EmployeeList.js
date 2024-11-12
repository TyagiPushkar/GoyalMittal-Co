import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem, FormControl, InputLabel, Select, Switch, FormControlLabel
} from '@mui/material';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    EmpId: '',
    Name: '',
    Password: '',
    Mobile: '',
    Email: '',
    Role: '',
    Status: 'Active',
  });

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/user/get_user.php');
        const data = await response.json();
        
        if (data.status === "success") {
          setEmployees(data.users);
        } else {
          setError('No users found');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle open and close dialog
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/user/add_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setEmployees([...employees, newEmployee]);
        setOpenDialog(false);
      } else {
        setError('Failed to add employee');
      }
    } catch {
      setError('Failed to add employee');
    }
  };

  // Toggle employee status
  const handleStatusToggle = async (empId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    try {
      const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/user/create_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'updateStatus', EmpId: empId, Status: newStatus }),
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setEmployees(employees.map(employee => 
          employee.EmpId === empId ? { ...employee, Status: newStatus } : employee
        ));
      } else {
        setError('Failed to update status');
      }
    } catch {
      setError('Failed to update status');
    }
  };

  return (
    <Box sx={{ padding: 0 }}>
      {/* Header with Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#FFB300' }}>
          Employee List
        </Typography>
        <Button variant="contained" size='small' sx={{backgroundColor:'#1e2125'}} onClick={handleDialogOpen}>
          Add New Employee
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
          <Table size='small'>
            <TableHead sx={{ bgcolor: '#1e2125' }}>
              <TableRow>
                {['Employee ID', 'Name', 'Mobile', 'Email', 'Role', 'Status', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.EmpId} hover sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}>
                  <TableCell>{employee.EmpId}</TableCell>
                  <TableCell>{employee.Name}</TableCell>
                  <TableCell>{employee.Mobile}</TableCell>
                  <TableCell>{employee.Email}</TableCell>
                  <TableCell>{employee.Role}</TableCell>
                  <TableCell>{employee.Status}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={employee.Status === 'Active'}
                          onChange={() => handleStatusToggle(employee.EmpId, employee.Status)}
                          color="primary"
                        />
                      }
                      label={employee.Status === 'Active' ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Adding New Employee */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          {['EmpId', 'Name', 'Password', 'Mobile', 'Email'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field}
              name={field}
              type={field === 'Password' ? 'password' : 'text'}
              fullWidth
              variant="outlined"
              value={newEmployee[field]}
              onChange={handleInputChange}
              size='small'
            />
          ))}

          <FormControl fullWidth margin="dense" variant="outlined" size='small'>
            <InputLabel>Role</InputLabel>
            <Select
              name="Role"
              value={newEmployee.Role}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Add Employee</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeList;
