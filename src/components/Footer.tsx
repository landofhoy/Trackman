import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import ThemeToggle from './ThemeToggle';

interface FooterProps {
  onToggleTheme: () => void;
}

const Footer: React.FC<FooterProps> = ({ onToggleTheme }) => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          p: 2,
        }}
      >
        <Link
          href="https://landofhoy.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <Typography variant="body2">
            Contact Me
          </Typography>
        </Link>
        <ThemeToggle onToggle={onToggleTheme} />
      </Box>
    </Box>
  );
};

export default Footer; 