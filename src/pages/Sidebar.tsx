import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import SchoolIcon from '@mui/icons-material/School';
import CampaignIcon from '@mui/icons-material/Campaign';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Chat with AI', icon: <ChatIcon />, path: '/chat' },
  { label: 'Lectures', icon: <SchoolIcon />, path: '/lectures' },
  { label: 'Announcements', icon: <CampaignIcon />, path: '/announcements' },
  { label: 'Q&A', icon: <ForumIcon />, path: '/questions' },
  // { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: '#2323a7',
        color: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
        boxShadow: 3,
      }}
    >
      <Box display="flex" alignItems="center" px={3} py={4}>
        <Avatar src="/Logo.png" variant="square" sx={{ width: 88, height: 48, bgcolor: '#fff', mr: 2 }} />
    </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.15)', mb: 2 }} />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              color: '#fff',
              bgcolor: location.pathname === item.path ? '#1976d2' : 'inherit',
              '&:hover': { bgcolor: '#1976d2' },
              fontWeight: 600,
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box flexGrow={1} />
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.15)', my: 2 }} />
      <Box px={3} pb={3}>
        <Typography variant="body2" color="#b0b0ff">
          &copy; {new Date().getFullYear()} AI Teaching Assistant
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar; 