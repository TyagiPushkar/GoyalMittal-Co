import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeList from './components/EmployeeList';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <Layout>
                                <EmployeeList />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <Layout>
                                <ClientList />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/client-detail/:id"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <Layout>
                                <ClientDetail />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/task"
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                            <Layout>
                                <TaskList />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/task-detail/:id"
                    element={
                        <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                            <Layout>
                                <TaskDetail />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
