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
  Breadcrumbs,
  Link,
  useTheme,
  Avatar,
  alpha,
  Chip,
  CardActions,
  Grow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';

export default function SpaceDetail() {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [semestersWithSubjects, setSemestersWithSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, [spaceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const [spaceData, semestersData] = await Promise.all([
        ApiService.getSpace(spaceId),
        ApiService.getSemesters(spaceId),
      ]);
      setSpace(spaceData);
      setSemesters(semestersData);
      
      // Load subjects for each semester
      const semestersWithSubjectsData = await Promise.all(
        semestersData.map(async (semester) => {
          try {
            const subjects = await ApiService.getSubjects(spaceId, semester.id);
            return { ...semester, subjects: subjects.slice(0, 3) }; // Only show first 3
          } catch (err) {
            return { ...semester, subjects: [] };
          }
        })
      );
      
      setSemestersWithSubjects(semestersWithSubjectsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSemester = () => {
    setEditingSemester(null);
    setFormData({ name: '' });
    setDialogOpen(true);
  };

  const handleEditSemester = (semester) => {
    setEditingSemester(semester);
    setFormData({ name: semester.name });
    setDialogOpen(true);
  };

  const handleDeleteSemester = async (semesterId) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await ApiService.deleteSemester(spaceId, semesterId);
        await loadData();
      } catch (err) {
        setError('Failed to delete semester');
        console.error('Error deleting semester:', err);
      }
    }
  };

  const handleSaveSemester = async () => {
    try {
      if (editingSemester) {
        await ApiService.updateSemester(spaceId, editingSemester.id, formData);
      } else {
        await ApiService.createSemester(spaceId, formData);
      }
      setDialogOpen(false);
      await loadData();
    } catch (err) {
      setError('Failed to save semester');
      console.error('Error saving semester:', err);
    }
  };

  const handleSemesterClick = (semesterId) => {
    navigate(`/spaces/${spaceId}/semesters/${semesterId}`);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="300px" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="200px" height={32} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Box 
        sx={{ 
          mb: 4,
          px: 2,
          py: 1,
          borderRadius: '50px',
          width: 'fit-content',
          mx: 'auto',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(22,28,36,0.4) 0%, rgba(30,41,51,0.4) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(248,250,252,0.6) 100%)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.05)'}`,
        }}
      >
        <Breadcrumbs 
          separator="/"
          sx={{ 
            '& .MuiBreadcrumbs-ol': {
              alignItems: 'center',
            },
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: '12px',
              px: 2,
              py: 1,
              minHeight: 'auto',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
              },
            }}
          >
            Spaces
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1,
              borderRadius: '12px',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(59, 130, 246, 0.08)',
              border: `1px solid ${alpha('#3b82f6', 0.2)}`,
            }}
          >
            <SchoolIcon 
              sx={{ 
                mr: 1, 
                fontSize: 18,
                color: theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6',
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6',
              }}
            >
              {space?.name}
            </Typography>
          </Box>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        {space?.name} - Semesters
      </Typography>

      <Box sx={{ mb: 3, minHeight: '60px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              maxWidth: '800px',
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
              },
            }}
          >
            {error}
          </Alert>
        )}
      </Box>

      <Grid container spacing={5} justifyContent="center">
        {semestersWithSubjects.map((semester, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={semester.id}>
            <Grow in timeout={600 + index * 100}>
              <Card
                sx={{
                  minHeight: 280,
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
                    background: `linear-gradient(90deg, #ff9800, #ff5722)`,
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
                onClick={() => handleSemesterClick(semester.id)}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mr: 3,
                        backgroundColor: alpha('#ff9800', 0.1),
                        color: '#ff9800',
                        boxShadow: `0 4px 12px ${alpha('#ff9800', 0.2)}`,
                      }}
                    >
                      <ScheduleIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 1.5,
                          lineHeight: 1.2,
                        }}
                      >
                        {semester.name}
                      </Typography>
                      <Chip
                        size="medium"
                        label="Active"
                        sx={{ 
                          fontSize: '0.875rem',
                          height: 32,
                          fontWeight: 600,
                          px: 2,
                          background: 'linear-gradient(45deg, #ff9800, #ff5722)',
                          color: 'white',
                        }}
                      />
                    </Box>
                  </Box>

                  <Box 
                    sx={{ 
                      p: 3, 
                      borderRadius: 1.5,
                      backgroundColor: alpha('#ff9800', 0.05),
                      border: `1px solid ${alpha('#ff9800', 0.15)}`,
                      mb: 3,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                      Subjects ({semester.subjects?.length || 0})
                    </Typography>
                    {semester.subjects && semester.subjects.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {semester.subjects.map((subject) => (
                          <Box 
                            key={subject.id}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: alpha('#ff9800', 0.03),
                              '&:hover': {
                                backgroundColor: alpha('#ff9800', 0.08),
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: '#ff9800',
                                mr: 1.5,
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                              {subject.name}
                            </Typography>
                          </Box>
                        ))}
                        {semester.subjects.length === 3 && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
                            and more...
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No subjects yet
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 4, pt: 0, justifyContent: 'space-between' }}>
                  <Button
                    size="large"
                    startIcon={<ExploreIcon />}
                    sx={{
                      color: '#ff9800',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha('#ff9800', 0.08),
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    Explore
                  </Button>
                  <Box onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="medium"
                      onClick={() => handleEditSemester(semester)}
                      sx={{ 
                        mr: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.warning.main, 0.1),
                          color: 'warning.main',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      onClick={() => handleDeleteSemester(semester.id)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          color: 'error.main',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      <Fab
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: theme.palette.mode === 'dark' ? '#4a5568' : '#718096',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#4a5568',
          },
        }}
        onClick={handleCreateSemester}
      >
        <AddIcon />
      </Fab>

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
              background: `linear-gradient(90deg, #ff9800, #ff5722, #ff9800)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite',
            },
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' },
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
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                border: `3px solid ${alpha('#ff9800', 0.2)}`,
                boxShadow: '0 8px 24px rgba(255, 152, 0, 0.3)',
              }}
            >
              <CalendarIcon sx={{ fontSize: 36, color: 'white' }} />
            </Avatar>
            <Typography variant="h4" component="div" sx={{ 
              fontWeight: 700,
              mb: 1,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #ffb74d 30%, #ff8a65 90%)'
                : 'linear-gradient(45deg, #ff9800 30%, #ff5722 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {editingSemester ? 'Edit Semester' : 'New Semester'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              {editingSemester 
                ? 'Update your semester details' 
                : 'Create a new semester to organize your subjects'
              }
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 2, pt: 3 }}>
          <TextField
            autoFocus
            label="Semester Name"
            placeholder="e.g., Fall 2024, Spring 2025, Summer Term..."
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
                    : '0 4px 12px rgba(255, 152, 0, 0.1)',
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  boxShadow: `0 4px 12px rgba(255, 152, 0, 0.15)`,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff9800',
                    borderWidth: '2px',
                  },
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                '&.Mui-focused': {
                  color: '#ff9800',
                },
              },
              '& .MuiOutlinedInput-input': {
                padding: '16px',
                fontSize: '1.1rem',
              },
            }}
            helperText="Choose a descriptive name for your academic semester"
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
            onClick={handleSaveSemester}
            variant="contained"
            size="large"
            disabled={!formData.name.trim()}
            sx={{
              borderRadius: '16px',
              px: 5,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #ff9800, #ff5722)',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5722, #ff9800)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(255, 152, 0, 0.4)',
              },
              '&:disabled': {
                background: alpha(theme.palette.text.primary, 0.1),
                color: alpha(theme.palette.text.primary, 0.3),
              },
            }}
          >
            {editingSemester ? 'Update Semester' : 'Create Semester'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}