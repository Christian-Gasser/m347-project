import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Alert,
  Skeleton,
  Container,
  Avatar,
  Chip,
  CardActions,
  Grow,
  Zoom,
  Slide,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  FolderOpen as FolderOpenIcon,
  Explore as ExploreIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

export default function SpaceList() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getSpaces();
      setSpaces(data);
      setError(null);
    } catch (err) {
      setError('Failed to load spaces');
      console.error('Error loading spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = () => {
    setEditingSpace(null);
    setFormData({ name: '' });
    setDialogOpen(true);
  };

  const handleEditSpace = (space) => {
    setEditingSpace(space);
    setFormData({ name: space.name });
    setDialogOpen(true);
  };

  const handleDeleteSpace = async (spaceId) => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      try {
        await ApiService.deleteSpace(spaceId);
        await loadSpaces();
      } catch (err) {
        setError('Failed to delete space');
        console.error('Error deleting space:', err);
      }
    }
  };

  const handleSaveSpace = async () => {
    try {
      if (editingSpace) {
        await ApiService.updateSpace(editingSpace.id, formData);
      } else {
        await ApiService.createSpace(formData);
      }
      setDialogOpen(false);
      await loadSpaces();
    } catch (err) {
      setError('Failed to save space');
      console.error('Error saving space:', err);
    }
  };

  const handleSpaceClick = (spaceId) => {
    navigate(`/spaces/${spaceId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Skeleton variant="text" width="300px" height={60} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="200px" height={24} sx={{ mx: 'auto' }} />
          </Box>
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="70%" height={28} />
                        <Skeleton variant="text" width="50%" height={20} />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ width: '100%', px: 3 }}>
      <Box sx={{ py: 4, width: '100%' }}>
        {/* Header Section */}
        <Grow in timeout={800}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 800,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #115293 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Learning Spaces
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Organize your academic journey with dedicated spaces for different study areas
            </Typography>
          </Box>
        </Grow>

        {/* Error Alert */}
        <Box sx={{ mb: 3, minHeight: '60px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {error && (
            <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
              <Alert
                severity="error"
                sx={{
                  borderRadius: 3,
                  maxWidth: '600px',
                  width: '100%',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  py: 0.75,
                  px: 1.5,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(220, 38, 38, 0.15)'
                    : 'rgba(239, 68, 68, 0.1)',
                  color: theme.palette.mode === 'dark'
                    ? '#fca5a5'
                    : '#dc2626',
                  border: `1px solid ${theme.palette.mode === 'dark'
                    ? 'rgba(220, 38, 38, 0.3)'
                    : 'rgba(239, 68, 68, 0.3)'}`,
                  '& .MuiAlert-icon': {
                    fontSize: 18,
                    marginRight: 1,
                    padding: 0,
                    color: theme.palette.mode === 'dark'
                      ? '#f87171'
                      : '#dc2626',
                  },
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                  },
                  '& .MuiAlert-action': {
                    padding: 0,
                    marginRight: 0,
                    marginLeft: 'auto',
                  },
                  '& .MuiIconButton-root': {
                    padding: '4px',
                    color: theme.palette.mode === 'dark'
                      ? '#fca5a5'
                      : '#dc2626',
                  },
                }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </Slide>
          )}
        </Box>

        {/* Empty State */}
        {!loading && spaces.length === 0 && (
          <Grow in timeout={1000}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <ExploreIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Start Your Learning Journey
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                Create your first learning space to organize your academic content, track progress, and achieve your goals.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateSpace}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                }}
              >
                Create Your First Space
              </Button>
            </Box>
          </Grow>
        )}

        {/* Spaces Grid */}
        {spaces.length > 0 && (
          <Grid container spacing={4}>
            {spaces.map((space, index) => (
              <Grid item xs={12} sm={6} md={4} key={space.id}>
                <Grow in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, rgba(22,28,36,0.8) 0%, rgba(30,41,51,0.8) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '&:hover': {
                        '&::before': {
                          transform: 'scaleX(1)',
                        },
                      },
                    }}
                    onClick={() => handleSpaceClick(space.id)}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            mr: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                          }}
                        >
                          <FolderOpenIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mb: 0.5,
                            }}
                          >
                            {space.name}
                          </Typography>
                          <Chip
                            size="small"
                            label="Active"
                            color="success"
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.75rem',
                              height: 24,
                            }}
                          />
                        </Box>
                      </Box>

                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.03),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Quick Stats
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                              Ready to explore
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        startIcon={<ExploreIcon />}
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        Explore
                      </Button>
                      <Box onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditSpace(space)}
                          sx={{ 
                            mr: 1,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.warning.main, 0.1),
                              color: 'warning.main',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSpace(space.id)}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              color: 'error.main',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        {spaces.length > 0 && (
          <Zoom in timeout={1000}>
            <Fab
              color="primary"
              aria-label="add"
              sx={{ 
                position: 'fixed', 
                bottom: 24, 
                right: 24,
                width: 64,
                height: 64,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
              onClick={handleCreateSpace}
            >
              <AddIcon sx={{ fontSize: 28 }} />
            </Fab>
          </Zoom>
        )}

        {/* Create/Edit Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(22, 28, 36, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)'}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 24px 48px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)'
                : '0 24px 48px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
            },
          }}
        >
          <DialogTitle sx={{ 
            pt: 4, 
            pb: 2, 
            px: 4,
            background: 'transparent',
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <FolderOpenIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Avatar>
              <Typography variant="h4" component="div" sx={{ 
                fontWeight: 700,
                mb: 1,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #115293 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {editingSpace ? 'Edit Space' : 'New Space'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                {editingSpace 
                  ? 'Update your learning space details' 
                  : 'Create a new space to organize your studies'
                }
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ px: 4, pb: 2, pt: 3 }}>
            <TextField
              autoFocus
              label="Space Name"
              placeholder="e.g., Computer Science, Mathematics, Languages..."
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                      : '0 4px 12px rgba(0, 0, 0, 0.08)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px',
                  fontSize: '1.1rem',
                },
              }}
              helperText="Choose a descriptive name that represents your field of study"
              FormHelperTextProps={{
                sx: {
                  mt: 1.5,
                  mb: 1,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  textAlign: 'center',
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ 
            p: 4, 
            pt: 2, 
            gap: 2,
            justifyContent: 'center',
          }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              variant="outlined"
              size="large"
              sx={{ 
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                border: `2px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                color: 'text.secondary',
                '&:hover': {
                  border: `2px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSpace}
              variant="contained"
              size="large"
              disabled={!formData.name.trim()}
              sx={{
                borderRadius: '16px',
                px: 5,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                '&:disabled': {
                  background: alpha(theme.palette.text.primary, 0.1),
                  color: alpha(theme.palette.text.primary, 0.3),
                },
              }}
            >
              {editingSpace ? 'Update Space' : 'Create Space'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}