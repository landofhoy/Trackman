import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
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
  Box,
  CircularProgress
} from '@mui/material';
import {
  Check as CheckIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

interface Habit {
  id: string;
  name: string;
  isCompletedToday: boolean;
}

const Habits = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [open, setOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!currentUser) return;

    try {
      const habitsQuery = query(
        collection(db, 'habits'),
        where('userId', '==', currentUser.uid)
      );
      const habitsSnapshot = await getDocs(habitsQuery);
      
      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all completions for today
      const completionsQuery = query(
        collection(db, 'completions'),
        where('userId', '==', currentUser.uid),
        where('date', '>=', today)
      );
      const completionsSnapshot = await getDocs(completionsQuery);
      const completedHabitIds = new Set(
        completionsSnapshot.docs.map(doc => doc.data().habitId)
      );

      const habitsList = habitsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        isCompletedToday: completedHabitIds.has(doc.id)
      }));

      setHabits(habitsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [currentUser]);

  const handleAddHabit = async () => {
    if (!currentUser || !newHabitName.trim()) return;

    try {
      await addDoc(collection(db, 'habits'), {
        name: newHabitName.trim(),
        userId: currentUser.uid,
        createdAt: Timestamp.now()
      });
      setNewHabitName('');
      setOpen(false);
      fetchHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleComplete = async (habitId: string) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'completions'), {
        habitId,
        userId: currentUser.uid,
        date: Timestamp.now()
      });
      fetchHabits();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">My Habits</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Habit
          </Button>
        </Box>

        <Paper>
          <List>
            {habits.map((habit) => (
              <ListItem
                key={habit.id}
                sx={{
                  borderLeft: 6,
                  borderColor: habit.isCompletedToday ? 'success.main' : 'transparent',
                  bgcolor: habit.isCompletedToday ? 'success.light' : 'transparent',
                  '&:hover': {
                    bgcolor: habit.isCompletedToday ? 'success.light' : 'action.hover'
                  }
                }}
              >
                <ListItemText
                  primary={habit.name}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleComplete(habit.id)}
                    disabled={habit.isCompletedToday}
                    color={habit.isCompletedToday ? 'success' : 'default'}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteHabit(habit.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {habits.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No habits yet"
                  secondary="Click the 'Add Habit' button to create your first habit!"
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddHabit} variant="contained" disabled={!newHabitName.trim()}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Habits; 