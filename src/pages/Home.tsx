import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Sidebar from './Sidebar';
import ForumIcon from '@mui/icons-material/Forum';

// Demo data for posts and comments
const demoPosts = [
  {
    id: 1,
    author: 'Alice',
    role: 'Student',
    avatar: '',
    content: 'What is the deadline for Assignment 2?',
    comments: [
      {
        id: 1,
        author: 'Dr. Smith',
        role: 'Prof',
        avatar: '',
        content: 'The deadline is next Friday at 5pm.',
      },
      {
        id: 2,
        author: 'TA John',
        role: 'TA',
        avatar: '',
        content: 'You can find all deadlines on the course website.',
      },
    ],
  },
  {
    id: 2,
    author: 'Bob',
    role: 'Student',
    avatar: '',
    content: 'Will there be a review session before the midterm?',
    comments: [
      {
        id: 1,
        author: 'TA Jane',
        role: 'TA',
        avatar: '',
        content: 'Yes, we will announce the date soon!',
      },
    ],
  },
];

const demoAnnouncements = [
  {
    id: 1,
    author: 'Dr. Smith',
    role: 'Prof',
    avatar: '',
    content: 'Midterm exam will be held on March 15th in Room 101.',
  },
  {
    id: 2,
    author: 'Dr. Smith',
    role: 'Prof',
    avatar: '',
    content: 'Assignment 2 is now available on the portal.',
  },
];

function Home(): React.JSX.Element {
  const [question, setQuestion] = useState('');
  const [announcement, setAnnouncement] = useState('');
  // For demo, posts/announcements are not updated on submit

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f4f6f9">
      <Sidebar />
      <Box
        component="main"
        alignItems="center" 
        justifyContent="center"
        sx={{
          p: 3,
          ml: { sm: '380px' }, // Assumes a 240px sidebar, adjust if needed
        }}
      >
        {/* Announcements Card - will now take full width of the main area */}
        <Paper elevation={3} sx={{
    mb: 3,
    p: 3,
    borderRadius: 3,
    width: '150%', // take full available width
    mx: 'auto', // center it horizontally
  }}>
          <Box display="flex" alignItems="center" mb={2}>
            <AnnouncementIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={700} color="#1976d2">
              Announcements
            </Typography>
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              placeholder="Write an announcement..."
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              size="small"
            />
            <Button variant="contained" color="primary" endIcon={<SendIcon />} disabled>
              POST
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {demoAnnouncements.map(a => (
              <ListItem key={a.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{a.author[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight={600}>{a.author} <span style={{ color: '#1976d2', fontSize: 13 }}>({a.role})</span></Typography>}
                  secondary={a.content}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Q&A Card - will also take full width of the main area */}
        <Paper elevation={3} sx={{
    mb: 3,
    p: 3,
    borderRadius: 3,
    width: '150%', // take full available width
    mx: 'auto', // center it horizontally
  }}>
          <Box display="flex" alignItems="center" mb={2}>
            <ForumIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={700} color="#1976d2">
              Q&A Forum
            </Typography>
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              placeholder="Ask a question..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              size="small"
            />
            <Button variant="contained" color="primary" endIcon={<SendIcon />} disabled>
              POST
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {demoPosts.map(post => (
            <Card key={post.id} sx={{ mb: 2, borderRadius: 3, boxShadow: 1, width: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ mr: 1 }}>{post.author[0]}</Avatar>
                  <Typography fontWeight={600}>{post.author} <span style={{ color: '#1976d2', fontSize: 13 }}>({post.role})</span></Typography>
                </Box>
                <Typography sx={{ mb: 2 }}>{post.content}</Typography>
                {post.comments.map(comment => (
                  <Box key={comment.id} display="flex" alignItems="center" ml={4} mb={1}>
                    <Avatar sx={{ width: 28, height: 28, mr: 1, fontSize: 14 }}>{comment.author[0]}</Avatar>
                    <Typography fontWeight={500}>{comment.author} <span style={{ color: '#1976d2', fontSize: 12 }}>({comment.role})</span>:</Typography>
                    <Typography sx={{ ml: 1 }}>{comment.content}</Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions sx={{ pl: 7 }}>
                <TextField size="small" placeholder="Reply..." sx={{ flex: 1 }} disabled />
                <IconButton color="primary" disabled><SendIcon /></IconButton>
              </CardActions>
            </Card>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}

export default Home;