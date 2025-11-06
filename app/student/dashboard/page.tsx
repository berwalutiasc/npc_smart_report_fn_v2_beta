/**
 * STUDENT DASHBOARD PAGE
 * 
 * This is the main dashboard page that students see after logging in.
 * 
 * LOCATION: /student/dashboard
 * 
 * FEATURES:
 * - Statistics cards (Reports, Students, Classes)
 * - Weekly student activity chart
 * - Recent activity feed
 * - Quick links to other pages
 * - Recent reports list
 * - Loading animations
 * - Smooth entrance animations
 */

"use client";

import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
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
  Bell,
  Eye,
  ArrowRight,
  Activity
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
  type: 'submitted' | 'approved' | 'pending' | 'rejected';
  title: string;
  time: string;
  user?: string;
}

interface RecentReport {
  id: string;
  title: string;
  status: 'approved' | 'pending' | 'draft' | 'rejected';
  date: string;
  class: string;
}

interface WeeklyData {
  day: string;
  count: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    stats: Array<{
      title: string;
      value: number;
      icon: string;
      trend: number;
      color: string;
    }>;
    weeklyData: WeeklyData[];
    recentActivity: ActivityItem[];
    recentReports: RecentReport[];
  };
}

const quickLinks = [
  { title: 'Profile', href: '/student/profile', icon: <User size={20} />, color: '#3b82f6' },
  { title: 'Settings', href: '/student/settings', icon: <Settings size={20} />, color: '#6b7280' },
  { title: 'Reminders', href: '/student/reminder', icon: <Bell size={20} />, color: '#f59e0b' },
  { title: 'Reviews', href: '/student/review', icon: <Eye size={20} />, color: '#8b5cf6' }
];

// Icon mapping for API response
const iconMap = {
  'FileText': <FileText size={24} />,
  'Users': <Users size={24} />,
  'GraduationCap': <GraduationCap size={24} />,
  'TrendingUp': <TrendingUp size={24} />
};

/**
 * DASHBOARD PAGE COMPONENT
 */
const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [reports, setReports] = useState<RecentReport[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get email directly from localStorage
        const studentEmail = localStorage.getItem('studentEmail');
        if (!studentEmail) {
          throw new Error('Student email not found. Please log in again.');
        }

        const response = await fetch(`https://npc-smart-report-bn-v2-beta.onrender.com/api/student/dashboard/mydash?email=${studentEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const responseData: ApiResponse = await response.json();
        
        // Check if the response is successful and has data
        if (!responseData.success || !responseData.data) {
          throw new Error('Invalid API response structure');
        }
        
        const data = responseData.data;
        
        // Default stats to always show essential cards
        const defaultStats: StatCardData[] = [
          {
            title: 'Total Reports',
            value: 0,
            icon: <FileText size={24} />,
            trend: 0,
            color: '#3b82f6'
          },
          {
            title: 'Active Students',
            value: 0,
            icon: <Users size={24} />,
            trend: 0,
            color: '#10b981'
          },
          {
            title: 'My Submissions',
            value: 0,
            icon: <FileText size={24} />,
            trend: 0,
            color: '#8b5cf6'
          },
          {
            title: 'Pending Reviews',
            value: 0,
            icon: <Eye size={24} />,
            trend: 0,
            color: '#f59e0b'
          }
        ];
        
        // Transform the data to match frontend expectations with null checks
        const transformedStats = (data.stats || []).map(stat => ({
          ...stat,
          icon: iconMap[stat.icon as keyof typeof iconMap] || <FileText size={24} />
        }));

        // Ensure essential stats are always shown, use API data if available, otherwise use defaults
        setStats(transformedStats.length > 0 ? transformedStats : defaultStats);
        setActivities(data.recentActivity || []);
        setReports(data.recentReports || []);
        setWeeklyData(data.weeklyData || [
          { day: 'Mon', count: 0 },
          { day: 'Tue', count: 0 },
          { day: 'Wed', count: 0 },
          { day: 'Thu', count: 0 },
          { day: 'Fri', count: 0 },
          { day: 'Sat', count: 0 },
          { day: 'Sun', count: 0 }
        ]);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        
        // Fallback to mock data in case of error
        setStats([
          {
            title: 'Total Reports',
            value: 0,
            icon: <FileText size={24} />,
            trend: 0,
            color: '#3b82f6'
          },
          {
            title: 'Active Students',
            value: 0,
            icon: <Users size={24} />,
            trend: 0,
            color: '#10b981'
          },
          {
            title: 'My Submissions',
            value: 0,
            icon: <FileText size={24} />,
            trend: 0,
            color: '#8b5cf6'
          },
          {
            title: 'Pending Reviews',
            value: 0,
            icon: <Eye size={24} />,
            trend: 0,
            color: '#f59e0b'
          }
        ]);
        setActivities([]);
        setReports([]);
        setWeeklyData([
          { day: 'Mon', count: 0 },
          { day: 'Tue', count: 0 },
          { day: 'Wed', count: 0 },
          { day: 'Thu', count: 0 },
          { day: 'Fri', count: 0 },
          { day: 'Sat', count: 0 },
          { day: 'Sun', count: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate max value for chart scaling
  const maxChartValue = Math.max(...(weeklyData || []).map(data => data.count), 1);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'draft': return '#6b7280';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get activity icon color
  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'submitted': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <StudentLayout>
      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your reports.</p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner fade-in">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

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
          (stats || []).map((stat, index) => (
            <div 
              key={index} 
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
              Weekly Activity
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
                  <div key={index} className="chart-bar-wrapper">
                    <div className="chart-bar-container">
                      <div 
                        className="chart-bar slide-up"
                        style={{ 
                          height: `${(data.count / maxChartValue) * 100}%`,
                          animationDelay: `${0.5 + index * 0.1}s`,
                          backgroundColor: data.count > 0 ? '#3b82f6' : '#e2e8f0'
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
            <Link href="/student/report" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="activity-skeleton">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton skeleton-activity"></div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="activity-list">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="activity-item slide-in-right"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div 
                      className="activity-icon"
                      style={{ backgroundColor: `${getActivityIconColor(activity.type)}15`, color: getActivityIconColor(activity.type) }}
                    >
                      {activity.type === 'submitted' && <FileText size={16} />}
                      {activity.type === 'approved' && <CheckCircle size={16} />}
                      {activity.type === 'pending' && <AlertCircle size={16} />}
                      {activity.type === 'rejected' && <AlertCircle size={16} />}
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
            ) : (
              <div className="empty-state">
                <FileText size={48} />
                <p>No recent activity</p>
                <span>Your recent activities will appear here</span>
              </div>
            )}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className={`dashboard-card quick-links-card ${loading ? '' : 'fade-in'}`} style={{ animationDelay: '0.6s' }}>
          <div className="card-header">
            <h3 className="card-title">Quick Links</h3>
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
                    key={index} 
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
            <Link href="/student/report" className="view-all-link">
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
            ) : reports.length > 0 ? (
              <div className="reports-list">
                {reports.map((report, index) => (
                  <div 
                    key={report.id} 
                    className="report-item slide-in-left"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="report-info">
                      <h4 className="report-title">{report.title}</h4>
                      <p className="report-meta">{report.class} • {report.date}</p>
                    </div>
                    <div 
                      className="report-status"
                      style={{ 
                        backgroundColor: `${getStatusColor(report.status)}15`,
                        color: getStatusColor(report.status)
                      }}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={48} />
                <p>No reports yet</p>
                <span>Your submitted reports will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default DashboardPage;