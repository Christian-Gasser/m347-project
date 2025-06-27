import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { TrendingUp, TrendingDown, GpsFixed as Target } from '@mui/icons-material';

export const AnimatedStatCard = ({ 
  title, 
  value, 
  maxValue, 
  suffix = '', 
  icon: Icon, 
  color = '#0EA5E9',
  trend,
  delay = 0
}) => {
  const theme = useTheme();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animateValue = () => {
      const duration = 1500;
      const increment = value / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          current = value;
          clearInterval(timer);
        }
        setAnimatedValue(current);
      }, 16);
    };

    const timer = setTimeout(() => {
      setIsVisible(true);
      animateValue();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, value]);


  const percentage = maxValue ? (value / maxValue) * 100 : 0;

  return (
    <Box sx={{
      p: 4,
      minHeight: '200px',
      borderRadius: '24px',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(color, 0.2)}`,
      position: 'relative',
      overflow: 'hidden',
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
        transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '1px',
        background: `linear-gradient(180deg, ${alpha(color, 0.5)}, transparent)`,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
      },
    }}>
      {/* Icon */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2,
      }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.05)})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${alpha(color, 0.2)}`,
          transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-10deg)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
        }}>
          <Icon sx={{ 
            fontSize: 24, 
            color: color,
            filter: `drop-shadow(0 0 8px ${alpha(color, 0.3)})`,
          }} />
        </Box>

        {/* Trend indicator */}
        {trend && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
          }}>
            {trend > 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: '#10B981' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: '#EF4444' }} />
            )}
            <Typography variant="caption" sx={{ 
              color: trend > 0 ? '#10B981' : '#EF4444',
              fontWeight: 600,
            }}>
              {Math.abs(trend).toFixed(1)}%
            </Typography>
          </Box>
        )}
      </Box>

      {/* Title */}
      <Typography variant="body2" sx={{ 
        color: 'text.secondary',
        fontWeight: 500,
        mb: 1,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
      }}>
        {title}
      </Typography>

      {/* Animated Value */}
      <Typography variant="h4" sx={{ 
        fontWeight: 800,
        background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.7)})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 2,
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
      }}>
        {animatedValue.toFixed(1)}{suffix}
      </Typography>

      {/* Progress bar */}
      {maxValue && (
        <Box sx={{ position: 'relative' }}>
          <Box sx={{
            height: 6,
            borderRadius: 3,
            background: alpha(theme.palette.text.secondary, 0.1),
            overflow: 'hidden',
          }}>
            <Box sx={{
              height: '100%',
              width: `${percentage * (isVisible ? 1 : 0)}%`,
              background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
              borderRadius: 3,
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
              boxShadow: `0 0 12px ${alpha(color, 0.4)}`,
            }} />
          </Box>
          <Typography variant="caption" sx={{ 
            color: 'text.secondary',
            mt: 0.5,
            display: 'block',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
          }}>
            {percentage.toFixed(0)}% of maximum
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export const GradeInsightCard = ({ insights, delay = 0 }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box sx={{
      p: 4,
      minHeight: '320px',
      borderRadius: '24px',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      backdropFilter: 'blur(24px)',
      border: `1px solid ${alpha('#3B82F6', 0.2)}`,
      position: 'relative',
      overflow: 'hidden',
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {/* Animated background pattern */}
      <Box sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#3B82F6', 0.1)} 0%, transparent 70%)`,
        transform: isVisible ? 'scale(1)' : 'scale(0)',
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
      }} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{
          width: 56,
          height: 56,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 3,
          transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-20deg)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
        }}>
          <Target sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        
        <Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            mb: 0.5,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
          }}>
            Performance Insights
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'text.secondary',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
          }}>
            AI-powered analysis of your grades
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {insights.map((insight, index) => (
          <Box 
            key={index}
            sx={{
              p: 2,
              borderRadius: '16px',
              background: alpha(insight.color || '#3B82F6', 0.05),
              border: `1px solid ${alpha(insight.color || '#3B82F6', 0.1)}`,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
              opacity: isVisible ? 1 : 0,
              transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.7 + index * 0.1}s`,
            }}
          >
            <Typography variant="body2" sx={{ 
              fontWeight: 600,
              color: insight.color || '#3B82F6',
              mb: 0.5,
            }}>
              {insight.title}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              lineHeight: 1.5,
            }}>
              {insight.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};