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
  Book as BookIcon,
  Home as HomeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';

export default function SemesterDetail() {
  const { spaceId, semesterId } = useParams();
  const [space, setSpace] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, [spaceId, semesterId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const [spaceData, semesterData, subjectsData] = await Promise.all([
        ApiService.getSpace(spaceId),
        ApiService.getSemester(spaceId, semesterId),
        ApiService.getSubjects(spaceId, semesterId),
      ]);
      setSpace(spaceData);
      setSemester(semesterData);
      setSubjects(subjectsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setFormData({ name: '' });
    setDialogOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name });
    setDialogOpen(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await ApiService.deleteSubject(spaceId, semesterId, subjectId);
        await loadData();
      } catch (err) {
        setError('Failed to delete subject');
        console.error('Error deleting subject:', err);
      }
    }
  };

  const handleSaveSubject = async () => {
    try {
      if (editingSubject) {
        await ApiService.updateSubject(spaceId, semesterId, editingSubject.id, formData);
      } else {
        await ApiService.createSubject(spaceId, semesterId, formData);
      }
      setDialogOpen(false);
      await loadData();
    } catch (err) {
      setError('Failed to save subject');
      console.error('Error saving subject:', err);
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/spaces/${spaceId}/semesters/${semesterId}/subjects/${subjectId}`);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="400px" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="300px" height={32} sx={{ mb: 3 }} />
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
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/spaces/${spaceId}`)}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {space?.name}
        </Link>
        <Typography color="text.primary">{semester?.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {semester?.name} - Subjects
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
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => handleSubjectClick(subject.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BookIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {subject.name}
                  </Typography>
                  <Box onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditSubject(subject)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSubject(subject.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Click to view grades
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
        onClick={handleCreateSubject}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSubject ? 'Edit Subject' : 'Create New Subject'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject Name"
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
            onClick={handleSaveSubject}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingSubject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}