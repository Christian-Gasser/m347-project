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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';

export default function SpaceDetail() {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [semesters, setSemesters] = useState([]);
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
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Spaces
        </Link>
        <Typography color="text.primary">{space?.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
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

      <Grid container spacing={3}>
        {semesters.map((semester) => (
          <Grid item xs={12} sm={6} md={4} key={semester.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => handleSemesterClick(semester.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {semester.name}
                  </Typography>
                  <Box onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditSemester(semester)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSemester(semester.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Click to view subjects
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateSemester}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSemester ? 'Edit Semester' : 'Create New Semester'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Semester Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveSemester}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingSemester ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}