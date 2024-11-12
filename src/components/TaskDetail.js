import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography, Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, InputLabel, FormControl, Card, CardContent, CardHeader } from '@mui/material';
import { useParams } from 'react-router-dom';

const TaskDetail = () => {
  const { id } = useParams(); // Extract task ID from the URL
  const [task, setTask] = useState(null);
  const [client, setClient] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [taskUpdates, setTaskUpdates] = useState([]);  // Store task updates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // Dialog open state
  const [updatedTask, setUpdatedTask] = useState({
    Status: '',
    Remark: '',
  });
  const [employees, setEmployees] = useState({}); // To store employee data by EmpId

  // Fetch Task Details
  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await fetch(`https://namami-infotech.com/GoyalMittal&CoBackend/src/task/get_one_task.php?id=${id}`);
        const data = await response.json();

        if (data.status === 'success') {
          setTask(data.task);
          // Fetch Client Data
          fetchClientData(data.task.ClientID);
          // Fetch Employee Data
          fetchEmployeeData(data.task.EmpId);
        } else {
          setError('Task not found');
        }
      } catch (err) {
        setError('Error fetching task details');
      } finally {
        setLoading(false);
      }
    };

    // Fetch Task Updates
    fetchTaskDetail();
    fetchTaskUpdates();
  }, [id]);

  const fetchClientData = async (clientId) => {
    try {
      const response = await fetch(`https://namami-infotech.com/GoyalMittal&CoBackend/src/client/get_client.php?ClientID=${clientId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setClient(data.clients[0]); // Assuming only one client is returned
      } else {
        setError('Client not found');
      }
    } catch (err) {
      setError('Error fetching client data');
    }
  };

  const fetchEmployeeData = async (empId) => {
    try {
      const response = await fetch(`https://namami-infotech.com/GoyalMittal&CoBackend/src/user/get_user.php?EmpId=${empId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setEmployee(data.users[0]); // Assuming only one user is returned
      } else {
        setError('Employee not found');
      }
    } catch (err) {
      setError('Error fetching employee data');
    }
  };

  const fetchTaskUpdates = async () => {
    try {
      const response = await fetch(`https://namami-infotech.com/GoyalMittal&CoBackend/src/task/get_task_update.php?TaskID=${id}`);
      const data = await response.json();

      if (data.status === 'success') {
        setTaskUpdates(data.taskUpdates);
        // Fetch employee data for all task updates
        fetchEmployeeNamesForUpdates(data.taskUpdates);
      } else {
        setError('No updates found');
      }
    } catch (err) {
      setError('Error fetching task updates');
    }
  };

  // Fetch employee names for all task updates
  const fetchEmployeeNamesForUpdates = async (updates) => {
    const employeeIds = updates.map((update) => update.UpdatedBy);
    try {
      const promises = employeeIds.map((empId) =>
        fetch(`https://namami-infotech.com/GoyalMittal&CoBackend/src/user/get_user.php?EmpId=${empId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 'success') {
              return { empId, name: data.users[0]?.Name }; // Store employee name by EmpId
            }
            return null;
          })
      );
      const employeeData = await Promise.all(promises);
      const employeesMap = employeeData.reduce((acc, { empId, name }) => {
        if (name) acc[empId] = name; // Store in an object for quick lookup
        return acc;
      }, {});
      setEmployees(employeesMap);
    } catch (err) {
      setError('Error fetching employee data for updates');
    }
  };

  // Handle input change for task update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({ ...prev, [name]: value }));
  };

  // Get EmpId from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const empId = user?.EmpId;

  // Handle form submit for updating task
  const handleFormSubmit = async () => {
    try {
      const response = await fetch('https://namami-infotech.com/GoyalMittal&CoBackend/src/task/task_update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TaskID: id,
          Remark: updatedTask.Remark,
          Status: updatedTask.Status,
          UpdatedBy: empId, // Use EmpId for UpdatedBy
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Task updated successfully!');
        setOpenDialog(false);
        fetchTaskUpdates();  // Fetch updated task updates
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('Failed to update task');
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
    <Box sx={{ padding: 2, margin: 'auto' }}>
      {/* Check if task data exists before rendering task details */}
      {task && client && employee ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#333' }} gutterBottom>
            {task.TaskTitle}
          </Typography>

          <Divider sx={{ marginBottom: 2 }} />

          {/* Task Details in Grid */}
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Client Name:</strong> {client.CompanyName}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Assigned To:</strong> {employee.Name}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ color: '#555' }}><strong>Status:</strong> {task.Status}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#555', whiteSpace: 'pre-wrap' }}>
                <strong>Description:</strong> {task.TaskDescription}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginBottom: 2 }} />
          <Button variant="contained" size='small' sx={{ backgroundColor: '#1e2125' }} onClick={() => setOpenDialog(true)}>
            Update Task
          </Button>

          {/* Display Task Updates */}
          <Box sx={{ marginTop: 4 }}>
            {taskUpdates.length > 0 ? (
              taskUpdates.map((update, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                  <CardHeader
                    title={<Typography variant="body2" sx={{ fontWeight: 600 }}>{employees[update.UpdatedBy]}</Typography>} 
                    action={<Typography variant="body2">{new Date(update.UpdatedAt).toLocaleString()}</Typography>}
                    // action={<Typography variant="body2" sx={{ color: update.Status === 'Closed' ? 'red' : update.Status === 'Hold' ? 'orange' : 'green' }}>{update.Status}</Typography>}
                    sx={{ padding: 2 }}
                  />
                  <CardContent>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{update.Remark}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#555' }}>No updates available for this task.</Typography>
            )}
          </Box>

          {/* Update Task Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Update Task</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      name="Status"
                      value={updatedTask.Status}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                      <MenuItem value="Hold">Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remark"
                    multiline
                    rows={4}
                    name="Remark"
                    value={updatedTask.Remark}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
              <Button onClick={handleFormSubmit} color="primary">Update</Button>
            </DialogActions>
          </Dialog>

        </>
      ) : (
        <Typography variant="body2" sx={{ color: '#555' }}>No task details found.</Typography>
      )}

      {/* Error Message */}
      {error && (
        <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TaskDetail;
