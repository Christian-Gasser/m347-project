import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

export default function StatisticsCard({ grades, title = "Grade Statistics" }) {
  if (!grades || grades.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No grades available for analysis
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const calculateStats = () => {
    const gradeValues = grades.map(g => g.grade);
    const weights = grades.map(g => g.gradeWeight);
    
    // Basic statistics
    const average = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
    const weightedSum = grades.reduce((sum, g) => sum + (g.grade * g.gradeWeight), 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const weightedAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
    
    const highest = Math.max(...gradeValues);
    const lowest = Math.min(...gradeValues);
    
    // Grade distribution
    const excellent = gradeValues.filter(g => g >= 5.5).length;
    const good = gradeValues.filter(g => g >= 4.5 && g < 5.5).length;
    const satisfactory = gradeValues.filter(g => g >= 4.0 && g < 4.5).length;
    const unsatisfactory = gradeValues.filter(g => g < 4.0).length;
    
    // Pass rate (assuming 4.0 is passing)
    const passRate = (gradeValues.filter(g => g >= 4.0).length / gradeValues.length) * 100;
    
    // Trend (comparing first half vs second half)
    const midpoint = Math.floor(gradeValues.length / 2);
    const firstHalf = gradeValues.slice(0, midpoint);
    const secondHalf = gradeValues.slice(midpoint);
    
    let trend = 'stable';
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstAvg = firstHalf.reduce((sum, g) => sum + g, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, g) => sum + g, 0) / secondHalf.length;
      if (secondAvg > firstAvg + 0.2) trend = 'improving';
      else if (secondAvg < firstAvg - 0.2) trend = 'declining';
    }
    
    return {
      average: average.toFixed(2),
      weightedAverage: weightedAverage.toFixed(2),
      highest: highest.toFixed(1),
      lowest: lowest.toFixed(1),
      total: gradeValues.length,
      distribution: { excellent, good, satisfactory, unsatisfactory },
      passRate: passRate.toFixed(1),
      trend,
    };
  };

  const stats = calculateStats();

  const getGradeColor = (grade) => {
    if (grade >= 5.5) return 'success';
    if (grade >= 4.0) return 'warning';
    return 'error';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUpIcon color="success" />;
      case 'declining':
        return <TrendingDownIcon color="error" />;
      default:
        return <AssessmentIcon color="primary" />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getTrendIcon(stats.trend)}
            <Typography variant="caption" sx={{ ml: 0.5, textTransform: 'capitalize' }}>
              {stats.trend}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.weightedAverage}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Weighted Average
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {stats.average}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Simple Average
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label={stats.highest}
                color={getGradeColor(parseFloat(stats.highest))}
                size="small"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Highest
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label={stats.lowest}
                color={getGradeColor(parseFloat(stats.lowest))}
                size="small"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Lowest
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Pass Rate
            </Typography>
            <Typography variant="body2" color="primary">
              {stats.passRate}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={parseFloat(stats.passRate)}
            color={parseFloat(stats.passRate) >= 80 ? 'success' : parseFloat(stats.passRate) >= 60 ? 'warning' : 'error'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Grade Distribution ({stats.total} grades)
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {stats.distribution.excellent}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Excellent (≥5.5)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {stats.distribution.good}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Good (4.5-5.4)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {stats.distribution.satisfactory}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  OK (4.0-4.4)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">
                  {stats.distribution.unsatisfactory}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Poor (&lt;4.0)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}