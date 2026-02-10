import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../components/AuthProvider';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            width: '100%',
            backgroundColor: 'rgba(21, 23, 61, 0.95)',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.2)',
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              mb: 1,
              textShadow: '0 4px 12px rgba(99, 102, 241, 0.5)',
              letterSpacing: '0.5px',
            }}
          >
            Todo Chatbot
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            mb={4}
            sx={{
              color: '#a5b4fc',
              fontWeight: 400,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            AI-Powered Task Management
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(165, 180, 252, 0.15)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(165, 180, 252, 0.25)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(165, 180, 252, 0.35)',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#ffffff',
                  fontWeight: 400,
                },
                '& .MuiInputLabel-root': {
                  color: '#ffffff',
                  fontWeight: 500,
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)',
                  backgroundColor: '#15173D',
                  padding: '4px 8px',
                  borderRadius: '6px',
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: '#ffffff',
                  opacity: 0.6,
                  fontWeight: 400,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              placeholder="Enter your password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(165, 180, 252, 0.15)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(165, 180, 252, 0.25)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(165, 180, 252, 0.35)',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#ffffff',
                  fontWeight: 400,
                },
                '& .MuiInputLabel-root': {
                  color: '#ffffff',
                  fontWeight: 500,
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)',
                  backgroundColor: '#15173D',
                  padding: '4px 8px',
                  borderRadius: '6px',
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: '#ffffff',
                  opacity: 0.6,
                  fontWeight: 400,
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box textAlign="center">
              <Typography variant="body2" sx={{ color: '#a5b4fc' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none',
                    color: '#818cf8',
                    fontWeight: 500,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6366f1',
                  mt: 3,
                  display: 'block',
                  fontWeight: 500,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                Created by Umema Sultan
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
