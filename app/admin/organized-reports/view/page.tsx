/**
 * ADMIN ORGANIZED REPORTS VIEW PAGE
 * 
 * This page shows all reports for a selected week.
 * 
 * LOCATION: /admin/organized-reports/view?week={weekNumber}
 * 
 * FEATURES:
 * - List of all reports for the week
 * - Click on report to view detailed popup
 * - Filter by status
 * - Search functionality
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { 
  ArrowLeft,
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  User,
  GraduationCap,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import '../../today-reports/today-reports.css';
import './view.css';

interface ReportItem {
  name: string;
  status: 'good' | 'bad' | 'flagged';
  comment: string;
}

interface Report {
  id: string;
  title: string;
  representative: string;
  class: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  time: string;
  items: ReportItem[];
  rawData?: {
    generalComment?: string;
    approvals?: any;
    reviews?: any[];
    createdAt: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    reports: Report[];
    stats: {
      total: number;
      approved: number;
      pending: number;
      rejected: number;
    };
    weekInfo: {
      weekNumber: string;
      startDate: string;
      endDate: string;
      totalReports: number;
    };
  };
  message: string;
}

const ViewWeekReportsPage = () => {
  const searchParams = useSearchParams();
  const weekNumber = searchParams.get('week') || '44';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [weekInfo, setWeekInfo] = useState({
    weekNumber: '44',
    startDate: 'Oct 24',
    endDate: 'Oct 30, 2024',
    totalReports: 0
  });

  // Mock data for fallback
  const mockReports: Report[] = [
    {
      id: '1',
      title: 'Safety Inspection - Room A101',
      representative: 'John Doe',
      class: 'Computer Science Year 3',
      status: 'approved',
      date: 'Oct 24, 2024',
      time: '10:30 AM',
      items: [
        { name: 'Fire Extinguisher', status: 'good', comment: 'Working properly' },
        { name: 'Emergency Exit Signs', status: 'good', comment: 'All illuminated' },
        { name: 'Window Glass', status: 'flagged', comment: 'Small crack in corner' },
        { name: 'Floor Condition', status: 'good', comment: 'Clean and safe' },
        { name: 'Electrical Outlets', status: 'good', comment: 'All functional' },
        { name: 'First Aid Kit', status: 'good', comment: 'Fully stocked' },
        { name: 'Chemical Storage', status: 'good', comment: 'Properly labeled' },
        { name: 'Ventilation System', status: 'good', comment: 'Working well' },
        { name: 'Safety Equipment', status: 'good', comment: 'All available' },
        { name: 'Lighting', status: 'good', comment: 'All lights working' }
      ]
    },
    {
      id: '2',
      title: 'Facility Check - Engineering Lab',
      representative: 'Jane Smith',
      class: 'Engineering Year 2',
      status: 'approved',
      date: 'Oct 24, 2024',
      time: '11:15 AM',
      items: [
        { name: 'Fire Extinguisher', status: 'good', comment: '' },
        { name: 'Emergency Exit Signs', status: 'good', comment: '' },
        { name: 'Window Glass', status: 'good', comment: '' },
        { name: 'Floor Condition', status: 'bad', comment: 'Wet floor near entrance - needs cleaning' },
        { name: 'Electrical Outlets', status: 'good', comment: '' },
        { name: 'First Aid Kit', status: 'good', comment: '' },
        { name: 'Chemical Storage', status: 'good', comment: '' },
        { name: 'Ventilation System', status: 'flagged', comment: 'Making unusual noise' },
        { name: 'Safety Equipment', status: 'good', comment: '' },
        { name: 'Lighting', status: 'good', comment: '' }
      ]
    },
    {
      id: '3',
      title: 'Equipment Inspection - Chemistry Lab',
      representative: 'Mike Johnson',
      class: 'Chemistry Year 4',
      status: 'pending',
      date: 'Oct 25, 2024',
      time: '09:30 AM',
      items: [
        { name: 'Fire Extinguisher', status: 'good', comment: '' },
        { name: 'Emergency Exit Signs', status: 'bad', comment: 'Two signs not illuminated' },
        { name: 'Window Glass', status: 'good', comment: '' },
        { name: 'Floor Condition', status: 'good', comment: '' },
        { name: 'Electrical Outlets', status: 'good', comment: '' },
        { name: 'First Aid Kit', status: 'flagged', comment: 'Missing bandages' },
        { name: 'Chemical Storage', status: 'bad', comment: 'Some containers unlabeled' },
        { name: 'Ventilation System', status: 'good', comment: '' },
        { name: 'Safety Equipment', status: 'good', comment: '' },
        { name: 'Lighting', status: 'good', comment: '' }
      ]
    }
  ];

  /**
   * FETCH WEEK REPORTS FROM API
   */
  const fetchWeekReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({ week: weekNumber });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`http://localhost:5000/api/admin/dashboard/getWeekReports?${params}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch week reports');
      }
      
      setReports(result.data.reports);
      setStats(result.data.stats);
      setWeekInfo(result.data.weekInfo);
      
    } catch (err) {
      console.error('Error fetching week reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load week reports');
      
      // Fallback to mock data
      setReports(mockReports);
      setStats({
        total: mockReports.length,
        approved: mockReports.filter(r => r.status === 'approved').length,
        pending: mockReports.filter(r => r.status === 'pending').length,
        rejected: mockReports.filter(r => r.status === 'rejected').length
      });
      setWeekInfo({
        weekNumber: weekNumber,
        startDate: startDate || 'Oct 24',
        endDate: endDate || 'Oct 30, 2024',
        totalReports: mockReports.length
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekReports();
  }, [weekNumber, startDate, endDate]);

  const filteredReports = reports.filter(report => {
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !report.representative.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const getItemStats = (items: ReportItem[]) => {
    return {
      good: items.filter(i => i.status === 'good').length,
      bad: items.filter(i => i.status === 'bad').length,
      flagged: items.filter(i => i.status === 'flagged').length
    };
  };

  /**
   * RENDER ERROR MESSAGE
   */
  const renderErrorMessage = () => (
    <div className="error-banner slide-in-right">
      <AlertCircle size={20} />
      <span>{error}</span>
      <button 
        onClick={fetchWeekReports}
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
          <p>Loading week {weekNumber} reports...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <Link href="/admin/organized-reports" className="back-link">
              <ArrowLeft size={20} />
              Back to Organized Reports
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: '0.5rem 0 0 0' }}>
              Week {weekInfo.weekNumber} Reports
            </h1>
            <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              {weekInfo.startDate} - {weekInfo.endDate} • {weekInfo.totalReports} reports
            </p>
          </div>
          <button 
            onClick={fetchWeekReports}
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

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box fade-in">
          <div className="stat-box-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.total}</div>
            <div className="stat-box-label">Total Reports</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.approved}</div>
            <div className="stat-box-label">Approved</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.pending}</div>
            <div className="stat-box-label">Pending</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
            <XCircle size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.rejected}</div>
            <div className="stat-box-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <Filter size={18} />
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-list">
        {filteredReports.length === 0 ? (
          <div className="empty-state fade-in">
            <FileText size={64} />
            <h3>No reports found</h3>
            <p>{searchTerm || statusFilter !== 'all' ? 'No reports match your current filters' : 'No reports available for this week'}</p>
          </div>
        ) : (
          filteredReports.map((report, index) => {
            const itemStats = getItemStats(report.items);
            return (
              <div key={report.id} className="report-card slide-in-up" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
                <div className="report-card-header">
                  <div className="report-card-title-section">
                    <h3 className="report-card-title">{report.title}</h3>
                    <div className="report-card-meta">
                      <span><User size={14} /> {report.representative}</span>
                      <span><GraduationCap size={14} /> {report.class}</span>
                      <span><Calendar size={14} /> {report.date}</span>
                      <span><Clock size={14} /> {report.time}</span>
                    </div>
                  </div>
                  <div className={`report-status status-${report.status}`}>
                    {report.status}
                  </div>
                </div>

                <div className="report-card-body">
                  <div className="item-stats-row">
                    <div className="item-stat good">
                      <CheckCircle size={16} />
                      <span>{itemStats.good} Good</span>
                    </div>
                    <div className="item-stat bad">
                      <XCircle size={16} />
                      <span>{itemStats.bad} Bad</span>
                    </div>
                    <div className="item-stat flagged">
                      <AlertTriangle size={16} />
                      <span>{itemStats.flagged} Flagged</span>
                    </div>
                  </div>

                  <div className="report-actions">
                    <button className="btn-view" onClick={() => handleViewReport(report)}>
                      <Eye size={16} />
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedReport.title}</h2>
                <p className="modal-subtitle">{selectedReport.representative} • {selectedReport.class}</p>
              </div>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="report-meta-info">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{selectedReport.date}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{selectedReport.time}</span>
                </div>
                <div className={`report-status status-${selectedReport.status}`}>
                  {selectedReport.status}
                </div>
              </div>

              {/* General Comment */}
              {selectedReport.rawData?.generalComment && (
                <div className="general-comment-section">
                  <h3 className="section-title">General Comment</h3>
                  <p className="comment-text">{selectedReport.rawData.generalComment}</p>
                </div>
              )}

              <h3 className="items-title">Inspection Items ({selectedReport.items.length} items)</h3>
              <div className="items-list">
                {selectedReport.items.map((item, idx) => (
                  <div key={idx} className={`item-card status-${item.status}`}>
                    <div className="item-header">
                      <span className="item-name">{item.name}</span>
                      <span className={`item-badge badge-${item.status}`}>
                        {item.status === 'good' && <CheckCircle size={14} />}
                        {item.status === 'bad' && <XCircle size={14} />}
                        {item.status === 'flagged' && <AlertTriangle size={14} />}
                        {item.status}
                      </span>
                    </div>
                    {item.comment && (
                      <div className="item-comment">
                        <strong>Comment:</strong> {item.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ViewWeekReportsPage;