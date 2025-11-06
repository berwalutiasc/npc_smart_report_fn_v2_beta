/**
 * ADMIN WEEKLY REPORT PAGE
 * 
 * This page shows a summary and analytics of the week's reports.
 * 
 * LOCATION: /admin/weekly-report
 * 
 * FEATURES:
 * - Weekly statistics and trends
 * - Day-by-day breakdown (clickable to view details)
 * - Modal popup showing day details
 * - Top performers
 * - Export weekly summary
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  TrendingUp,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Award,
  Download,
  Calendar,
  X,
  ThumbsUp,
  ThumbsDown,
  Flag,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import '../dashboard/dashboard.css';
import './weekly-report.css';

interface ApiResponse {
  success: boolean;
  data: {
    weeklyStats: {
      totalReports: number;
      totalRepresentatives: number;
      flaggedItems: number;
      resolvedIssues: number;
      trend: number;
    };
    dailyBreakdown: {
      day: string;
      reports: number;
      flagged: number;
      approved: number;
    }[];
    topPerformers: {
      name: string;
      class: string;
      reports: number;
      completion: number;
    }[];
    dayDetails: Record<string, {
      good: { count: number; items: { name: string; class: string }[] };
      bad: { count: number; items: { name: string; class: string }[] };
      flagged: { count: number; items: { name: string; class: string }[] };
    }>;
    dateRange: string;
  };
  message: string;
}
const WeeklyReportPage = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for API data
  const [weekStats, setWeekStats] = useState({
    totalReports: 0,
    totalRepresentatives: 0,
    flaggedItems: 0,
    resolvedIssues: 0,
    trend: 0
  });
  const [dailyBreakdown, setDailyBreakdown] = useState<{ day: string; reports: number; flagged: number; approved: number }[]>([]);
  const [topPerformers, setTopPerformers] = useState<{ name: string; class: string; reports: number; completion: number }[]>([
    {
      name: 'John Doe',
      class: 'Computer Science Year 3',
      reports: 56,
      completion: 100
    },
    {
      name: 'Jane Smith',
      class: 'Engineering Year 1',
      reports: 56,
      completion: 100
    }
  ]);
  const [dayDetails, setDayDetails] = useState<Record<string, { good: { count: number; items: { name: string; class: string }[] }; bad: { count: number; items: { name: string; class: string }[] }; flagged: { count: number; items: { name: string; class: string }[] } }>>({
    'Monday': {
      good: { count: 56, items: [{ name: 'John Doe', class: 'Computer Science Year 3' }] },
      bad: { count: 17, items: [{ name: 'Alex Davis', class: 'Engineering Year 1' }] },
      flagged: { count: 8, items: [{ name: 'Oliver Martinez', class: 'Computer Science Year 2' }] }
    }
  });
  const [dateRange, setDateRange] = useState('');

  // Mock data for fallback
  const mockDayDetails = {
    'Monday': {
      good: { count: 56, items: [{ name: 'John Doe', class: 'Computer Science Year 3' }] },
      bad: { count: 17, items: [{ name: 'Alex Davis', class: 'Engineering Year 1' }] },
      flagged: { count: 8, items: [{ name: 'Oliver Martinez', class: 'Computer Science Year 2' }] }
    },
    'Tuesday': {
      good: { count: 62, items: [{ name: 'Liam Garcia', class: 'Computer Science Year 3' }] },
      bad: { count: 20, items: [{ name: 'Ethan Hall', class: 'Engineering Year 1' }] },
      flagged: { count: 10, items: [{ name: 'Charlotte King', class: 'Computer Science Year 2' }] }
    },
    'Wednesday': {
      good: { count: 54, items: [{ name: 'Lucas Green', class: 'Computer Science Year 3' }] },
      bad: { count: 15, items: [{ name: 'Evelyn Nelson', class: 'Engineering Year 1' }] },
      flagged: { count: 7, items: [{ name: 'Ella Mitchell', class: 'Computer Science Year 2' }] }
    },
    'Thursday': {
      good: { count: 68, items: [{ name: 'Avery Roberts', class: 'Computer Science Year 3' }] },
      bad: { count: 22, items: [{ name: 'Jack Campbell', class: 'Engineering Year 1' }] },
      flagged: { count: 12, items: [{ name: 'Luna Edwards', class: 'Computer Science Year 2' }] }
    },
    'Friday': {
      good: { count: 60, items: [{ name: 'Grace Stewart', class: 'Computer Science Year 3' }] },
      bad: { count: 18, items: [{ name: 'Chloe Morris', class: 'Engineering Year 1' }] },
      flagged: { count: 9, items: [{ name: 'Lily Reed', class: 'Computer Science Year 2' }] }
    },
    'Saturday': {
      good: { count: 38, items: [{ name: 'Zoe Morgan', class: 'Computer Science Year 3' }] },
      bad: { count: 10, items: [{ name: 'Aria Murphy', class: 'Engineering Year 1' }] },
      flagged: { count: 4, items: [{ name: 'Aiden Bailey', class: 'Computer Science Year 2' }] }
    },
    'Sunday': {
      good: { count: 32, items: [{ name: 'Riley Rivera', class: 'Computer Science Year 3' }] },
      bad: { count: 8, items: [{ name: 'Zoey Cooper', class: 'Engineering Year 1' }] },
      flagged: { count: 3, items: [{ name: 'Nolan Richardson', class: 'Computer Science Year 2' }] }
    }
  };

  /**
   * FETCH WEEKLY REPORT DATA FROM API
   */
  const fetchWeeklyReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://npc-smart-report-bn-v2-beta.onrender.com/api/admin/dashboard/getWeeklyReport');
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch weekly report data');
      }
      
      setWeekStats(result.data.weeklyStats);
      setDailyBreakdown(result.data.dailyBreakdown);
      setTopPerformers(result.data.topPerformers);
      setDayDetails(result.data.dayDetails);
      setDateRange(result.data.dateRange);
      
    } catch (err) {
      console.error('Error fetching weekly report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weekly report data');
      
      // Fallback to mock data
      setWeekStats({
        totalReports: 127,
        totalRepresentatives: 45,
        flaggedItems: 23,
        resolvedIssues: 18,
        trend: 12.5
      });
      setDailyBreakdown([
        { day: 'Monday', reports: 18, flagged: 3, approved: 15 },
        { day: 'Tuesday', reports: 22, flagged: 5, approved: 17 },
        { day: 'Wednesday', reports: 19, flagged: 4, approved: 15 },
        { day: 'Thursday', reports: 25, flagged: 6, approved: 19 },
        { day: 'Friday', reports: 21, flagged: 3, approved: 18 },
        { day: 'Saturday', reports: 12, flagged: 1, approved: 11 },
        { day: 'Sunday', reports: 10, flagged: 1, approved: 9 }
      ]);
      setTopPerformers([
        { name: 'John Doe', class: 'Computer Science', reports: 7, completion: 100 },
        { name: 'Jane Smith', class: 'Engineering', reports: 6, completion: 100 },
        { name: 'Mike Johnson', class: 'Chemistry', reports: 5, completion: 98 }
      ]);
      setDayDetails(mockDayDetails);
      setDateRange('Oct 24 - Oct 30, 2024');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  const handleDayClick = (day: string) => {
    const dayKey = day.includes(' - ') ? day.split(' - ')[0] : day;
    setSelectedDay(dayKey);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDay(null);
  };

  const handleExport = () => {
    // Export functionality would go here
    alert('Export functionality would be implemented here');
  };

  const currentDayDetails = selectedDay ? dayDetails[selectedDay] : null;

  /**
   * RENDER ERROR MESSAGE
   */
  const renderErrorMessage = () => (
    <div className="error-banner slide-in-right">
      <AlertCircle size={20} />
      <span>{error}</span>
      <button 
        onClick={fetchWeeklyReport}
        className="retry-button"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading weekly report...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
              Weekly Report
            </h1>
            <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Week of {dateRange}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={fetchWeeklyReport}
              className="refresh-button"
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'spinning' : ''} />
              Refresh
            </button>
            <button className="btn-export" onClick={handleExport}>
              <Download size={18} />
              Export Summary
            </button>
          </div>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && renderErrorMessage()}

      {/* Weekly Stats */}
      <div className="stats-grid">
        <div className="stat-card fade-in">
          <div className="stat-card-header">
            <div className="stat-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
              <FileText size={24} />
            </div>
            <div className="stat-trend" style={{ color: weekStats.trend >= 0 ? '#10b981' : '#ef4444' }}>
              <TrendingUp size={16} style={{ transform: weekStats.trend < 0 ? 'rotate(180deg)' : 'none' }} />
              <span>{Math.abs(weekStats.trend)}%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Total Reports</h3>
            <div className="stat-value">{weekStats.totalReports}</div>
          </div>
        </div>

        <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
              <Users size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Active Representatives</h3>
            <div className="stat-value">{weekStats.totalRepresentatives}</div>
          </div>
        </div>

        <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Flagged Items</h3>
            <div className="stat-value">{weekStats.flaggedItems}</div>
          </div>
        </div>

        <div className="stat-card fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Resolved Issues</h3>
            <div className="stat-value">{weekStats.resolvedIssues}</div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="dashboard-card fade-in" style={{ animationDelay: '0.4s', marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Calendar size={20} />
            Daily Breakdown (Click to view details)
          </h3>
        </div>
        <div className="card-content">
          <div className="day-breakdown-list">
            {dailyBreakdown.map((day, index) => (
              <div 
                key={index} 
                className="day-breakdown-item"
                onClick={() => handleDayClick(day.day)}
              >
                <div className="day-breakdown-name">
                  {day.day}
                </div>
                <div className="day-breakdown-content">
                  <div className="day-breakdown-meta">
                    <span>Reports: {day.reports}</span>
                    <span>Flagged: {day.flagged}</span>
                    <span>Approved: {day.approved}</span>
                  </div>
                  <div className="day-progress">
                    <div 
                      className="day-progress-fill" 
                      style={{ 
                        width: `${day.reports > 0 ? (day.approved / day.reports) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="dashboard-card fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Award size={20} />
            Top Performers
          </h3>
        </div>
        <div className="card-content">
          <div className="top-performers-list">
            {topPerformers.map((performer, index) => (
              <div key={index} className={`top-performer-item ${index === 0 ? 'highlight' : ''}`}>
                <div className={`rank-circle ${index === 0 ? 'rank-1' : ''}`}>
                  {index + 1}
                </div>
                <div className="top-performer-main">
                  <div className="top-performer-name">
                    {performer.name}
                  </div>
                  <div className="top-performer-class">
                    {performer.class}
                  </div>
                </div>
                <div className="top-performer-metric">
                  <div className="metric-value">
                    {performer.reports}
                  </div>
                  <div className="metric-label">
                    reports
                  </div>
                </div>
                <div className="top-performer-metric">
                  <div className={`metric-value ${performer.completion >= 90 ? 'success' : 'warning'}`}>
                    {performer.completion}%
                  </div>
                  <div className="metric-label">
                    complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Day Details */}
      {showModal && currentDayDetails && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDay} - Detailed Report</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Good Reports */}
              <div className="detail-section">
                <div className="detail-section-header good">
                  <ThumbsUp size={20} />
                  <h3>Good Reports</h3>
                  <span className="count-badge">{currentDayDetails.good.count}</span>
                </div>
                <div className="detail-list">
                  {currentDayDetails.good.items.length > 0 ? (
                    currentDayDetails.good.items.map((item, idx) => (
                      <div key={idx} className="detail-item">
                        <div className="detail-item-name">{item.name}</div>
                        <div className="detail-item-class">{item.class}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">No good reports for this day</div>
                  )}
                </div>
              </div>

              {/* Bad Reports */}
              <div className="detail-section">
                <div className="detail-section-header bad">
                  <ThumbsDown size={20} />
                  <h3>Bad Reports</h3>
                  <span className="count-badge">{currentDayDetails.bad.count}</span>
                </div>
                <div className="detail-list">
                  {currentDayDetails.bad.items.length > 0 ? (
                    currentDayDetails.bad.items.map((item, idx) => (
                      <div key={idx} className="detail-item">
                        <div className="detail-item-name">{item.name}</div>
                        <div className="detail-item-class">{item.class}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">No bad reports for this day</div>
                  )}
                </div>
              </div>

              {/* Flagged Reports */}
              <div className="detail-section">
                <div className="detail-section-header flagged">
                  <Flag size={20} />
                  <h3>Flagged Reports</h3>
                  <span className="count-badge">{currentDayDetails.flagged.count}</span>
                </div>
                <div className="detail-list">
                  {currentDayDetails.flagged.items.length > 0 ? (
                    currentDayDetails.flagged.items.map((item, idx) => (
                      <div key={idx} className="detail-item">
                        <div className="detail-item-name">{item.name}</div>
                        <div className="detail-item-class">{item.class}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">No flagged reports for this day</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default WeeklyReportPage;