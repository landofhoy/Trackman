import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { currentUser, updatePassword } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword(newPassword);
      setIsEditing(false);
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting data...');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Account Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={currentUser?.displayName || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={currentUser?.email || ''}
              disabled
            />
          </Grid>
          {!currentUser?.providerData[0]?.providerId.includes('google') && (
            <Grid item xs={12}>
              {isEditing ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handlePasswordUpdate}
                    disabled={!newPassword}
                  >
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Change Password
                </Button>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Page Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Page Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Dark Mode" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Integrations */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Integrations
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="No active integrations"
              secondary="More integrations coming soon!"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Export Data */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export My Data
        </Typography>
        <Button
          variant="outlined"
          onClick={handleExportData}
          sx={{ mt: 1 }}
        >
          Export Data
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile; 