import React, { useState, useEffect } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Visibility } from '@mui/icons-material';  // Import Visibility Icon
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    TaskDescription: '',
    Status: 'Pending',
    EmpId: '',
    ClientID: '',
  });

  const [users, setUsers] = useState([]);  // Store fetched users (employees)
  const [clients, setClients] = useState([]);  // Store fetched clients

  // Fetch tasks, users (employees), and clients on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/task/task.php');
        const tasksData = await tasksResponse.json();
        if (tasksData.status === "success") {
          setTasks(tasksData.tasks);
        } else {
          setError('No tasks found');
        }

        // Fetch users (employees)
        const usersResponse = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/user/get_user.php');
        const usersData = await usersResponse.json();
        if (usersData.status === "success") {
          setUsers(usersData.users);
        } else {
          setError('No users found');
        }

        // Fetch clients
        const clientsResponse = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/client/get_client.php');
        const clientsData = await clientsResponse.json();
        if (clientsData.status === "success") {
          setClients(clientsData.clients);
        } else {
          setError('No clients found');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle open and close dialog
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    console.log('Submitting task data:', newTask);

    try {
      const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/task/task.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();

      if (data.status === 'success') {
        setTasks([...tasks, newTask]);
        setOpenDialog(false);
      } else {
        setError('Failed to add task');
      }
    } catch (err) {
      setError('Failed to add task');
    }
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#FFB300' }}>
          Task List
        </Typography>
        <Button variant="contained" size='small' sx={{ backgroundColor: '#1e2125' }} onClick={handleDialogOpen}>
          Add New Task
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
                {['Task Description', 'Status', 'Employee ID', 'Client ID', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={index} hover sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}>
                  <TableCell>{task.TaskDescription}</TableCell>
                  <TableCell>{task.Status}</TableCell>
                  <TableCell>{task.EmpId}</TableCell>
                  <TableCell>{task.ClientID}</TableCell>
                  <TableCell>
                    {/* View Button with Icon */}
                    <Link to={`/task-detail/${task.TaskID}`}>
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
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          {['TaskDescription', 'Status'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.replace(/([A-Z])/g, ' $1').trim()}
              name={field}
              fullWidth
              variant="outlined"
              value={newTask[field]}
              onChange={handleInputChange}
            />
          ))}
          
          {/* Employee Dropdown */}
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Employee</InputLabel>
            <Select
              name="EmpId"
              value={newTask.EmpId}
              onChange={handleInputChange}
              label="Employee"
            >
              {users.map((user) => (
                <MenuItem key={user.EmpId} value={user.EmpId}>
                  {user.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Client Dropdown */}
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Client</InputLabel>
            <Select
              name="ClientID"
              value={newTask.ClientID}
              onChange={handleInputChange}
              label="Client"
            >
              {clients.map((client) => (
                <MenuItem key={client.ClientID} value={client.ClientID}>
                  {client.CompanyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Add Task</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
