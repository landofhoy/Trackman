import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessIcon,
  SelfImprovement as MeditationIcon,
  Book as BookIcon,
  Work as WorkIcon,
  LocalDining as FoodIcon,
} from '@mui/icons-material';
import { initialHabits } from '../data/initialData';

interface Habit {
  id: number;
  name: string;
  category: string;
  completed: boolean;
  streak: number;
  longestStreak: number;
  lastCompleted: string | null;
}

const CATEGORIES = [
  { value: 'fitness', label: 'Fitness', icon: <FitnessIcon /> },
  { value: 'mindfulness', label: 'Mindfulness', icon: <MeditationIcon /> },
  { value: 'learning', label: 'Learning', icon: <BookIcon /> },
  { value: 'work', label: 'Work', icon: <WorkIcon /> },
  { value: 'nutrition', label: 'Nutrition', icon: <FoodIcon /> },
];

const MOTIVATIONAL_MESSAGES = {
  streak: {
    1: "Great start! Keep it going!",
    3: "You're building momentum!",
    7: "One week strong! Amazing!",
    14: "Two weeks! You're unstoppable!",
    21: "Three weeks! You're forming a habit!",
    30: "One month! You're incredible!",
  },
};

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    if (!saved) {
      localStorage.setItem('habits', JSON.stringify(initialHabits));
      return initialHabits;
    }
    return JSON.parse(saved);
  });
  const [open, setOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('fitness');
  const [message, setMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completed = !habit.completed;
        let streak = habit.streak;
        let longestStreak = habit.longestStreak;

        if (completed) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (habit.lastCompleted === yesterdayStr) {
            streak += 1;
            if (streak > longestStreak) {
              longestStreak = streak;
            }
            if (streak in MOTIVATIONAL_MESSAGES.streak) {
              setMessage(MOTIVATIONAL_MESSAGES.streak[streak as keyof typeof MOTIVATIONAL_MESSAGES.streak]);
              setShowMessage(true);
            }
          } else if (habit.lastCompleted !== today) {
            streak = 1;
          }
        }

        return {
          ...habit,
          completed,
          streak,
          longestStreak,
          lastCompleted: completed ? today : habit.lastCompleted
        };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now(),
        name: newHabitName.trim(),
        category: newHabitCategory,
        completed: false,
        streak: 0,
        longestStreak: 0,
        lastCompleted: null,
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setNewHabitCategory('fitness');
      setOpen(false);
    }
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORIES.find(cat => cat.value === category)?.icon || <FitnessIcon />;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Daily Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Habit
          </Button>
        </Box>

        <Paper elevation={3}>
          <List>
            {habits.map((habit) => (
              <ListItem
                key={habit.id}
                divider
                sx={{
                  backgroundColor: habit.completed ? 'action.hover' : 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getCategoryIcon(habit.category)}
                  <ListItemText
                    primary={habit.name}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={`🔥 ${habit.streak} day streak`}
                          size="small"
                          color={habit.streak > 0 ? 'primary' : 'default'}
                        />
                        <Chip
                          label={`🏆 ${habit.longestStreak} day record`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={CATEGORIES.find(cat => cat.value === habit.category)?.label}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </Box>
                <ListItemSecondaryAction>
                  <Tooltip title={habit.completed ? "Mark as incomplete" : "Mark as complete"}>
                    <IconButton
                      edge="end"
                      onClick={() => toggleHabit(habit.id)}
                      color={habit.completed ? 'success' : 'default'}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete habit">
                    <IconButton
                      edge="end"
                      onClick={() => deleteHabit(habit.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {habits.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No habits yet"
                  secondary="Click the 'Add Habit' button to get started"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            )}
          </List>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Habit Name"
              fullWidth
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={newHabitCategory}
                label="Category"
                onChange={(e) => setNewHabitCategory(e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category.icon}
                      {category.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addHabit} variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showMessage}
          autoHideDuration={3000}
          onClose={() => setShowMessage(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowMessage(false)} severity="success" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Habits; 