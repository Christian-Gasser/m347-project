// Advanced grade analytics and calculations

export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  const totalWeight = grades.reduce((sum, grade) => sum + grade.gradeWeight, 0);
  const weightedSum = grades.reduce((sum, grade) => sum + (grade.grade * grade.gradeWeight), 0);
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

export const calculateTrend = (grades) => {
  if (!grades || grades.length < 2) return 0;
  
  // Sort grades by date
  const sortedGrades = [...grades].sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  
  // Calculate trend using linear regression
  const n = sortedGrades.length;
  const xSum = (n * (n - 1)) / 2; // Sum of indices 0, 1, 2, ...
  const ySum = sortedGrades.reduce((sum, grade) => sum + grade.grade, 0);
  const xySum = sortedGrades.reduce((sum, grade, index) => sum + (index * grade.grade), 0);
  const xSquaredSum = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices
  
  const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
  
  // Convert slope to percentage change
  const avgGrade = ySum / n;
  return (slope / avgGrade) * 100;
};

export const getGradeDistribution = (grades) => {
  if (!grades || grades.length === 0) return {};
  
  const distribution = {
    excellent: 0, // 5.5-6.0
    good: 0,      // 4.5-5.4
    average: 0,   // 3.5-4.4
    poor: 0,      // 1.0-3.4
  };
  
  grades.forEach(grade => {
    if (grade.grade >= 5.5) distribution.excellent++;
    else if (grade.grade >= 4.5) distribution.good++;
    else if (grade.grade >= 3.5) distribution.average++;
    else distribution.poor++;
  });
  
  return distribution;
};

export const generateTimeSeriesData = (grades) => {
  if (!grades || grades.length === 0) return [];
  
  // Sort grades by date and calculate cumulative GPA
  const sortedGrades = [...grades].sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  
  const timeSeriesData = [];
  let cumulativeGrades = [];
  
  sortedGrades.forEach((grade, index) => {
    cumulativeGrades.push(grade);
    const gpa = calculateGPA(cumulativeGrades);
    
    timeSeriesData.push({
      label: `${grade.name.substring(0, 10)}...`,
      value: gpa,
      date: grade.examDate,
      gradeCount: index + 1,
    });
  });
  
  return timeSeriesData;
};

export const generateSubjectComparison = (allSubjects) => {
  if (!allSubjects || allSubjects.length === 0) return [];
  
  return allSubjects.map(subject => ({
    label: subject.name.length > 8 ? subject.name.substring(0, 8) + '...' : subject.name,
    value: subject.average || 0,
    gradeCount: subject.grades?.length || 0,
  }));
};

export const generateInsights = (grades, gpa, trend) => {
  const insights = [];
  
  // GPA Analysis
  if (gpa >= 5.5) {
    insights.push({
      title: '🏆 Outstanding Performance',
      description: `Your GPA of ${gpa.toFixed(2)} places you in the top tier. Keep up the excellent work!`,
      color: '#10B981',
    });
  } else if (gpa >= 4.5) {
    insights.push({
      title: '📈 Strong Performance',
      description: `Your GPA of ${gpa.toFixed(2)} shows solid academic achievement. You're on a great track!`,
      color: '#3B82F6',
    });
  } else if (gpa >= 3.5) {
    insights.push({
      title: '⚡ Room for Growth',
      description: `Your GPA of ${gpa.toFixed(2)} shows potential. Focus on consistent improvement!`,
      color: '#F59E0B',
    });
  } else {
    insights.push({
      title: '🎯 Improvement Opportunity',
      description: `Your GPA of ${gpa.toFixed(2)} indicates areas for focused improvement. Every grade counts!`,
      color: '#EF4444',
    });
  }
  
  // Trend Analysis
  if (Math.abs(trend) > 5) {
    if (trend > 0) {
      insights.push({
        title: '🚀 Upward Trajectory',
        description: `Your grades are trending upward by ${trend.toFixed(1)}%. This momentum is fantastic!`,
        color: '#10B981',
      });
    } else {
      insights.push({
        title: '⚠️ Declining Trend',
        description: `Your grades are trending down by ${Math.abs(trend).toFixed(1)}%. Consider reviewing study strategies.`,
        color: '#EF4444',
      });
    }
  } else {
    insights.push({
      title: '📊 Consistent Performance',
      description: 'Your grades show stable performance. Consistency is key to long-term success!',
      color: '#6366F1',
    });
  }
  
  // Grade Count Analysis
  if (grades.length >= 10) {
    insights.push({
      title: '📚 Comprehensive Data',
      description: `With ${grades.length} grades recorded, you have substantial data for accurate analysis.`,
      color: '#8B5CF6',
    });
  } else if (grades.length >= 5) {
    insights.push({
      title: '📝 Building History',
      description: `${grades.length} grades provide a good foundation. More data will improve insights accuracy.`,
      color: '#06B6D4',
    });
  } else {
    insights.push({
      title: '🌱 Getting Started',
      description: 'Keep adding grades to unlock more detailed performance insights and predictions.',
      color: '#84CC16',
    });
  }
  
  return insights;
};

export const predictNextGrade = (grades) => {
  if (!grades || grades.length < 3) return null;
  
  const trend = calculateTrend(grades);
  const currentGPA = calculateGPA(grades);
  
  // Simple prediction based on trend
  const prediction = currentGPA + (trend / 100) * currentGPA;
  
  return {
    predicted: Math.max(1.0, Math.min(6.0, prediction)), // Clamp between 1-6
    confidence: Math.max(0.1, Math.min(0.9, grades.length / 20)), // Confidence based on data points
  };
};

export const getPerformanceMetrics = (grades) => {
  if (!grades || grades.length === 0) {
    return {
      gpa: 0,
      trend: 0,
      bestGrade: 0,
      worstGrade: 0,
      consistency: 0,
      totalGrades: 0,
    };
  }
  
  const gpa = calculateGPA(grades);
  const trend = calculateTrend(grades);
  const gradeValues = grades.map(g => g.grade);
  const bestGrade = Math.max(...gradeValues);
  const worstGrade = Math.min(...gradeValues);
  
  // Calculate consistency (lower standard deviation = higher consistency)
  const mean = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
  const variance = gradeValues.reduce((sum, grade) => sum + Math.pow(grade - mean, 2), 0) / gradeValues.length;
  const standardDeviation = Math.sqrt(variance);
  const consistency = Math.max(0, 100 - (standardDeviation / mean) * 100);
  
  return {
    gpa,
    trend,
    bestGrade,
    worstGrade,
    consistency,
    totalGrades: grades.length,
  };
};

export const calculateGradeGoals = (grades, nextGradeWeight = 1.0) => {
  if (!grades || grades.length === 0) return [];
  
  const currentGPA = calculateGPA(grades);
  const currentTotalWeight = grades.reduce((sum, grade) => sum + grade.gradeWeight, 0);
  const currentWeightedSum = grades.reduce((sum, grade) => sum + (grade.grade * grade.gradeWeight), 0);
  
  const targets = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];
  const goals = [];
  
  targets.forEach(targetGPA => {
    // Calculate what grade is needed to achieve the target GPA
    // Formula: (currentWeightedSum + (neededGrade * nextGradeWeight)) / (currentTotalWeight + nextGradeWeight) = targetGPA
    // Solving for neededGrade: neededGrade = (targetGPA * (currentTotalWeight + nextGradeWeight) - currentWeightedSum) / nextGradeWeight
    
    const newTotalWeight = currentTotalWeight + nextGradeWeight;
    const neededGrade = (targetGPA * newTotalWeight - currentWeightedSum) / nextGradeWeight;
    
    // Determine status
    let status = 'achievable';
    let message = '';
    
    if (currentGPA >= targetGPA) {
      status = 'achieved';
      message = '✓ Already achieved!';
    } else if (neededGrade > 6.0) {
      status = 'impossible';
      message = 'Not achievable with one grade';
    } else if (neededGrade < 1.0) {
      status = 'guaranteed';
      message = 'Already guaranteed!';
    } else {
      status = 'achievable';
      message = `Need ${neededGrade.toFixed(1)}`;
    }
    
    goals.push({
      targetGPA,
      neededGrade: Math.max(1.0, Math.min(6.0, neededGrade)),
      status,
      message,
      difficulty: neededGrade > 5.5 ? 'hard' : neededGrade > 4.5 ? 'medium' : 'easy'
    });
  });
  
  return goals;
};