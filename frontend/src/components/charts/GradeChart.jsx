import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: '12px',
          p: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color }}
          >
            {entry.name}: {entry.value.toFixed(1)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export const LineChart = ({ data, title, color = '#0EA5E9' }) => {
  const theme = useTheme();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  // Transform data for Recharts
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  return (
    <Box sx={{ 
      p: 4,
      minHeight: '320px',
      minWidth: '450px',
      borderRadius: '24px',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(color, 0.2)}`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
        transform: `scaleX(${animationProgress})`,
        transformOrigin: 'left',
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    }}>
      <Typography variant="h6" sx={{ 
        mb: 3, 
        fontWeight: 700,
        background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.7)})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </Typography>
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
          <XAxis 
            dataKey="name" 
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
            domain={[1, 6]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={3}
            fill="url(#colorGradient)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export const DonutChart = ({ value, maxValue = 6, title, color = '#10B981' }) => {
  const theme = useTheme();
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 200);
    return () => clearTimeout(timer);
  }, []);

  const percentage = (value / maxValue) * 100;
  const data = [
    { name: 'Score', value: value },
    { name: 'Remaining', value: maxValue - value },
  ];

  const COLORS = [color, alpha(theme.palette.text.secondary, 0.1)];

  return (
    <Box sx={{ 
      p: 4,
      minHeight: '320px', 
      borderRadius: '24px',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(color, 0.2)}`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Typography variant="h6" sx={{ 
        mb: 2, 
        fontWeight: 700,
        background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.7)})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              color: color,
              mb: 0.5,
              opacity: animationProgress,
              transform: `scale(${0.5 + animationProgress * 0.5})`,
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {(value * animationProgress).toFixed(1)}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              opacity: animationProgress,
              transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
            }}
          >
            / {maxValue}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const BarChart = ({ data, title, color = '#F59E0B' }) => {
  const theme = useTheme();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <Box sx={{ 
      p: 4,
      minHeight: '320px', 
      borderRadius: '24px',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(color, 0.2)}`,
    }}>
      <Typography variant="h6" sx={{ 
        mb: 3, 
        fontWeight: 700,
        background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.7)})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </Typography>
      
      <ResponsiveContainer width="100%" height={200}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
          <XAxis 
            dataKey="label" 
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            animationDuration={1500}
            radius={[8, 8, 4, 4]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export const RadarChart = ({ data, title, color = '#8B5CF6' }) => {
  const theme = useTheme();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ 
      p: 2,
      minHeight: '360px',
      width: '440px',
      marginRight: '-10%',
      borderRadius: '24px',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(color, 0.2)}`,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h6" sx={{ 
        mb: 3, 
        fontWeight: 700,
        background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.7)})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </Typography>
      
      <ResponsiveContainer width="100%" height={280}>
        <RechartsRadarChart data={data}>
          <PolarGrid 
            stroke={alpha(theme.palette.text.secondary, 0.1)}
            strokeDasharray="3 3"
          />
          <PolarAngleAxis 
            dataKey="label"
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90}
            domain={[0, 100]}
            stroke={alpha(theme.palette.text.secondary, 0.1)}
            tick={{ fontSize: 10 }}
          />
          <Radar 
            name="Performance" 
            dataKey="value" 
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
            animationDuration={1500}
          />
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </Box>
  );
};