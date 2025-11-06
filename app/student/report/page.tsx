"use client";

import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Search,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle
} from 'lucide-react';
import { toastError, toastSuccess } from '@/lib/toast-utils';
import './report.css';

// TYPES
interface Report {
  id: string;
  title: string;
  submissionDate: string;
  csApproved: boolean;
  cpApproved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  class: string;
  generalComment?: string;
  itemEvaluated?: any;
}

interface ReportDetail {
  id: string;
  title: string;
  class: string;
  createdAt: string;
  generalComment?: string;
  itemEvaluated?: Array<{
    id: string;
    name: string;
    status: 'good' | 'bad' | 'flagged';
    comment: string;
  }>;
  csApproved: boolean;
  cpApproved: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

type FilterType = 'all' | 'daily' | 'weekly' | 'monthly';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const ReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    hasNext: false,
    hasPrev: false
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState<ReportDetail | null>(null);
  const [loadingReportDetails, setLoadingReportDetails] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("studentEmail") || '';
    setStudentEmail(email);
  }, []);

  // Fetch reports from API
  const fetchReports = async (filter: FilterType = activeFilter, search: string = searchQuery, page: number = 1) => {
    if (!studentEmail) {
      console.log('Student email not available yet');
      return;
    }
    
    setLoading(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        studentEmail: studentEmail,
        page: page.toString(),
        limit: '10'
      });

      // Add filter if not 'all'
      if (filter && filter !== 'all') {
        params.append('filter', filter);
      }

      // Add search query if provided
      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      console.log('Fetching reports with params:', params.toString());

      const response = await fetch(`https://npc-smart-report-bn-v2-beta.onrender.com/api/student/report/getReports?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Handle 404 (not found) gracefully
      if (response.status === 404) {
        console.log('No reports found (404)');
        setReports([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalReports: 0,
          hasNext: false,
          hasPrev: false
        });
        setLoading(false);
        return;
      }
      
      // Handle other HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);

      if (result.success && result.data) {
        const reportsData = result.data.reports || [];
        const paginationData = result.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalReports: 0,
          hasNext: false,
          hasPrev: false
        };
        
        setReports(reportsData);
        setPagination(paginationData);
        
        if (reportsData.length === 0) {
          console.log('No reports found in response data');
        }
      } else {
        console.log('API returned failure:', result.message);
        setReports([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalReports: 0,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toastError({
        title: 'Failed to Load Reports',
        description: 'Unable to fetch reports. Please try again later.',
      });
      setReports([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalReports: 0,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load and handle filter/search changes
  useEffect(() => {
    if (!studentEmail) {
      console.log('Waiting for student email...');
      return;
    }
    
    console.log('Fetching reports with email:', studentEmail);
    
    const timeoutId = setTimeout(() => {
      fetchReports(activeFilter, searchQuery, 1);
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [studentEmail, activeFilter, searchQuery]);

  // Fetch report details by ID
  const fetchReportDetails = async (reportId: string) => {
    setLoadingReportDetails(true);
    try {
      console.log('Fetching report details for ID:', reportId);
      
      const response = await fetch(`https://npc-smart-report-bn-v2-beta.onrender.com/api/student/report/getReportById/${reportId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Handle 404 (not found) gracefully
      if (response.status === 404) {
        setReportDetails(null);
        toastError({
          title: 'Report Not Found',
          description: 'The requested report could not be found.',
        });
        setLoadingReportDetails(false);
        return;
      }
      
      // Handle other errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Report details API error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Report details response:', result);
      
      if (result.success && result.data) {
        setReportDetails(result.data);
      } else {
        setReportDetails(null);
        toastError({
          title: 'Report Not Available',
          description: result.message || 'Report details are not available.',
        });
      }
    } catch (error) {
      console.error('Error loading report details:', error);
      setReportDetails(null);
      toastError({
        title: 'Error',
        description: 'Unable to load report details. Please try again later.',
      });
    } finally {
      setLoadingReportDetails(false);
    }
  };

  // Handle view report
  const handleView = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsModalOpen(true);
    fetchReportDetails(reportId);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReportId(null);
    setReportDetails(null);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Handle download report
  const handleDownload = async (reportId: string) => {
    setDownloadingId(reportId);
    
    try {
      console.log('Downloading report:', reportId);
      
      const response = await fetch(
        `https://npc-smart-report-bn-v2-beta.onrender.com/api/student/report/download/${reportId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    
      // Handle errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download error:', errorText);
        throw new Error(`Download failed: ${response.status}`);
      }
    
      // Get raw binary data
      const blob = await response.blob();
    
      // Create URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toastSuccess({
        title: 'Download Started',
        description: 'Report is being downloaded successfully.',
      });
    } catch (error) {
      console.error('Download failed:', error);
      toastError({
        title: 'Download Failed',
        description: 'Failed to download report. Please try again.',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchReports(activeFilter, searchQuery, newPage);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <StudentLayout>
      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>My Reports</h1>
        <p>
          View and manage your submitted reports {pagination.totalReports > 0 && `(${pagination.totalReports} total)`}
        </p>
      </div>

      {/* FILTERS AND SEARCH */}
      <div className="report-controls fade-in">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
            disabled={loading}
          >
            <Filter size={16} />
            All Reports
          </button>
          <button
            className={`filter-btn ${activeFilter === 'daily' ? 'active' : ''}`}
            onClick={() => handleFilterChange('daily')}
            disabled={loading}
          >
            <Calendar size={16} />
            Daily
          </button>
          <button
            className={`filter-btn ${activeFilter === 'weekly' ? 'active' : ''}`}
            onClick={() => handleFilterChange('weekly')}
            disabled={loading}
          >
            <Calendar size={16} />
            Weekly
          </button>
          <button
            className={`filter-btn ${activeFilter === 'monthly' ? 'active' : ''}`}
            onClick={() => handleFilterChange('monthly')}
            disabled={loading}
          >
            <Calendar size={16} />
            Monthly
          </button>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search reports by title or comment..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            disabled={loading}
          />
        </div>
      </div>

      {/* REPORTS LIST */}
      <div className="reports-container">
        {loading ? (
          // Loading skeletons
          <div className="reports-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="report-card skeleton-card">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-badges"></div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          // Empty state
          <div className="empty-state fade-in">
            <FileText size={64} strokeWidth={1.5} />
            <h3>No reports found</h3>
            <p>
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t submitted any reports yet'}
            </p>
            {!searchQuery && activeFilter === 'all' && (
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/student/submit'}
              >
                Submit Your First Report
              </button>
            )}
          </div>
        ) : (
          // Reports list
          <>
            <div className="reports-list">
              {reports.map((report, index) => (
                <div
                  key={report.id}
                  className="report-card slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="report-card-header">
                    <div className="report-info">
                      <h3 className="report-name">{report.title}</h3>
                      <div className="report-meta">
                        <Calendar size={14} />
                        <span>
                          Submitted: {new Date(report.submissionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {report.class && (
                          <span className="report-class">Class: {report.class}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`report-status status-${report.status}`}>
                      {report.status === 'approved' && <CheckCircle size={16} />}
                      {report.status === 'pending' && <Clock size={16} />}
                      {report.status === 'rejected' && <XCircle size={16} />}
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </div>
                  </div>

                  <div className="report-card-actions">
                    <button
                      className="action-btn btn-view"
                      onClick={() => handleView(report.id)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      className="action-btn btn-download"
                      onClick={() => handleDownload(report.id)}
                      disabled={downloadingId === report.id}
                    >
                      <Download size={16} />
                      {downloadingId === report.id ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev || loading}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <span className="pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext || loading}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Report Detail Modal */}
      {isModalOpen && (
        <div className="report-modal-overlay" onClick={handleBackdropClick}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="report-modal-close"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {loadingReportDetails ? (
              <div className="report-modal-loading">
                <div className="loading-spinner"></div>
                <p>Loading report details...</p>
              </div>
            ) : reportDetails ? (
              <>
                <div className="report-modal-header">
                  <div>
                    <h2 className="report-modal-title">{reportDetails.title}</h2>
                    <div className="report-modal-meta">
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>
                          Uploaded: {new Date(reportDetails.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {reportDetails.class && (
                        <div className="meta-item">
                          <FileText size={16} />
                          <span>Class: {reportDetails.class}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`report-modal-status status-${reportDetails.status}`}>
                    {reportDetails.status === 'approved' && <CheckCircle size={18} />}
                    {reportDetails.status === 'pending' && <Clock size={18} />}
                    {reportDetails.status === 'rejected' && <XCircle size={18} />}
                    {reportDetails.status.charAt(0).toUpperCase() + reportDetails.status.slice(1)}
                  </div>
                </div>

                <div className="report-modal-body">
                  {/* General Comment */}
                  {reportDetails.generalComment && (
                    <div className="general-comment-section">
                      <h3 className="section-title">General Comment / Notes</h3>
                      <p className="comment-text">{reportDetails.generalComment}</p>
                    </div>
                  )}

                  {/* Inspection Items */}
                  {reportDetails.itemEvaluated && reportDetails.itemEvaluated.length > 0 && (
                    <div className="items-section">
                      <h3 className="section-title">Inspection Items</h3>
                      <div className="items-list">
                        {reportDetails.itemEvaluated.map((item, index) => (
                          <div key={item.id || index} className={`item-card status-${item.status}`}>
                            <div className="item-header">
                              <span className="item-number">{index + 1}</span>
                              <span className="item-name">{item.name}</span>
                              <span className={`item-badge badge-${item.status}`}>
                                {item.status === 'good' && <CheckCircle size={14} />}
                                {item.status === 'bad' && <XCircle size={14} />}
                                {item.status === 'flagged' && <AlertTriangle size={14} />}
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
                  )}
                </div>
              </>
            ) : (
              <div className="report-modal-error">
                <XCircle size={48} />
                <p>Failed to load report details</p>
                <button className="btn-retry" onClick={() => selectedReportId && fetchReportDetails(selectedReportId)}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default ReportPage;