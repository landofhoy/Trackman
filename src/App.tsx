import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Box, CssBaseline, Container, Typography, Paper, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Habits from './pages/Habits';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Landing = () => (
  <Container maxWidth="sm">
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      pb: 8, // Add padding to account for footer
    }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Trackman
      </Typography>
      <Typography variant="h5" component="h2" align="center" color="text.secondary" gutterBottom>
        Build better habits. Stay on fire.
      </Typography>
      <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="body1" paragraph align="center">
          Track your daily habits, build streaks, and visualize your progress.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/habits" style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              size="large"
              color="primary"
            >
              Get Started
            </Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  </Container>
);

const AppContent = () => {
  const location = useLocation();
  return (
    <Box sx={{ pb: 8 }}> {/* Add padding to account for footer */}
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'Geist, sans-serif',
        },
        palette: {
          mode,
          primary: {
            main: '#2196f3',
          },
          secondary: {
            main: '#f50057',
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppContent />
          <Footer onToggleTheme={toggleTheme} />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
