import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import LectureView from './pages/LectureView';
import Chat from './pages/Chat';
import Lectures from './pages/Lectures';

const Announcements = () => <div style={{ marginLeft: 270, padding: 32 }}><h2>Announcements Page (Coming Soon)</h2></div>;
const Questions = () => <div style={{ marginLeft: 270, padding: 32 }}><h2>Q&A Page (Coming Soon)</h2></div>;

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lecture/:id" element={<LectureView />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 