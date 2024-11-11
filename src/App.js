import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute component
import EmployeeList from './components/EmployeeList';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import TaskList from './components/TaskList';

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
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <EmployeeList />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ClientList/>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/client-detail/:id"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ClientDetail/>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/task"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <TaskList/>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
