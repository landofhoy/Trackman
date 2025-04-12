import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Brightness4 as DarkModeIcon,
  ExitToApp as SignOutIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // This would come from your auth context in a real app
  const user = {
    name: 'Matthew Hoyland',
    initial: 'M'
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleExportData = () => {
    // This would trigger the export functionality from the Profile page
    handleMenuClose();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<TimelineIcon />}
            onClick={() => navigate('/habits')}
            variant={location.pathname === '/habits' ? 'outlined' : 'text'}
          >
            Habits
          </Button>
          <Button
            color="inherit"
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/stats')}
            variant={location.pathname === '/stats' ? 'outlined' : 'text'}
          >
            Stats
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
          }}
          onClick={handleMenuOpen}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '1rem',
            }}
          >
            {user.initial}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Hello, {user.name}
          </Typography>
          <IconButton
            color="inherit"
            size="small"
            sx={{ ml: -0.5 }}
          >
            <ArrowDownIcon />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              width: 220,
            }
          }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleExportData}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            Export My Data
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <DarkModeIcon fontSize="small" />
            </ListItemIcon>
            Dark Mode
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <SignOutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 