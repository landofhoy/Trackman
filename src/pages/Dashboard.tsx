import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

interface HabitCompletion {
  habitName: string;
  completedAt: Date;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  const fetchCompletions = async (date: Date) => {
    if (!currentUser) return;

    try {
      // Get start and end of selected date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get completions for the selected date
      const completionsQuery = query(
        collection(db, 'completions'),
        where('userId', '==', currentUser.uid),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay)
      );
      const completionsSnapshot = await getDocs(completionsQuery);

      // Get all habits to map their names
      const habitsQuery = query(
        collection(db, 'habits'),
        where('userId', '==', currentUser.uid)
      );
      const habitsSnapshot = await getDocs(habitsQuery);
      const habitsMap = new Map(
        habitsSnapshot.docs.map(doc => [doc.id, doc.data().name])
      );

      const completionsList = completionsSnapshot.docs.map(doc => ({
        habitName: habitsMap.get(doc.data().habitId) || 'Unknown Habit',
        completedAt: doc.data().date.toDate()
      }));

      setCompletions(completionsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching completions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletions(selectedDate);
  }, [currentUser, selectedDate]);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Button onClick={handlePreviousDay}>Previous Day</Button>
          <Typography variant="h6">
            {selectedDate.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
          <Button onClick={handleNextDay}>Next Day</Button>
        </Box>

        <List>
          {completions.length > 0 ? (
            completions.map((completion, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={completion.habitName}
                  secondary={`Completed at ${completion.completedAt.toLocaleTimeString()}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No habits completed"
                secondary="Complete some habits to see them here!"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Stats
        </Typography>
        <Typography variant="body1">
          Habits completed today: {completions.length}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard; 