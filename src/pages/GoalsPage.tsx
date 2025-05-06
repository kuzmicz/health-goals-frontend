import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  fetchGoals as fetchGoalsApi,
  createGoal,
  updateGoalStatus,
  deleteGoal,
} from '../services/goalService';

type Goal = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setError('');
      const data = await fetchGoalsApi();
      setGoals(data);
    } catch {
      setError('Failed to fetch goals.');
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await createGoal(title, description);
      setTitle('');
      setDescription('');
      loadGoals();
    } catch {
      setError('Failed to create goal.');
    }
  };

  const handleToggleComplete = async (goal: Goal) => {
    try {
      setError('');
      await updateGoalStatus(goal._id, !goal.completed);
      loadGoals();
    } catch {
      setError('Failed to update goal.');
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
      setError('');
      await deleteGoal(goalId);
      loadGoals();
    } catch {
      setError('Failed to delete goal.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Health goals</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleAddGoal}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            margin="normal"
            multiline
            minRows={3}
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add goal
          </Button>
        </form>

        {goals.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            No goals yet.
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
              {goals.length} goal{goals.length !== 1 && 's'}
            </Typography>
            <List>
              {goals.map(goal => (
                <ListItem
                  key={goal._id}
                  sx={{ borderBottom: '1px solid #ddd' }}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        onClick={() => handleToggleComplete(goal)}
                        color="primary"
                      >
                        {goal.completed ? <UndoIcon /> : <CheckIcon />}
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(goal._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: goal.completed ? 'line-through' : 'none',
                        }}
                      >
                        {goal.title}
                      </Typography>
                    }
                    secondary={goal.description}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
}
