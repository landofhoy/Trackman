import React, { useEffect, useState } from 'react';
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
  Divider
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

interface HabitData {
  name: string;
  completions: { date: Date }[];
}

const Stats = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [habitStats, setHabitStats] = useState<HabitData[]>([]);

  useEffect(() => {
    const fetchHabitStats = async () => {
      if (!currentUser) return;

      try {
        const habitsQuery = query(
          collection(db, 'habits'),
          where('userId', '==', currentUser.uid)
        );
        const habitsSnapshot = await getDocs(habitsQuery);
        
        const stats = await Promise.all(
          habitsSnapshot.docs.map(async (doc) => {
            const habit = doc.data();
            const completionsQuery = query(
              collection(db, 'completions'),
              where('habitId', '==', doc.id)
            );
            const completionsSnapshot = await getDocs(completionsQuery);
            
            const completions = completionsSnapshot.docs.map(doc => ({
              date: doc.data().date.toDate()
            }));

            return {
              name: habit.name,
              completions: completions.sort((a, b) => b.date.getTime() - a.date.getTime())
            };
          })
        );

        setHabitStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching habit stats:', error);
        setLoading(false);
      }
    };

    fetchHabitStats();
  }, [currentUser]);

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
        Statistics
      </Typography>

      <Grid container spacing={3}>
        {habitStats.map((habit, index) => (
          <Grid item xs={12} key={index}>
            <Paper>
              <List>
                <ListItem>
                  <ListItemText
                    primary={habit.name}
                    secondary={`Total completions: ${habit.completions.length}`}
                  />
                </ListItem>
                <Divider />
                {habit.completions.slice(0, 5).map((completion, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      secondary={`Completed on ${completion.date.toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
                {habit.completions.length > 5 && (
                  <ListItem>
                    <ListItemText
                      secondary={`+ ${habit.completions.length - 5} more completions`}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        ))}

        {habitStats.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No habit data available yet. Start tracking habits to see your statistics!
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Stats; 