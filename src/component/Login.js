// src/Login.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Perform authentication logic here
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      onLogin(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#e0f7fa',
      }}
    >
      <Paper 
        sx={{ 
          padding: 4, 
          maxWidth: 400, 
          width: '100%', 
          textAlign: 'center', 
          borderRadius: 2, 
          boxShadow: 3 
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 500 }}>
          Admin Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ borderRadius: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ borderRadius: 2 }}
          InputProps={{
            endAdornment: (
              <IconButton 
                position="end" 
                onClick={togglePasswordVisibility}
                sx={{ mt: 1.5 }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, borderRadius: 20, padding: '10px', fontWeight: 600 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
