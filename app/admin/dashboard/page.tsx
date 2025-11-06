/**
 * ADMIN DASHBOARD PAGE
 * 
 * This is the main dashboard page that admins see after logging in.
 * 
 * LOCATION: /admin/dashboard
 * 
 * FEATURES:
 * - Admin-specific statistics (Total Students, Total Representatives, Classes, Reports)
 * - Weekly report activity chart
 * - Recent reports from all students
 * - Quick links to admin pages
 * - System status
 * - Loading animations
 * - Smooth entrance animations
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  FileText, 
  Users, 
  GraduationCap, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  Calendar,
  ArrowRight,
  Activity,
  UserCheck,
  FolderOpen
} from 'lucide-react';
import Link from 'next/link';
import './dashboard.css';

// TYPES
interface StatCardData {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'submitted' | 'approved' | 'pending';
  title: string;
  time: string;
  user?: string;
}

interface RecentReport {
  id: string;
  title: string;
  status: 'approved' | 'pending' | 'flagged';
  date: string;
  representative: string;
  class: string;
}

interface WeeklyData {
  day: string;
  count: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    stats: Omit<StatCardData, 'icon'>[];
    weeklyData: WeeklyData[];
    activities: ActivityItem[];
    recentReports: RecentReport[];
  };
  message: string;
}

// ICON MAPPING CONSTANTS
const STATS_ICONS = {
  'Total Students': <Users size={24} />,
  'Representatives': <UserCheck size={24} />,
  'Total Classes': <GraduationCap size={24} />,
  'Total Reports': <FileText size={24} />
};

// MOCK DATA (Fallback in case API fails)
const mockStats: StatCardData[] = [
  {
    title: 'Total Students',
    value: 856,
    icon: <Users size={24} />,
    trend: 12.5,
    color: '#3b82f6'
  },
  {
    title: 'Representatives',
    value: 45,
    icon: <UserCheck size={24} />,
    trend: 5.3,
    color: '#10b981'
  },
  {
    title: 'Total Classes',
    value: 32,
    icon: <GraduationCap size={24} />,
    trend: 0,
    color: '#f59e0b'
  },
  {
    title: 'Total Reports',
    value: 1248,
    icon: <FileText size={24} />,
    trend: 18.7,
    color: '#8b5cf6'
  }
];

const mockActivities: ActivityItem[] = [
  { id: '1', type: 'submitted', title: 'Safety Inspection Report - Room A101', time: '5 minutes ago', user: 'John Doe (CS Dept)' },
  { id: '2', type: 'approved', title: 'Weekly Facility Check - Engineering Lab', time: '1 hour ago', user: 'Jane Smith (Engineering)' },
  { id: '3', type: 'pending', title: 'Monthly Safety Review - Chemistry Lab', time: '2 hours ago', user: 'Mike Johnson (Chemistry)' },
  { id: '4', type: 'submitted', title: 'Equipment Inspection - Physics Department', time: '4 hours ago', user: 'Sarah Williams (Physics)' },
  { id: '5', type: 'approved', title: 'Fire Safety Check - Building B', time: '6 hours ago', user: 'Tom Brown (Safety Officer)' }
];

const mockRecentReports: RecentReport[] = [
  { id: '1', title: 'Safety Inspection - Room A101', status: 'pending', date: '2024-10-30', representative: 'John Doe', class: 'Computer Science' },
  { id: '2', title: 'Facility Check - Engineering Lab', status: 'approved', date: '2024-10-30', representative: 'Jane Smith', class: 'Engineering' },
  { id: '3', title: 'Equipment Inspection - Chemistry Lab', status: 'flagged', date: '2024-10-29', representative: 'Mike Johnson', class: 'Chemistry' },
  { id: '4', title: 'Fire Safety Check - Building B', status: 'approved', date: '2024-10-29', representative: 'Tom Brown', class: 'Safety Dept' }
];

const mockWeeklyData: WeeklyData[] = [
  { day: 'Mon', count: 42 },
  { day: 'Tue', count: 58 },
  { day: 'Wed', count: 45 },
  { day: 'Thu', count: 67 },
  { day: 'Fri', count: 52 },
  { day: 'Sat', count: 28 },
  { day: 'Sun', count: 15 }
];

const quickLinks = [
  { title: "Today's Reports", href: '/admin/today-reports', icon: <Clock size={20} />, color: '#3b82f6' },
  { title: 'All Reports', href: '/admin/all-reports', icon: <FolderOpen size={20} />, color: '#10b981' },
  { title: 'Representatives', href: '/admin/representatives', icon: <UserCheck size={20} />, color: '#f59e0b' },
  { title: 'Classes', href: '/admin/classes', icon: <GraduationCap size={20} />, color: '#8b5cf6' }
];

/**
 * ADMIN DASHBOARD PAGE COMPONENT
 */
const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [reports, setReports] = useState<RecentReport[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * FETCH DASHBOARD DATA FROM API
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://npc-smart-report-bn-v2-beta.onrender.com/api/admin/dashboard/getAdminDashboardData');
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }
      
      // Transform API data to match frontend format with icons
      const transformedStats = result.data.stats.map(stat => ({
        ...stat,
        icon: STATS_ICONS[stat.title as keyof typeof STATS_ICONS]
      }));
      
      setStats(transformedStats);
      setActivities(result.data.activities);
      setReports(result.data.recentReports);
      setWeeklyData(result.data.weeklyData);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      
      // Fallback to mock data
      setStats(mockStats);
      setActivities(mockActivities);
      setReports(mockRecentReports);
      setWeeklyData(mockWeeklyData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * RENDER ERROR MESSAGE
   */
  const renderErrorMessage = () => (
    <div className="error-banner slide-in-right">
      <AlertCircle size={20} />
      <span>{error}</span>
      <button 
        onClick={fetchDashboardData}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  );

  return (
    <AdminLayout>
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1a202c',
          margin: 0 
        }}>
          Admin Dashboard
        </h1>
        <p style={{ 
          color: '#718096', 
          marginTop: '0.5rem',
          fontSize: '0.95rem' 
        }}>
          Welcome back, Admin! Here's an overview of the system.
        </p>
      </div>

      {/* ERROR BANNER */}
      {error && renderErrorMessage()}

      {/* STATISTICS CARDS */}
      <div className="stats-grid">
        {loading ? (
          // Loading skeletons
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card skeleton-card">
                <div className="skeleton skeleton-icon"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-number"></div>
              </div>
            ))}
          </>
        ) : (
          stats.map((stat, index) => (
            <div 
              key={stat.title}
              className="stat-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-card-header">
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-trend" style={{ color: stat.trend >= 0 ? '#10b981' : '#ef4444' }}>
                  <TrendingUp size={16} style={{ transform: stat.trend < 0 ? 'rotate(180deg)' : 'none' }} />
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value counter">{stat.value.toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="dashboard-grid">
        {/* WEEKLY CHART */}
        <div className={`dashboard-card chart-card ${loading ? '' : 'fade-in'}`} style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={20} />
              Weekly Report Activity
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="chart-skeleton">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="skeleton skeleton-bar"></div>
                ))}
              </div>
            ) : (
              <div className="weekly-chart">
                {weeklyData.map((data, index) => (
                  <div key={data.day} className="chart-bar-wrapper">
                    <div className="chart-bar-container">
                      <div 
                        className="chart-bar slide-up"
                        style={{ 
                          height: `${(data.count / Math.max(...weeklyData.map(d => d.count), 1)) * 100}%`,
                          animationDelay: `${0.5 + index * 0.1}s`
                        }}
                      >
                        <span className="bar-value">{data.count}</span>
                      </div>
                    </div>
                    <span className="chart-label">{data.day}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className={`dashboard-card activity-card ${loading ? '' : 'fade-in'}`} style={{ animationDelay: '0.5s' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={20} />
              Recent Activity
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="activity-skeleton">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton skeleton-activity"></div>
                ))}
              </div>
            ) : (
              <div className="activity-list">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="activity-item slide-in-right"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'submitted' && <FileText size={16} />}
                      {activity.type === 'approved' && <CheckCircle size={16} />}
                      {activity.type === 'pending' && <AlertCircle size={16} />}
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.title}</p>
                      <p className="activity-meta">
                        {activity.user && <span>{activity.user} • </span>}
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className={`dashboard-card quick-links-card ${loading ? '' : 'fade-in'}`} style={{ animationDelay: '0.6s' }}>
          <div className="card-header">
            <h3 className="card-title">Quick Access</h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="quick-links-skeleton">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton skeleton-link"></div>
                ))}
              </div>
            ) : (
              <div className="quick-links-grid">
                {quickLinks.map((link, index) => (
                  <Link 
                    key={link.title}
                    href={link.href} 
                    className="quick-link-item scale-in"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <div className="quick-link-icon" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                      {link.icon}
                    </div>
                    <span className="quick-link-title">{link.title}</span>
                    <ArrowRight size={16} className="quick-link-arrow" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECENT REPORTS */}
        <div className={`dashboard-card reports-card ${loading ? '' : 'fade-in'}`} style={{ animationDelay: '0.7s' }}>
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={20} />
              Recent Reports
            </h3>
            <Link href="/admin/all-reports" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="reports-skeleton">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton skeleton-report"></div>
                ))}
              </div>
            ) : (
              <div className="reports-list">
                {reports.map((report, index) => (
                  <div 
                    key={report.id} 
                    className="report-item slide-in-left"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="report-info">
                      <h4 className="report-title">{report.title}</h4>
                      <p className="report-meta">{report.representative} • {report.class} • {report.date}</p>
                    </div>
                    <div className={`report-status status-${report.status}`}>
                      {report.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;