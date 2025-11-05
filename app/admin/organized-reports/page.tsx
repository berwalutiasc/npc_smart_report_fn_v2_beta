/**
 * ADMIN ORGANIZED REPORTS PAGE
 * 
 * This page shows reports organized by weeks.
 * 
 * LOCATION: /admin/organized-reports
 * 
 * FEATURES:
 * - List of weeks with report summaries
 * - Click to view week's reports in detail
 * - Statistics for each week
 * - Search and filter by date range
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Link from 'next/link';
import { 
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
  ChevronRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import './organized-reports.css';

interface WeekData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalReports: number;
  approved: number;
  pending: number;
  flagged: number;
  representatives: number;
  rawStartDate?: string;
  rawEndDate?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    weeks: WeekData[];
    totalStats: {
      weeks: number;
      totalReports: number;
      avgReports: number;
      totalFlagged: number;
    };
    totalWeeks: number;
  };
  message: string;
}

const OrganizedReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeksData, setWeeksData] = useState<WeekData[]>([]);
  const [totalStats, setTotalStats] = useState({
    weeks: 0,
    totalReports: 0,
    avgReports: 0,
    totalFlagged: 0
  });

  // Mock data for fallback
  const mockWeeksData: WeekData[] = [
    { weekNumber: 44, startDate: 'Oct 24', endDate: 'Oct 30, 2024', totalReports: 127, approved: 104, pending: 15, flagged: 8, representatives: 45 },
    { weekNumber: 43, startDate: 'Oct 17', endDate: 'Oct 23, 2024', totalReports: 118, approved: 98, pending: 12, flagged: 8, representatives: 42 },
    { weekNumber: 42, startDate: 'Oct 10', endDate: 'Oct 16, 2024', totalReports: 132, approved: 115, pending: 10, flagged: 7, representatives: 46 },
    { weekNumber: 41, startDate: 'Oct 3', endDate: 'Oct 9, 2024', totalReports: 125, approved: 108, pending: 11, flagged: 6, representatives: 44 },
    { weekNumber: 40, startDate: 'Sep 26', endDate: 'Oct 2, 2024', totalReports: 115, approved: 98, pending: 13, flagged: 4, representatives: 41 },
    { weekNumber: 39, startDate: 'Sep 19', endDate: 'Sep 25, 2024', totalReports: 121, approved: 102, pending: 14, flagged: 5, representatives: 43 },
    { weekNumber: 38, startDate: 'Sep 12', endDate: 'Sep 18, 2024', totalReports: 128, approved: 110, pending: 12, flagged: 6, representatives: 45 },
    { weekNumber: 37, startDate: 'Sep 5', endDate: 'Sep 11, 2024', totalReports: 119, approved: 100, pending: 15, flagged: 4, representatives: 42 },
  ];

  /**
   * FETCH ORGANIZED REPORTS FROM API
   */
  const fetchOrganizedReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`http://localhost:5000/api/admin/dashboard/getOrganizedReports?${params}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch organized reports');
      }
      
      setWeeksData(result.data.weeks);
      setTotalStats(result.data.totalStats);
      
    } catch (err) {
      console.error('Error fetching organized reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load organized reports');
      
      // Fallback to mock data
      setWeeksData(mockWeeksData);
      setTotalStats({
        weeks: mockWeeksData.length,
        totalReports: mockWeeksData.reduce((sum, w) => sum + w.totalReports, 0),
        avgReports: Math.round(mockWeeksData.reduce((sum, w) => sum + w.totalReports, 0) / mockWeeksData.length),
        totalFlagged: mockWeeksData.reduce((sum, w) => sum + w.flagged, 0)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizedReports();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrganizedReports();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredWeeks = weeksData.filter(week =>
    week.startDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    week.endDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `week ${week.weekNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * RENDER ERROR MESSAGE
   */
  const renderErrorMessage = () => (
    <div className="error-banner slide-in-right">
      <AlertCircle size={20} />
      <span>{error}</span>
      <button 
        onClick={fetchOrganizedReports}
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
          <p>Loading organized reports...</p>
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
              Organized Reports
            </h1>
            <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Reports organized by weeks - Click on any week to view detailed reports
            </p>
          </div>
          <button 
            onClick={fetchOrganizedReports}
            className="refresh-button"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && renderErrorMessage()}

      {/* Summary Stats */}
      <div className="stats-row" style={{ marginBottom: '2rem' }}>
        <div className="stat-box fade-in">
          <div className="stat-box-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{totalStats.weeks}</div>
            <div className="stat-box-label">Total Weeks</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
            <FileText size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{totalStats.totalReports}</div>
            <div className="stat-box-label">Total Reports</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{totalStats.avgReports}</div>
            <div className="stat-box-label">Avg Reports/Week</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{totalStats.totalFlagged}</div>
            <div className="stat-box-label">Total Flagged</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="filters-section fade-in" style={{ animationDelay: '0.4s', marginBottom: '2rem' }}>
        <div className="search-box" style={{ flex: 1, maxWidth: '100%' }}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by week number or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Weeks List */}
      <div className="weeks-list">
        {filteredWeeks.length === 0 ? (
          <div className="empty-state fade-in">
            <FileText size={64} />
            <h3>No weeks found</h3>
            <p>{searchTerm ? 'No weeks match your search criteria' : 'No weekly data available'}</p>
          </div>
        ) : (
          filteredWeeks.map((week, index) => (
            <div key={week.weekNumber} className="week-card slide-in-up" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
              <div className="week-card-header">
                <div className="week-info">
                  <h3 className="week-title">Week {week.weekNumber}</h3>
                  <p className="week-dates">{week.startDate} - {week.endDate}</p>
                </div>
                <Link 
                  href={{
                    pathname: '/admin/organized-reports/view',
                    query: { 
                      week: week.weekNumber,
                      startDate: week.rawStartDate || week.startDate,
                      endDate: week.rawEndDate || week.endDate
                    }
                  }} 
                  className="btn-view-week"
                >
                  <Eye size={16} />
                  View Reports
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="week-card-body">
                <div className="week-stats-grid">
                  <div className="week-stat">
                    <div className="week-stat-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                      <FileText size={18} />
                    </div>
                    <div className="week-stat-info">
                      <div className="week-stat-value">{week.totalReports}</div>
                      <div className="week-stat-label">Total Reports</div>
                    </div>
                  </div>

                  <div className="week-stat">
                    <div className="week-stat-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                      <CheckCircle size={18} />
                    </div>
                    <div className="week-stat-info">
                      <div className="week-stat-value">{week.approved}</div>
                      <div className="week-stat-label">Approved</div>
                    </div>
                  </div>

                  <div className="week-stat">
                    <div className="week-stat-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                      <AlertTriangle size={18} />
                    </div>
                    <div className="week-stat-info">
                      <div className="week-stat-value">{week.pending}</div>
                      <div className="week-stat-label">Pending</div>
                    </div>
                  </div>

                  <div className="week-stat">
                    <div className="week-stat-icon" style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
                      <AlertTriangle size={18} />
                    </div>
                    <div className="week-stat-info">
                      <div className="week-stat-value">{week.flagged}</div>
                      <div className="week-stat-label">Flagged</div>
                    </div>
                  </div>
                </div>

                <div className="week-progress">
                  <div className="progress-label">
                    <span>Completion Rate</span>
                    <span className="progress-value">
                      {week.totalReports > 0 ? Math.round((week.approved / week.totalReports) * 100) : 0}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${week.totalReports > 0 ? (week.approved / week.totalReports) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default OrganizedReportsPage;