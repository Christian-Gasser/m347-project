import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import SpaceList from './components/SpaceList';
import SpaceDetail from './components/SpaceDetail';
import SemesterDetail from './components/SemesterDetail';
import SubjectDetail from './components/SubjectDetail';
import Footer from './components/Footer';
import './App.css';

// Initialize theme from localStorage synchronously for fast loading
const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    // Fallback to system preference if no saved preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
    return false; // Default to light mode
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    
    // Save theme preference to localStorage
    try {
      localStorage.setItem('themePreference', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [darkMode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
        dark: darkMode ? '#42a5f5' : '#115293',
        light: darkMode ? '#e3f2fd' : '#42a5f5',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
        dark: darkMode ? '#e91e63' : '#9a0036',
        light: darkMode ? '#fce4ec' : '#ff5983',
      },
      background: {
        default: 'transparent',
        paper: darkMode ? 'rgba(22, 28, 36, 0.6)' : 'rgba(255, 255, 255, 0.15)',
      },
      text: {
        primary: darkMode ? '#e8eaed' : '#101218',
        secondary: darkMode ? '#9aa0a6' : '#4a5568',
      },
      divider: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.25)',
      success: {
        main: '#34a853',
      },
      warning: {
        main: '#9aa0a6',
      },
      error: {
        main: '#ea4335',
      },
    },
    typography: {
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '0.875rem',
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: darkMode ? [
      'none', 'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)',
      'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)',
      'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)',
      'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)',
      'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)',
      'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)', 'var(--dark-shadow)',
      'var(--dark-shadow)'
    ] : [
      'none', 'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)',
      'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)',
      'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)',
      'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)',
      'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)',
      'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)', 'var(--light-shadow)',
      'var(--light-shadow)'
    ],
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backdropFilter: 'blur(20px)',
            backgroundColor: darkMode ? 'rgba(22, 28, 36, 0.7)' : 'var(--light-glass-bg)',
            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.15)' : 'var(--light-glass-border)'}`,
            boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : 'var(--light-shadow)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: darkMode 
                ? '0 20px 40px rgba(0, 0, 0, 0.6)' 
                : '0 20px 40px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '10px 24px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: darkMode 
                ? '0 8px 16px rgba(0,0,0,0.4)' 
                : '0 8px 16px rgba(0,0,0,0.1)',
            },
          },
          contained: {
            boxShadow: darkMode 
              ? '0 4px 8px rgba(0,0,0,0.3)' 
              : '0 4px 8px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            backdropFilter: 'blur(20px)',
            backgroundColor: darkMode ? 'rgba(22, 28, 36, 0.8)' : 'var(--light-glass-bg)',
            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.15)' : 'var(--light-glass-border)'}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            height: 8,
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  }), [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflowX: 'hidden',
          width: '100%',
        }}
      >
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            pt: '8rem',
            pb: 16,
            minHeight: 'calc(112vh - 8rem)',
          }}
        >
          <Routes>
            <Route path="/" element={<SpaceList />} />
            <Route path="/spaces/:spaceId" element={<SpaceDetail />} />
            <Route path="/spaces/:spaceId/semesters/:semesterId" element={<SemesterDetail />} />
            <Route path="/spaces/:spaceId/semesters/:semesterId/subjects/:subjectId" element={<SubjectDetail />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}