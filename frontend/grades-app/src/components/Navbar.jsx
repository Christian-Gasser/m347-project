import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Switch,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  School as SchoolIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        background: darkMode 
          ? 'rgba(22, 28, 36, 0.85)'
          : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: { xs: 'calc(100% - 1rem)', sm: 'calc(100% - 2rem)' },
        left: { xs: '0.5rem', sm: '1rem' },
        right: { xs: '0.5rem', sm: '1rem' },
        top: { xs: '0.5rem', sm: '1rem' },
        borderRadius: '20px',
        boxShadow: darkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
          : '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        zIndex: theme.zIndex.appBar + 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '20px',
          padding: '1px',
          background: darkMode
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.4))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'exclude',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        },
        '&:hover': {
          boxShadow: darkMode 
            ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        py: 1,
        minHeight: { xs: '56px !important', sm: '64px !important' },
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 3,
            p: 1.5,
            '&:hover': { 
              transform: 'scale(1.02)',
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
          onClick={() => navigate('/')}
        >
          <SchoolIcon 
            sx={{ 
              mr: 2, 
              fontSize: 28,
              color: theme.palette.primary.main,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }} 
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: darkMode
                ? 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #115293 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.25rem',
            }}
          >
            Grades Management
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip 
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            arrow
            placement="bottom"
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              p: 1,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              border: darkMode 
                ? `1px solid ${alpha(theme.palette.primary.main, 0.25)}`
                : `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                transform: 'scale(1.02)',
                border: darkMode 
                  ? `1px solid ${alpha(theme.palette.primary.main, 0.4)}`
                  : `1px solid ${alpha(theme.palette.text.primary, 0.25)}`,
              }
            }}>
              <LightModeIcon 
                sx={{ 
                  color: !darkMode ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontSize: 20,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: !darkMode ? 'drop-shadow(0 0 4px rgba(25, 118, 210, 0.3))' : 'none',
                }} 
              />
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase': {
                    '&.Mui-checked': {
                      '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                        opacity: 1,
                      },
                      '& .MuiSwitch-thumb': {
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      },
                    },
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.2),
                    borderRadius: 20,
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: theme.palette.text.primary,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  },
                }}
              />
              <DarkModeIcon 
                sx={{ 
                  color: darkMode ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontSize: 20,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: darkMode ? 'drop-shadow(0 0 4px rgba(144, 202, 249, 0.3))' : 'none',
                }} 
              />
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}