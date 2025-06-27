import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';

export const LineChart = ({ data, title, color = '#0EA5E9' }) => {
  const theme = useTheme();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 100 - ((item.value - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

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
      
      <Box sx={{ position: 'relative', height: 120 }}>
        <svg width="100%" height="120" viewBox="0 0 300 120">
          {/* Grid lines */}
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={alpha(color, 0.3)} />
              <stop offset="100%" stopColor={alpha(color, 0.05)} />
            </linearGradient>
          </defs>
          
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y + 10}
              x2="300"
              y2={y + 10}
              stroke={alpha(theme.palette.text.secondary, 0.1)}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Area under curve */}
          <path
            d={`M 0,110 L ${points} L 300,110 Z`}
            fill={`url(#gradient-${title})`}
            style={{
              clipPath: `inset(0 ${100 - animationProgress * 100}% 0 0)`,
              transition: 'clip-path 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Main line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: `${1000 * (1 - animationProgress)}`,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 300;
            const y = 100 - ((item.value - minValue) / range) * 80 + 10;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="#fff"
                strokeWidth="2"
                style={{
                  opacity: animationProgress,
                  transform: `scale(${animationProgress})`,
                  transformOrigin: `${x}px ${y}px`,
                  transition: `all ${0.5 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 1,
          px: 1,
        }}>
          {data.map((item, index) => (
            <Typography 
              key={index} 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                opacity: animationProgress,
                transition: `opacity ${0.5 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>
      </Box>
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
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(percentage / 100) * circumference * animationProgress} ${circumference}`;

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
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={alpha(theme.palette.text.secondary, 0.1)}
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            style={{
              filter: `drop-shadow(0 0 8px ${alpha(color, 0.5)})`,
              transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        
        {/* Center value */}
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

  const maxValue = Math.max(...data.map(d => d.value), 1); // Prevent division by zero

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
      
      <Box sx={{ display: 'flex', alignItems: 'end', gap: 2, height: 120 }}>
        {data.map((item, index) => {
          const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
          const itemColor = colors[index] || color;
          
          return (
            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'end', 
                height: 100,
                position: 'relative',
              }}>
                <Box sx={{
                  width: '100%',
                  height: `${(item.value / maxValue) * 100 * animationProgress}%`,
                  minHeight: item.value > 0 ? '8px' : '0px', // Minimum height for non-zero values
                  background: `linear-gradient(180deg, ${itemColor}, ${alpha(itemColor, 0.7)})`,
                  borderRadius: '8px 8px 4px 4px',
                  transition: `height ${0.8 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
                  boxShadow: `0 4px 12px ${alpha(itemColor, 0.3)}`,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: alpha('#fff', 0.3),
                    borderRadius: '8px 8px 0 0',
                  },
                }} />
                
                {/* Value label */}
                {item.value > 0 && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute',
                      top: -20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: itemColor,
                      fontWeight: 600,
                      opacity: animationProgress,
                      transition: `opacity ${0.5 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
                    }}
                  >
                    {item.value}
                  </Typography>
                )}
              </Box>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  color: 'text.secondary',
                  textAlign: 'center',
                  opacity: animationProgress,
                  transition: `opacity ${0.5 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
                  fontSize: '0.7rem',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
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

  const size = 160;
  const center = size / 2;
  const maxRadius = 60;
  const levels = 5;
  
  // Calculate points for radar chart
  const angleStep = (2 * Math.PI) / data.length;
  const maxValue = Math.max(...data.map(d => d.value));
  
  const getPoint = (value, index, radius = maxRadius) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const r = (value / maxValue) * radius * animationProgress;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const polygonPoints = data.map((item, index) => {
    const point = getPoint(item.value, index);
    return `${point.x},${point.y}`;
  }).join(' ');

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
      
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size}>
          {/* Grid circles */}
          {Array.from({ length: levels }, (_, i) => {
            const radius = ((i + 1) / levels) * maxRadius;
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={alpha(theme.palette.text.secondary, 0.1)}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            );
          })}
          
          {/* Grid lines */}
          {data.map((_, index) => {
            const point = getPoint(maxValue, index);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke={alpha(theme.palette.text.secondary, 0.1)}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            );
          })}
          
          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill={alpha(color, 0.2)}
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            style={{
              filter: `drop-shadow(0 0 8px ${alpha(color, 0.5)})`,
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const point = getPoint(item.value, index);
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={color}
                stroke="#fff"
                strokeWidth="2"
                style={{
                  opacity: animationProgress,
                  transform: `scale(${animationProgress})`,
                  transformOrigin: `${point.x}px ${point.y}px`,
                  transition: `all ${0.5 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <Box sx={{ position: 'absolute', inset: 0 }}>
          {data.map((item, index) => {
            const labelPoint = getPoint(maxValue * 1.15, index, maxRadius * 1.15);
            return (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  position: 'absolute',
                  left: labelPoint.x - 20,
                  top: labelPoint.y - 8,
                  width: 40,
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  opacity: animationProgress,
                  transition: `opacity ${0.5 + index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};