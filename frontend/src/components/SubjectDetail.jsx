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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Grade as GradeIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';
import StatisticsCard from './StatisticsCard';

export default function SubjectDetail() {
  const { spaceId, semesterId, subjectId } = useParams();
  const [space, setSpace] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    examDate: '',
    gradeWeight: '',
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, [spaceId, semesterId, subjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const [spaceData, semesterData, subjectData, gradesData] = await Promise.all([
        ApiService.getSpace(spaceId),
        ApiService.getSemester(spaceId, semesterId),
        ApiService.getSubject(spaceId, semesterId, subjectId),
        ApiService.getGrades(spaceId, semesterId, subjectId),
      ]);
      setSpace(spaceData);
      setSemester(semesterData);
      setSubject(subjectData);
      setGrades(gradesData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrade = () => {
    setEditingGrade(null);
    setFormData({
      name: '',
      grade: '',
      examDate: new Date().toISOString().split('T')[0],
      gradeWeight: '1.0',
    });
    setDialogOpen(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setFormData({
      name: grade.name,
      grade: grade.grade.toString(),
      examDate: grade.examDate ? grade.examDate.split('T')[0] : '',
      gradeWeight: grade.gradeWeight.toString(),
    });
    setDialogOpen(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await ApiService.deleteGrade(spaceId, semesterId, subjectId, gradeId);
        await loadData();
      } catch (err) {
        setError('Failed to delete grade');
        console.error('Error deleting grade:', err);
      }
    }
  };

  const handleSaveGrade = async () => {
    try {
      const gradeData = {
        name: formData.name,
        grade: parseFloat(formData.grade),
        examDate: formData.examDate,
        gradeWeight: parseFloat(formData.gradeWeight),
      };

      if (editingGrade) {
        await ApiService.updateGrade(spaceId, semesterId, subjectId, editingGrade.id, gradeData);
      } else {
        await ApiService.createGrade(spaceId, semesterId, subjectId, gradeData);
      }
      setDialogOpen(false);
      await loadData();
    } catch (err) {
      setError('Failed to save grade');
      console.error('Error saving grade:', err);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 5.5) return 'success';
    if (grade >= 4.0) return 'warning';
    return 'error';
  };

  const calculateWeightedAverage = () => {
    if (grades.length === 0) return 0;
    const totalWeight = grades.reduce((sum, g) => sum + g.gradeWeight, 0);
    const weightedSum = grades.reduce((sum, g) => sum + (g.grade * g.gradeWeight), 0);
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="500px" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="400px" height={32} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="rectangular" width="100%" height={300} />
              </CardContent>
            </Card>
          </Grid>
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
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/spaces/${spaceId}/semesters/${semesterId}`)}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <CalendarIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {semester?.name}
        </Link>
        <Typography color="text.primary">{subject?.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {subject?.name} - Grades
        </Typography>
        {grades.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssessmentIcon color="primary" />
            <Typography variant="h6" color="primary">
              Average: {calculateWeightedAverage()}
            </Typography>
          </Box>
        )}
      </Box>

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

      {grades.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <GradeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No grades yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first grade to start tracking your performance
            </Typography>
            <Button variant="contained" onClick={handleCreateGrade} startIcon={<AddIcon />}>
              Add First Grade
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StatisticsCard grades={grades} title={`${subject?.name} Statistics`} />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Grade</strong></TableCell>
                    <TableCell><strong>Weight</strong></TableCell>
                    <TableCell><strong>Exam Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id} hover>
                      <TableCell>{grade.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={grade.grade.toFixed(1)}
                          color={getGradeColor(grade.grade)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{grade.gradeWeight}x</TableCell>
                      <TableCell>
                        {grade.examDate ? new Date(grade.examDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditGrade(grade)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGrade(grade.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateGrade}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGrade ? 'Edit Grade' : 'Add New Grade'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Grade Name"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Midterm Exam, Quiz 1"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Grade"
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ min: 1, max: 6, step: 0.1 }}
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                helperText="Scale: 1.0 - 6.0"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Weight"
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ min: 0.1, step: 0.1 }}
                value={formData.gradeWeight}
                onChange={(e) => setFormData({ ...formData, gradeWeight: e.target.value })}
                helperText="Importance factor"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Exam Date"
                fullWidth
                variant="outlined"
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveGrade}
            variant="contained"
            disabled={
              !formData.name.trim() ||
              !formData.grade ||
              !formData.gradeWeight ||
              parseFloat(formData.grade) < 1 ||
              parseFloat(formData.grade) > 6
            }
          >
            {editingGrade ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}