import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { TrendingUp as TrendingUpIcon, EmojiEvents as EmojiEventsIcon } from '@mui/icons-material';
import { initialHabits } from '../data/initialData';

interface Habit {
  id: number;
  name: string;
  streak: number;
  longestStreak: number;
  lastCompleted: string | null;
}

const Stats: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    weeklyCompletion: 0,
    totalStreaks: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const habitsToUse = savedHabits ? JSON.parse(savedHabits) : initialHabits;
    
    if (!savedHabits) {
      localStorage.setItem('habits', JSON.stringify(initialHabits));
    }
    
    setHabits(habitsToUse);
    
    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habitsToUse.filter((h: Habit) => h.lastCompleted === today).length;
    const totalStreaks = habitsToUse.reduce((sum: number, h: Habit) => sum + h.streak, 0);
    const longestStreak = Math.max(...habitsToUse.map((h: Habit) => h.longestStreak), 0);
    
    setStats({
      totalHabits: habitsToUse.length,
      completedToday,
      weeklyCompletion: habitsToUse.length > 0 
        ? Math.round((completedToday / habitsToUse.length) * 100) 
        : 0,
      totalStreaks,
      longestStreak,
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Today's Progress
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={stats.totalHabits > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0}
                  size={100}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {`${stats.completedToday}/${stats.totalHabits}`}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Weekly Completion
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={stats.weeklyCompletion}
                  size={100}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {`${stats.weeklyCompletion}%`}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Achievements
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Active Streaks"
                    secondary={`${stats.totalStreaks} days`}
                  />
                  <TrendingUpIcon color="primary" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Longest Streak"
                    secondary={`${stats.longestStreak} days`}
                  />
                  <EmojiEventsIcon color="primary" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Habit Performance
              </Typography>
              {habits.length > 0 ? (
                <List>
                  {habits.map((habit) => (
                    <React.Fragment key={habit.id}>
                      <ListItem>
                        <ListItemText
                          primary={habit.name}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Typography variant="body2" color="primary">
                                Current Streak: {habit.streak} days
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Best Streak: {habit.longestStreak} days
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  No habits tracked yet. Add some habits to see your performance!
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Stats; 