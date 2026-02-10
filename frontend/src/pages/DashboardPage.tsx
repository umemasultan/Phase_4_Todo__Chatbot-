import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../components/AuthProvider';
import { ChatInterface } from '../components/ChatInterface';
import { TodoDashboard } from '../components/TodoDashboard';
import { apiClient } from '../services/ApiClient';
import { Todo } from '../types';

export function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const response = await apiClient.getTodos();
      if (response.success && response.data) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#15173D',
          borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo Chatbot
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                backgroundColor: 'rgba(21, 23, 61, 0.8)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              <ChatInterface onTodosChange={loadTodos} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                backgroundColor: 'rgba(21, 23, 61, 0.8)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              <TodoDashboard todos={todos} onTodosChange={loadTodos} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
