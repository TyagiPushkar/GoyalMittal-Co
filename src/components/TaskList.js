import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextareaAutosize,
  IconButton
} from '@mui/material';
import { Visibility, Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    TaskTitle: '',
    TaskDescription: '',
    Status: 'Pending',
    EmpId: '',
    ClientID: '',
  });

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/task/task.php');
        const tasksData = await tasksResponse.json();
        if (tasksData.status === "success") {
          setTasks(tasksData.tasks);
        } else {
          setError('No tasks found');
        }

        const usersResponse = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/user/get_user.php');
        const usersData = await usersResponse.json();
        if (usersData.status === "success") {
          setUsers(usersData.users);
        } else {
          setError('No users found');
        }

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

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
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
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#FFB300' }}>
          Task List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: '#1e2125', color: '#FFFFFF' }}
          onClick={handleDialogOpen}
        >
          Add New Task
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>{error}</Typography>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', borderRadius: 3 }}>
          <Table size='small'>
            <TableHead sx={{ bgcolor: '#1e2125' }}>
              <TableRow>
                {['ID', 'Task Title', 'Employee Name', 'Company Name', 'Status', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={index} hover sx={{ '&:hover': { bgcolor: '#f0f0f0' } }}>
                  <TableCell sx={{ textAlign: 'center' }}>{task.TaskID}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{task.TaskTitle}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {users.find(user => user.EmpId === task.EmpId)?.Name || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {clients.find(client => client.ClientID === task.ClientID)?.CompanyName || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{task.Status}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton component={Link} to={`/task-detail/${task.TaskID}`} color="primary">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle sx={{ bgcolor: '#1e2125', color: '#FFB300', textAlign: 'center' }}>Add New Task</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl size='small' fullWidth margin="dense" variant="outlined">
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

          <TextField
            margin="dense"
            label="Task Title"
            name="TaskTitle"
            fullWidth
            variant="outlined"
            value={newTask.TaskTitle}
            onChange={handleInputChange}
            size='small'
          />

          <TextareaAutosize
            placeholder="Task Description"
            name="TaskDescription"
            fullWidth
            minRows={4}
            maxRows={4}
            value={newTask.TaskDescription}
            onChange={handleInputChange}
            style={{ width: '95%', resize: 'none', marginTop: 16, padding: 8 }}
          />

          <FormControl size='small' fullWidth margin="dense" variant="outlined" sx={{ mt: 2 }}>
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
