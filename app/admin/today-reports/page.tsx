/**
 * ADMIN TODAY'S REPORTS PAGE
 * 
 * This page shows all reports submitted today.
 * 
 * LOCATION: /admin/today-reports
 * 
 * FEATURES:
 * - List of all today's reports
 * - Filter by status, class, representative
 * - Search functionality
 * - View, approve, reject actions
 * - Real-time updates
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  FileText, 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  GraduationCap,
  Calendar,
  X,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import './today-reports.css';

// TYPES
interface Report {
  id: string;
  title: string;
  representative: string;
  class: string;
  status: 'pending' | 'approved' | 'rejected';
  time: string;
  itemsChecked: number;
  totalItems: number;
  flaggedItems: number;
  rawData?: {
    generalComment?: string;
    itemsEvaluated?: any[];
    approvals?: any;
    reviews?: any[];
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    reports: Report[];
    stats: {
      total: number;
      pending: number;
      approved: number;
      flagged: number;
    };
    date: string;
    displayDate: string;
  };
  message: string;
}

// MOCK DATA (Fallback)
const mockReports: Report[] = [
  { id: '1', title: 'Safety Inspection - Room A101', representative: 'John Doe', class: 'Computer Science', status: 'pending', time: '10:30 AM', itemsChecked: 10, totalItems: 10, flaggedItems: 2 },
  { id: '2', title: 'Facility Check - Engineering Lab', representative: 'Jane Smith', class: 'Engineering', status: 'approved', time: '09:15 AM', itemsChecked: 10, totalItems: 10, flaggedItems: 0 },
  { id: '3', title: 'Equipment Inspection - Chemistry Lab', representative: 'Mike Johnson', class: 'Chemistry', status: 'pending', time: '11:45 AM', itemsChecked: 8, totalItems: 10, flaggedItems: 1 },
  { id: '4', title: 'Fire Safety Check - Building B', representative: 'Sarah Williams', class: 'Physics', status: 'approved', time: '08:30 AM', itemsChecked: 10, totalItems: 10, flaggedItems: 0 },
  { id: '5', title: 'Monthly Safety Review - Library', representative: 'Tom Brown', class: 'Library', status: 'pending', time: '12:00 PM', itemsChecked: 10, totalItems: 10, flaggedItems: 3 },
];

const TodayReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    flagged: 0
  });
  const [displayDate, setDisplayDate] = useState('');

  /**
   * FETCH TODAY'S REPORTS FROM API
   */
  const fetchTodayReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://npc-smart-report-bn-v2-beta.onrender.com/api/admin/dashboard/getTodayReports');
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch today\'s reports');
      }
      
      setReports(result.data.reports);
      setFilteredReports(result.data.reports);
      setStats(result.data.stats);
      setDisplayDate(result.data.displayDate);
      
    } catch (err) {
      console.error('Error fetching today reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load today\'s reports');
      
      // Fallback to mock data
      setReports(mockReports);
      setFilteredReports(mockReports);
      setStats({
        total: mockReports.length,
        pending: mockReports.filter(r => r.status === 'pending').length,
        approved: mockReports.filter(r => r.status === 'approved').length,
        flagged: mockReports.reduce((sum, r) => sum + r.flaggedItems, 0)
      });
      setDisplayDate(new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayReports();
  }, []);

  // Filter reports
  useEffect(() => {
    let filtered = reports;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

  // Handle approve
  const handleApprove = async (id: string) => {
    try {
      // API call to approve report would go here
      // For now, update local state
      setReports(reports.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
      
      // Refresh data to get updated stats
      await fetchTodayReports();
    } catch (err) {
      console.error('Error approving report:', err);
      setError('Failed to approve report');
    }
  };

  // Handle reject
  const handleReject = async (id: string) => {
    try {
      // API call to reject report would go here
      // For now, update local state
      setReports(reports.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
      
      // Refresh data to get updated stats
      await fetchTodayReports();
    } catch (err) {
      console.error('Error rejecting report:', err);
      setError('Failed to reject report');
    }
  };

  // Handle view details
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  // Enhance UX: ESC to close and lock body scroll while modal is open
  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);

  /**
   * RENDER ERROR MESSAGE
   */
  const renderErrorMessage = () => (
    <div className="error-banner slide-in-right">
      <AlertCircle size={20} />
      <span>{error}</span>
      <button 
        onClick={fetchTodayReports}
        className="retry-button"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  );

  return (
    <AdminLayout>
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
              Today's Reports
            </h1>
            <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              All reports submitted today - {displayDate || new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button 
            onClick={fetchTodayReports}
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

      {/* STATISTICS */}
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
          <div className="stat-box-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.pending}</div>
            <div className="stat-box-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.approved}</div>
            <div className="stat-box-label">Approved</div>
          </div>
        </div>

        <div className="stat-box fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="stat-box-icon" style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
            <XCircle size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.flagged}</div>
            <div className="stat-box-label">Flagged Items</div>
          </div>
        </div>
      </div>

      {/* FILTERS AND SEARCH */}
      <div className="filters-section fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search reports, representatives, or classes..."
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

      {/* REPORTS LIST */}
      <div className="reports-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading today's reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state fade-in">
            <FileText size={64} />
            <h3>No reports found</h3>
            <p>{searchTerm || statusFilter !== 'all' ? 'No reports match your current filters' : 'No reports submitted today'}</p>
          </div>
        ) : (
          filteredReports.map((report, index) => (
            <div key={report.id} className="report-card slide-in-up" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
              <div className="report-card-header">
                <div className="report-card-title-section">
                  <h3 className="report-card-title">{report.title}</h3>
                  <div className="report-card-meta">
                    <span><User size={14} /> {report.representative}</span>
                    <span><GraduationCap size={14} /> {report.class}</span>
                    <span><Clock size={14} /> {report.time}</span>
                  </div>
                </div>
                <div className={`report-status status-${report.status}`}>
                  {report.status}
                </div>
              </div>

              <div className="report-card-body">
                <div className="report-progress">
                  <div className="progress-info">
                    <span>Completion: {report.itemsChecked}/{report.totalItems} items</span>
                    {report.flaggedItems > 0 && (
                      <span className="flagged-badge">{report.flaggedItems} flagged</span>
                    )}
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(report.itemsChecked / report.totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="report-actions">
                  <button className="btn-view" onClick={() => handleViewDetails(report)}>
                    <Eye size={16} />
                    View Details
                  </button>
                  {report.status === 'pending' && (
                    <>
                      <button className="btn-approve" onClick={() => handleApprove(report.id)}>
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(report.id)}>
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="report-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="report-modal-content" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
            <button className="report-modal-close" onClick={handleCloseModal} aria-label="Close">
              <X size={24} />
            </button>

            <div className="report-modal-header">
              <div>
                <h2 id="report-modal-title" className="report-modal-title">{selectedReport.title}</h2>
                <div className="report-modal-meta">
                  <div className="meta-item">
                    <User size={16} />
                    <span>{selectedReport.representative}</span>
                  </div>
                  <div className="meta-item">
                    <FileText size={16} />
                    <span>Class: {selectedReport.class}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>Submitted: {selectedReport.time}</span>
                  </div>
                </div>
              </div>
              <div className={`report-modal-status status-${selectedReport.status}`}>
                {selectedReport.status === 'approved' && <CheckCircle size={18} />}
                {selectedReport.status === 'pending' && <Clock size={18} />}
                {selectedReport.status === 'rejected' && <XCircle size={18} />}
                {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
              </div>
            </div>

            <div className="report-modal-body">
              {/* At-a-glance stats */}
              <div className="modal-stats-row">
                <div className="modal-stat">
                  <span className="label">Completion</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(selectedReport.itemsChecked / selectedReport.totalItems) * 100}%` }}></div>
                  </div>
                  <span className="value">{selectedReport.itemsChecked}/{selectedReport.totalItems}</span>
                </div>
                <div className="modal-stat">
                  <span className="label">Flagged</span>
                  <span className={`flagged-badge${selectedReport.flaggedItems ? '' : ' zero'}`}>{selectedReport.flaggedItems}</span>
                </div>
              </div>

              <div className="approval-status-section">
                <div className={`approval-badge ${selectedReport.status === 'approved' ? 'approved' : 'pending'}`}>
                  {selectedReport.status === 'approved' ? <CheckCircle size={18} /> : <Clock size={18} />}
                  <span>Admin Status: {selectedReport.status === 'approved' ? 'Approved' : selectedReport.status === 'pending' ? 'Pending' : 'Rejected'}</span>
                </div>
              </div>

              {/* General Comment */}
              {selectedReport.rawData?.generalComment && (
                <div className="general-comment-section">
                  <h3 className="section-title">General Comment</h3>
                  <p className="comment-text">{selectedReport.rawData.generalComment}</p>
                </div>
              )}

              {/* Items List */}
              <div className="items-section">
                <h3 className="section-title">Inspection Items ({selectedReport.itemsChecked} of {selectedReport.totalItems} completed)</h3>
                <div className="items-list">
                  {selectedReport.rawData?.itemsEvaluated ? (
                    selectedReport.rawData.itemsEvaluated.map((item, index) => (
                      <div key={index} className={`item-card status-${item.status?.toLowerCase()}`}>
                        <div className="item-header">
                          <span className="item-number">{index + 1}</span>
                          <span className="item-name">{item.name || `Item ${index + 1}`}</span>
                          <span className={`item-badge badge-${item.status?.toLowerCase()}`}>
                            {item.status || 'Not Checked'}
                          </span>
                        </div>
                        {item.comment && (
                          <div className="item-comment">
                            <strong>Comment:</strong> {item.comment}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-items">No items data available</div>
                  )}
                </div>
              </div>

              <div className="report-modal-footer">
                {selectedReport.status === 'pending' && (
                  <>
                    <button className="action-btn btn-reject" onClick={() => { handleReject(selectedReport.id); handleCloseModal(); }}>
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button className="action-btn btn-approve" onClick={() => { handleApprove(selectedReport.id); handleCloseModal(); }}>
                      <CheckCircle size={16} />
                      Approve
                    </button>
                  </>
                )}
                <button className="action-btn btn-close" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TodayReportsPage;