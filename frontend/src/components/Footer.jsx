import React from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  Chip,
  Avatar,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import {
  School as SchoolIcon,
  Code as CodeIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Copyright as CopyrightIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import christianImage from '../assets/christian.png';
import timImage from '../assets/AdminGodZ.jpeg';

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(22, 28, 36, 0.95) 0%, rgba(16, 18, 24, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        },
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }}
    >
      <Box sx={{ 
        width: '100%', 
        py: { xs: 2, sm: 3 }, 
        px: { xs: 2, sm: 4, md: 6 },
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Top Section with Logo and Tagline */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                mr: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <SchoolIcon sx={{ fontSize: 28, color: 'white' }} />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #115293 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Grades Management
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '1.1rem',
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Empowering students to track, analyze, and excel in their academic journey
          </Typography>
        </Box>

        {/* Decorative Divider */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Divider 
            sx={{ 
              flexGrow: 1, 
              opacity: theme.palette.mode === 'dark' ? 0.6 : 0.4,
              borderColor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.primary.main, 0.3)
                : alpha(theme.palette.text.primary, 0.2),
              borderWidth: '1px',
            }} 
          />
          <Box sx={{ px: 3, display: 'flex', gap: 1 }}>
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  animation: `pulse 2s ease-in-out infinite ${i * 0.3}s`,
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                  },
                }}
              />
            ))}
          </Box>
          <Divider 
            sx={{ 
              flexGrow: 1, 
              opacity: theme.palette.mode === 'dark' ? 0.6 : 0.4,
              borderColor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.primary.main, 0.3)
                : alpha(theme.palette.text.primary, 0.2),
              borderWidth: '1px',
            }} 
          />
        </Box>

        {/* Developer Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <CodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Crafted with Excellence
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
            {/* Christian G. */}
            <Link
              href="https://github.com/Christian-Gasser"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: '20px',
                  background: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 32px rgba(0, 0, 0, 0.3)'
                      : '0 12px 32px rgba(0, 0, 0, 0.1)',
                    background: alpha(theme.palette.background.paper, 0.8),
                    '&::before': {
                      opacity: 1,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                }}
              >
                <Avatar
                  src={christianImage}
                  sx={{
                    width: 56,
                    height: 56,
                    mb: 2,
                    border: '3px solid transparent',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'padding-box',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    zIndex: 1,
                  }}
                >
                  CG
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, zIndex: 1 }}>
                  Christian G.
                </Typography>
                <Chip
                  size="small"
                  label="Backend Developer"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    fontWeight: 600,
                    zIndex: 1,
                    mb: 1,
                  }}
                />
                <Tooltip title="Visit GitHub Profile" arrow>
                  <GitHubIcon 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: 20,
                      zIndex: 1,
                      opacity: 0.7,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.1)',
                      },
                    }} 
                  />
                </Tooltip>
              </Box>
            </Link>

            {/* Tim H. */}
            <Link
              href="https://github.com/AdminGodZ"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: '20px',
                  background: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 32px rgba(0, 0, 0, 0.3)'
                      : '0 12px 32px rgba(0, 0, 0, 0.1)',
                    background: alpha(theme.palette.background.paper, 0.8),
                    '&::before': {
                      opacity: 1,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                }}
              >
                <Avatar
                  src={timImage}
                  sx={{
                    width: 56,
                    height: 56,
                    mb: 2,
                    border: '3px solid transparent',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    backgroundClip: 'padding-box',
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
                    zIndex: 1,
                  }}
                >
                  TH
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, zIndex: 1 }}>
                  Tim H.
                </Typography>
                <Chip
                  size="small"
                  label="Frontend Developer"
                  sx={{
                    background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                    color: 'white',
                    fontWeight: 600,
                    zIndex: 1,
                    mb: 1,
                  }}
                />
                <Tooltip title="Visit GitHub Profile" arrow>
                  <GitHubIcon 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: 20,
                      zIndex: 1,
                      opacity: 0.7,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.1)',
                      },
                    }} 
                  />
                </Tooltip>
              </Box>
            </Link>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Built with
            </Typography>
            <Tooltip title="Love for coding" arrow>
              <FavoriteIcon sx={{ color: '#e91e63', fontSize: 20 }} />
            </Tooltip>
            <Typography variant="body1" color="text.secondary">
              and modern technology
            </Typography>
            <Tooltip title="Quality assured" arrow>
              <StarIcon sx={{ color: '#ffc107', fontSize: 20 }} />
            </Tooltip>
          </Box>
        </Box>

        {/* Copyright Section */}
        <Box
          sx={{
            textAlign: 'center',
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <CopyrightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {currentYear} Grades Management App. Developed by
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Link
                href="https://github.com/Christian-Gasser"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #90caf9, #42a5f5)'
                      : 'linear-gradient(45deg, #1976d2, #115293)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      filter: 'brightness(1.2)',
                    },
                  }}
                >
                  Christian G.
                </Typography>
              </Link>
              <Typography variant="body2" color="text.secondary">
                &
              </Typography>
              <Link
                href="https://github.com/AdminGodZ"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #90caf9, #42a5f5)'
                      : 'linear-gradient(45deg, #1976d2, #115293)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      filter: 'brightness(1.2)',
                    },
                  }}
                >
                  Tim H.
                </Typography>
              </Link>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
            All rights reserved. Made for academic excellence.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}