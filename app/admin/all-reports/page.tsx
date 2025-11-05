/**
 * ADMIN ALL REPORTS PAGE
 * 
 * This page shows all reports from all time periods.
 * 
 * LOCATION: /admin/all-reports
 * 
 * FEATURES:
 * - Complete list of all reports
 * - Advanced filtering (date range, status, class, representative)
 * - Sorting options
 * - Pagination
 * - Export functionality
 * - Batch actions
 */

"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  User,
  GraduationCap,
  Clock,
  X,
  AlertCircle,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import '../today-reports/today-reports.css';

// TYPES
interface Report {
  id: string;
  title: string;
  representative: string;
  class: string;
  status: 'pending' | 'approved' | 'rejected';
  time: string;
  date: string;
  itemsChecked: number;
  totalItems: number;
  flaggedItems: number;
  rawData?: {
    generalComment?: string;
    itemsEvaluated?: any[];
    approvals?: any;
    reviews?: any[];
    createdAt: string;
    updatedAt: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    reports: Report[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    stats: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
    filters: {
      search: string;
      status: string;
      sortBy: string;
      sortOrder: string;
    };
  };
  message: string;
}

const AllReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'class'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Mock data (fallback)
  const mockReports: Report[] = Array.from({ length: 50 }, (_, i) => ({
    id: `mock-${i + 1}`,
    title: `Safety Report #${i + 1}`,
    representative: `Representative ${i % 10 + 1}`,
    class: ['Computer Science', 'Engineering', 'Chemistry', 'Physics'][i % 4],
    status: (['pending', 'approved', 'rejected'] as const)[i % 3],
    time: `${8 + (i % 12)}:${(i % 4) * 15} ${i % 2 === 0 ? 'AM' : 'PM'}`,
    date: new Date(2024, 9, 30 - (i % 30)).toLocaleDateString(),
    itemsChecked: 10,
    totalItems: 10,
    flaggedItems: i % 5 === 0 ? 2 : 0
  }));

  /**
   * FETCH ALL REPORTS FROM API
   */
  const fetchAllReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: statusFilter,
        sortBy: sortBy,
        sortOrder: sortOrder
      });

      const response = await fetch(`http://localhost:5000/api/admin/dashboard/getAllReports?${params}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch reports');
      }
      
      setReports(result.data.reports);
      setPagination(result.data.pagination);
      setStats(result.data.stats);
      
    } catch (err) {
      console.error('Error fetching all reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
      
      // Fallback to mock data
      setReports(mockReports.slice(0, itemsPerPage));
      setStats({
        total: mockReports.length,
        pending: mockReports.filter(r => r.status === 'pending').length,
        approved: mockReports.filter(r => r.status === 'approved').length,
        rejected: mockReports.filter(r => r.status === 'rejected').length
      });
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(mockReports.length / itemsPerPage),
        totalCount: mockReports.length,
        hasNext: true,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchAllReports();
  }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchAllReports();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleSort = (field: 'createdAt' | 'title' | 'class') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    // Export functionality would go here
    alert('Export functionality would be implemented here');
  };

  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    document.addEventListener('keydown', onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
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
        onClick={fetchAllReports}
        className="retry-button"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
              All Reports
            </h1>
            <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Complete archive of all inspection reports ({pagination.totalCount} total)
            </p>
          </div>
          <button 
            onClick={fetchAllReports}
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
          <div className="stat-box-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-box-content">
            <div className="stat-box-value">{stats.pending}</div>
            <div className="stat-box-label">Pending</div>
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
            placeholder="Search all reports..."
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

        {/* Sorting Options */}
        <div className="sort-buttons">
          <span>Sort by:</span>
          <button
            className={`sort-btn ${sortBy === 'createdAt' ? 'active' : ''}`}
            onClick={() => handleSort('createdAt')}
          >
            Date <ArrowUpDown size={14} />
          </button>
          <button
            className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
            onClick={() => handleSort('title')}
          >
            Title <ArrowUpDown size={14} />
          </button>
          <button
            className={`sort-btn ${sortBy === 'class' ? 'active' : ''}`}
            onClick={() => handleSort('class')}
          >
            Class <ArrowUpDown size={14} />
          </button>
        </div>

        <button className="btn-export" onClick={handleExport}>
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Reports List */}
      <div className="reports-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="empty-state fade-in">
            <FileText size={64} />
            <h3>No reports found</h3>
            <p>{searchTerm || statusFilter !== 'all' ? 'No reports match your current filters' : 'No reports in the system'}</p>
          </div>
        ) : (
          reports.map((report, index) => (
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
                    <Calendar size={16} />
                    <span>Date: {selectedReport.date}</span>
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
                <button className="action-btn btn-close" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && reports.length > 0 && (
        <div className="pagination fade-in" style={{ animationDelay: '1s' }}>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages} 
            <span style={{ marginLeft: '1rem', color: '#718096' }}>
              ({pagination.totalCount} total reports)
            </span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AllReportsPage;