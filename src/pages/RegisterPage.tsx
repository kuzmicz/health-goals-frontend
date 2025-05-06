import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, TextField, Button, Box, Alert, Link, Paper, Container } from '@mui/material';
import { register } from '../services/authService';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await register(email, password);
      setMessage({
        type: 'success',
        text: 'Registration successful! You can now login.',
      });
      setEmail('');
      setPassword('');
    } catch {
      setMessage({
        type: 'error',
        text: 'Registration failed. Contact the administrator.',
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        {message && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
        <Box mt={2} textAlign="center">
          <Link component={RouterLink} to="/login">
            Already have an account? Login here
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
