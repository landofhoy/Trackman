import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  totalHabits: number;
  longestStreak: number;
}

const Profile: React.FC = () => {
  // Mock user data - in a real app, this would come from your backend
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Matthew Hoyland',
    email: 'user@example.com',
    joinDate: new Date().toLocaleDateString(),
    totalHabits: 5,
    longestStreak: 20,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // In a real app, you would save this to your backend
  };

  const handleExportData = () => {
    // In a real app, this would generate a proper export file
    const data = {
      profile,
      habits: localStorage.getItem('habits'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trackman-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportDialogOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 3,
            }}
          >
            {profile.name.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  fullWidth
                />
              </Box>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {profile.email}
                </Typography>
              </>
            )}
          </Box>
          <IconButton
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem>
            <ListItemText
              primary="Member Since"
              secondary={profile.joinDate}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Total Habits Tracked"
              secondary={profile.totalHabits}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Longest Streak"
              secondary={`${profile.longestStreak} days`}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Export Data"
              secondary="Download all your habit tracking data"
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => setIsExportDialogOpen(true)}>
                <DownloadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Delete Account"
              secondary="Permanently delete your account and all data"
              sx={{ color: 'error.main' }}
            />
            <ListItemSecondaryAction>
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Dialog open={isExportDialogOpen} onClose={() => setIsExportDialogOpen(false)}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography>
            This will download all your habit tracking data in JSON format.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExportData} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 