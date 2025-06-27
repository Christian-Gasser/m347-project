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
  Avatar,
  alpha,
  Grow,
  Fade,
  Slide,
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
  TrendingUp as TrendingUpIcon,
  GpsFixed as TargetIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';
import { LineChart, DonutChart, BarChart, RadarChart } from './charts/GradeChart';
import { AnimatedStatCard, GradeInsightCard } from './charts/StatCard';
import { 
  calculateGPA, 
  calculateTrend, 
  generateTimeSeriesData, 
  generateInsights,
  getPerformanceMetrics,
  predictNextGrade 
} from '../utils/gradeAnalytics';

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
  const [analytics, setAnalytics] = useState({
    gpa: 0,
    trend: 0,
    metrics: {},
    insights: [],
    timeSeriesData: [],
    prediction: null,
  });
  const [dashboardVisible, setDashboardVisible] = useState(false);
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
      
      // Calculate analytics
      const gpa = calculateGPA(gradesData);
      const trend = calculateTrend(gradesData);
      const metrics = getPerformanceMetrics(gradesData);
      const insights = generateInsights(gradesData, gpa, trend);
      const timeSeriesData = generateTimeSeriesData(gradesData);
      const prediction = predictNextGrade(gradesData);
      
      setAnalytics({
        gpa,
        trend,
        metrics,
        insights,
        timeSeriesData,
        prediction,
      });
      
      setError(null);
      
      // Trigger dashboard animation
      setTimeout(() => setDashboardVisible(true), 300);
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
          <Button
            variant="text"
            onClick={() => navigate(`/spaces/${spaceId}`)}
            startIcon={<SchoolIcon />}
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
            {space?.name}
          </Button>
          <Button
            variant="text"
            onClick={() => navigate(`/spaces/${spaceId}/semesters/${semesterId}`)}
            startIcon={<CalendarIcon />}
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
            {semester?.name}
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1,
              borderRadius: '12px',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(156, 39, 176, 0.1)' 
                : 'rgba(156, 39, 176, 0.08)',
              border: `1px solid ${alpha('#9c27b0', 0.2)}`,
            }}
          >
            <AssessmentIcon 
              sx={{ 
                mr: 1, 
                fontSize: 18,
                color: theme.palette.mode === 'dark' ? '#ba68c8' : '#9c27b0',
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#ba68c8' : '#9c27b0',
              }}
            >
              {subject?.name}
            </Typography>
          </Box>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
          {subject?.name} - Grades
        </Typography>
        {grades.length > 0 && (
          <Box sx={{
            px: 4,
            py: 2,
            borderRadius: '20px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#3B82F6', 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6, #9333EA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}>
              <AssessmentIcon sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                display: 'block',
              }}>
                Overall Performance
              </Typography>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #3B82F6, #9333EA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {calculateWeightedAverage()}/6.0
              </Typography>
            </Box>
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
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', py: 8, px: 6 }}>
            <Grow in timeout={1000}>
              <Box
                sx={{
                  width: 140,
                  height: 140,
                  mx: 'auto',
                  mb: 4,
                  borderRadius: '50%',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
                  border: `2px solid ${alpha('#3B82F6', 0.2)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backdropFilter: 'blur(20px)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -12,
                    borderRadius: '50%',
                    padding: '2px',
                    background: 'linear-gradient(45deg, #3B82F6, #9333EA)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    opacity: 0.4,
                    animation: 'rotate 8s linear infinite',
                  },
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <TimelineIcon 
                  sx={{ 
                    fontSize: 56, 
                    color: theme.palette.mode === 'dark' ? '#60A5FA' : '#3B82F6',
                    filter: 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.5))',
                  }} 
                />
              </Box>
            </Grow>
            
            <Slide direction="up" in timeout={1200}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  mb: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #60A5FA 30%, #A78BFA 90%)'
                    : 'linear-gradient(45deg, #3B82F6 30%, #9333EA 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Analytics Ready
              </Typography>
            </Slide>
            
            <Slide direction="up" in timeout={1400}>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  mb: 5,
                  fontSize: '1.2rem',
                  lineHeight: 1.6,
                  maxWidth: '500px',
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Start your academic journey and unlock powerful insights. 
                Every grade becomes data that drives your success.
              </Typography>
            </Slide>
            
            <Grow in timeout={1600}>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleCreateGrade} 
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: '20px',
                  px: 6,
                  py: 2,
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #3B82F6, #9333EA)',
                  boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 16px 40px rgba(59, 130, 246, 0.5)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Launch Dashboard
              </Button>
            </Grow>
          </Box>
        </Fade>
      ) : (
        <Fade in={dashboardVisible} timeout={600}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            {/* Analytics Dashboard */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Key Metrics Row */}
              <Grid item xs={12} sm={6} md={3}>
                <AnimatedStatCard
                  title="Current GPA"
                  value={analytics.gpa}
                  maxValue={6}
                  icon={SpeedIcon}
                  color="#3B82F6"
                  trend={analytics.trend}
                  delay={100}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnimatedStatCard
                  title="Best Grade"
                  value={analytics.metrics.bestGrade || 0}
                  maxValue={6}
                  icon={TrophyIcon}
                  color="#10B981"
                  delay={200}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnimatedStatCard
                  title="Consistency"
                  value={analytics.metrics.consistency || 0}
                  maxValue={100}
                  suffix="%"
                  icon={TargetIcon}
                  color="#F59E0B"
                  delay={300}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnimatedStatCard
                  title="Total Grades"
                  value={analytics.metrics.totalGrades || 0}
                  icon={BarChartIcon}
                  color="#8B5CF6"
                  delay={400}
                />
              </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <Grow in={dashboardVisible} timeout={800}>
                  <Box>
                    <Box sx={{ minHeight: '280px' }}>
                      <DonutChart
                        value={analytics.gpa}
                        maxValue={6}
                        title="Current GPA"
                        color="#3B82F6"
                      />
                    </Box>
                  </Box>
                </Grow>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grow in={dashboardVisible} timeout={1000}>
                  <Box>
                    <Box sx={{ minHeight: '280px' }}>
                      {analytics.timeSeriesData.length > 0 && (
                        <LineChart
                          data={analytics.timeSeriesData}
                          title="Grade Progression"
                          color="#10B981"
                        />
                      )}
                    </Box>
                  </Box>
                </Grow>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grow in={dashboardVisible} timeout={1200}>
                  <Box>
                    <Box sx={{ minHeight: '280px' }}>
                      <BarChart
                        data={[
                          { label: 'Excellent', value: grades.filter(g => g.grade >= 5.5).length },
                          { label: 'Good', value: grades.filter(g => g.grade >= 4.5 && g.grade < 5.5).length },
                          { label: 'Average', value: grades.filter(g => g.grade >= 3.5 && g.grade < 4.5).length },
                          { label: 'Poor', value: grades.filter(g => g.grade < 3.5).length },
                        ]}
                        title="Grade Distribution"
                        color="#F59E0B"
                      />
                    </Box>
                  </Box>
                </Grow>
              </Grid>
            </Grid>

            {/* Advanced Analytics Row */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <Slide direction="right" in={dashboardVisible} timeout={1200}>
                  <Box>
                    <Box sx={{ minHeight: '320px' }}>
                      <GradeInsightCard insights={analytics.insights} delay={600} />
                    </Box>
                  </Box>
                </Slide>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grow in={dashboardVisible} timeout={1400}>
                  <Box>
                    <Box sx={{ minHeight: '320px' }}>
                      <RadarChart
                        data={[
                          { label: 'Accuracy', value: analytics.metrics.consistency || 50 },
                          { label: 'Performance', value: (analytics.gpa / 6) * 100 },
                          { label: 'Trend', value: Math.max(0, Math.min(100, 50 + analytics.trend)) },
                          { label: 'Progress', value: Math.min(100, grades.length * 10) },
                          { label: 'Quality', value: (analytics.metrics.bestGrade / 6) * 100 || 0 },
                        ]}
                        title="Performance Radar"
                        color="#8B5CF6"
                      />
                    </Box>
                  </Box>
                </Grow>
              </Grid>
              <Grid item xs={12} md={4}>
                <Slide direction="left" in={dashboardVisible} timeout={1600}>
                  <Box>
                    {analytics.prediction && (
                      <Box sx={{
                        p: 4,
                        borderRadius: '24px',
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha('#8B5CF6', 0.2)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '320px',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #8B5CF6, #A855F7)',
                          opacity: 0.6,
                        },
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                          }}>
                            <Typography sx={{ fontSize: 24 }}>🔮</Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              color: '#8B5CF6',
                              mb: 0.5,
                            }}>
                              Grade Prediction
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              AI-powered forecast
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 800,
                          background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 2,
                        }}>
                          {analytics.prediction.predicted.toFixed(1)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            background: alpha('#8B5CF6', 0.1),
                            overflow: 'hidden',
                          }}>
                            <Box sx={{
                              width: `${analytics.prediction.confidence * 100}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #8B5CF6, #A855F7)',
                              borderRadius: 3,
                            }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {(analytics.prediction.confidence * 100).toFixed(0)}% confidence
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Slide>
              </Grid>
            </Grid>

            {/* Modern Grades Table */}
            <Fade in={dashboardVisible} timeout={1600}>
              <Box sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}>
                <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Grade History
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Assessment</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Grade</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Weight</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {grades.map((grade, index) => (
                        <Grow key={grade.id} in timeout={800 + index * 100}>
                          <TableRow 
                            hover 
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              },
                            }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>{grade.name}</TableCell>
                            <TableCell>
                              <Chip
                                label={grade.grade.toFixed(1)}
                                color={getGradeColor(grade.grade)}
                                size="medium"
                                sx={{ 
                                  fontWeight: 600,
                                  minWidth: 60,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${grade.gradeWeight}x`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>
                              {grade.examDate ? new Date(grade.examDate).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditGrade(grade)}
                                  sx={{ 
                                    borderRadius: 2,
                                    '&:hover': { 
                                      backgroundColor: alpha('#F59E0B', 0.1),
                                      color: '#F59E0B',
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteGrade(grade.id)}
                                  sx={{ 
                                    borderRadius: 2,
                                    '&:hover': { 
                                      backgroundColor: alpha('#EF4444', 0.1),
                                      color: '#EF4444',
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        </Grow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Fade>
          </Box>
        </Fade>
      )}

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
        onClick={handleCreateGrade}
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
              background: `linear-gradient(90deg, #9c27b0, #e91e63, #9c27b0)`,
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
                background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                border: `3px solid ${alpha('#9c27b0', 0.2)}`,
                boxShadow: '0 8px 24px rgba(156, 39, 176, 0.3)',
              }}
            >
              <AssessmentIcon sx={{ fontSize: 36, color: 'white' }} />
            </Avatar>
            <Typography variant="h4" component="div" sx={{ 
              fontWeight: 700,
              mb: 1,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #ba68c8 30%, #f06292 90%)'
                : 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {editingGrade ? 'Edit Grade' : 'New Grade'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              {editingGrade 
                ? 'Update your grade details' 
                : 'Record a new grade entry'
              }
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 2, pt: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Grade Name"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Midterm Exam, Quiz 1, Final Project"
                sx={{
                  height: 'auto',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '56px',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                        : '0 4px 12px rgba(156, 39, 176, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      boxShadow: `0 4px 12px rgba(156, 39, 176, 0.15)`,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9c27b0',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#9c27b0',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px',
                    fontSize: '1.1rem',
                    height: '24px',
                    boxSizing: 'border-box',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Grade Score"
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ 
                  min: 1, 
                  max: 6, 
                  step: 0.1
                }}
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                helperText="Scale: 1.0 - 6.0"
                FormHelperTextProps={{
                  sx: {
                    mt: 1,
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    minHeight: '20px',
                    lineHeight: '20px',
                  },
                }}
                sx={{
                  height: 'auto !important',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '56px !important',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                        : '0 4px 12px rgba(156, 39, 176, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      boxShadow: `0 4px 12px rgba(156, 39, 176, 0.15)`,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9c27b0',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#9c27b0',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px !important',
                    fontSize: '1.1rem !important',
                    height: '24px !important',
                    boxSizing: 'border-box !important',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Weight Factor"
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ 
                  min: 0.1, 
                  step: 0.1,
                  style: { height: '24px' }
                }}
                value={formData.gradeWeight}
                onChange={(e) => setFormData({ ...formData, gradeWeight: e.target.value })}
                helperText="Importance factor"
                FormHelperTextProps={{
                  sx: {
                    mt: 1,
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    minHeight: '20px',
                    lineHeight: '20px',
                  },
                }}
                sx={{
                  height: 'auto',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '56px',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                        : '0 4px 12px rgba(156, 39, 176, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      boxShadow: `0 4px 12px rgba(156, 39, 176, 0.15)`,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9c27b0',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#9c27b0',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px',
                    fontSize: '1.1rem',
                    height: '24px',
                    boxSizing: 'border-box',
                  },
                }}
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
                helperText="When was this assessment taken?"
                FormHelperTextProps={{
                  sx: {
                    mt: 1,
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    minHeight: '20px',
                    lineHeight: '20px',
                  },
                }}
                sx={{
                  height: 'auto',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '56px',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                        : '0 4px 12px rgba(156, 39, 176, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      boxShadow: `0 4px 12px rgba(156, 39, 176, 0.15)`,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9c27b0',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#9c27b0',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px',
                    fontSize: '1.1rem',
                    height: '24px',
                    boxSizing: 'border-box',
                  },
                }}
              />
            </Grid>
          </Grid>
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
            onClick={handleSaveGrade}
            variant="contained"
            size="large"
            disabled={
              !formData.name.trim() ||
              !formData.grade ||
              !formData.gradeWeight ||
              parseFloat(formData.grade) < 1 ||
              parseFloat(formData.grade) > 6
            }
            sx={{
              borderRadius: '16px',
              px: 5,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e91e63, #9c27b0)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(156, 39, 176, 0.4)',
              },
              '&:disabled': {
                background: alpha(theme.palette.text.primary, 0.1),
                color: alpha(theme.palette.text.primary, 0.3),
              },
            }}
          >
            {editingGrade ? 'Update Grade' : 'Add Grade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}