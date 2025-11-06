/**
 * STUDENT REVIEW PAGE (Calibrated)
 * 
 * LOCATION: /student/review
 * 
 * CHANGES MADE:
 * - Always display today's report (even after approval/denial)
 * - Hide approval buttons if user already took action
 * - Removed unnecessary reliance on `canApprove`
 * - Cleaned up state syncing and improved user feedback
 */

"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import StudentLayout from "../components/StudentLayout";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Clock,
} from "lucide-react";
import "./review.css";

// ==================== TYPES ====================
interface Report {
  id: string;
  title: string;
  reporter: {
    name: string;
    email: string;
  };
  class?: {
    name: string;
  };
  itemEvaluated: any;
  generalComment?: string;
  status: string;
  category?: string;
  createdAt: string;
  approvals?: {
    csStudent?: { name: string };
    cpStudent?: { name: string };
    approvedByCS?: boolean;
    approvedByCP?: boolean;
    commentsCS?: string;
    commentsCP?: string;
    approvedAtCS?: string;
    approvedAtCP?: string;
  };
}

interface UserAction {
  approved: boolean;
  comments?: string;
  approvedAt?: string;
  category?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: {
    report?: Report;
    userAction?: UserAction | null;
    studentRole?: "CS" | "CP";
  };
}

// ==================== COMPONENT ====================
const ReviewPage = () => {
  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://npc-smart-report-bn-v2-beta.onrender.com";

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAction, setUserAction] = useState<UserAction | null>(null);
  const [studentRole, setStudentRole] = useState<"CS" | "CP" | "">("");

  // ==================== POPUPS / MODALS ====================
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showDenyConfirm, setShowDenyConfirm] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [showDenyReason, setShowDenyReason] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const renderInPortal = (node: React.ReactNode) => {
    if (!isMounted) return null;
    return createPortal(node as any, document.body);
  };

  // ==================== FETCH REPORT ====================
  useEffect(() => {
    const fetchTodaysReport = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${BASE_URL}/api/student/report/approval`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.warn(`Failed to fetch report: ${response.status}`);
          setReport(null);
          setUserAction(null);
          setStudentRole("");
          return;
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data?.report) {
          setReport(result.data.report);
          setUserAction(result.data.userAction || null);
          setStudentRole(result.data.studentRole || "");
        } else {
          setReport(null);
          setUserAction(null);
          setStudentRole("");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        setReport(null);
        setUserAction(null);
        setStudentRole("");
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysReport();
  }, [BASE_URL]);

  // ==================== HANDLE APPROVE ====================
  const doApprove = async () => {
    if (!report) return;
    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${BASE_URL}/api/student/report/approval/${report.id}/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: "Report approved successfully" }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setInfoMessage(result.message || "Failed to approve report.");
        return;
      }

      setInfoMessage("Report approved successfully!");
      setUserAction({
        approved: true,
        comments: "Report approved successfully",
        approvedAt: new Date().toISOString(),
        category: report.category,
      });
    } catch (error) {
      console.error("Error approving report:", error);
      setInfoMessage("Unable to approve report. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = () => {
    if (!report) return;
    setShowApproveConfirm(true);
  };

  // ==================== HANDLE DENY ====================
  const doDeny = async (comments: string) => {
    if (!report) return;
    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${BASE_URL}/api/student/report/approval/${report.id}/deny`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: comments.trim() }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setInfoMessage(result.message || "Failed to deny report.");
        return;
      }

      setInfoMessage("Report denied successfully!");
      setUserAction({
        approved: false,
        comments: comments.trim(),
        approvedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error denying report:", error);
      setInfoMessage("Unable to deny report. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeny = () => {
    if (!report) return;
    setDenyReason("");
    setShowDenyReason(true);
  };

  // ==================== HELPERS ====================
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle size={20} />;
      case "bad":
        return <XCircle size={20} />;
      case "flagged":
        return <AlertTriangle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const parseItems = () => {
    if (!report?.itemEvaluated) return [];
    let items = report.itemEvaluated;

    try {
      if (typeof items === "string") items = JSON.parse(items);
      if (typeof items === "string") items = JSON.parse(items); // handle double-stringified case
    } catch (e) {
      console.warn("Error parsing evaluated items:", e);
      return [];
    }

    return Array.isArray(items)
      ? items
      : typeof items === "object"
      ? Object.entries(items).map(([key, value]) => ({
          name: key,
          description: String(value),
        }))
      : [];
  };

  const items = parseItems();

  const stats = items.reduce(
    (acc: any, item: any) => {
      const status = item.status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { good: 0, bad: 0, flagged: 0, pending: 0 }
  );

  // ==================== RENDER ====================
  return (
    <StudentLayout>
      <div className="page-header review-page-header">
        <h1>Report Review</h1>
        <p>
          Review and provide feedback on today's submitted report
          {studentRole && ` • You are reviewing as ${studentRole}`}
        </p>
      </div>

      {loading ? (
        <div className="review-skeleton">
          <div className="skeleton skeleton-header"></div>
          <div className="skeleton skeleton-stats"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-item"></div>
          ))}
        </div>
      ) : report ? (
        <div className="review-container">
          {/* USER ACTION */}
          {userAction && (
            <div
              className={`user-action-banner fade-in ${
                userAction.approved ? "approved" : "denied"
              }`}
            >
              <div className="action-content">
                {userAction.approved ? <CheckCircle size={24} /> : <XCircle size={24} />}
                <div>
                  <strong>
                    You {userAction.approved ? "approved" : "denied"} this report{" "}
                    {studentRole && `as ${studentRole}`}
                  </strong>
                  {userAction.comments && (
                    <p className="action-comments">Comments: {userAction.comments}</p>
                  )}
                  {userAction.approvedAt && (
                    <small className="action-time">
                      on {new Date(userAction.approvedAt).toLocaleString()}
                    </small>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REPORT HEADER */}
          <div className="review-header fade-in">
            <div className="review-header-content">
              <div className="review-title-section">
                <FileText size={24} />
                <div>
                  <h2 className="review-title">{report.title}</h2>
                  <p className="review-meta">
                    Submitted by <strong>{report.reporter?.name}</strong> in{" "}
                    <strong>{report.class?.name || "N/A"}</strong> on{" "}
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                  <p className="report-status">
                    Status:{" "}
                    <span
                      className={`status-badge ${report.status
                        .toLowerCase()
                        .replace("_", "-")}`}
                    >
                      {report.status.replace(/_/g, " ")}
                    </span>
                    {report.category && (
                      <>
                        {" • "}Category:{" "}
                        <span className="category-badge">{report.category}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="review-stats">
              {["good", "bad", "flagged", "pending"].map((key) => (
                <div key={key} className={`stat-box ${key}`}>
                  {getStatusIcon(key)}
                  <div>
                    <div className="stat-value">{stats[key] || 0}</div>
                    <div className="stat-label">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GENERAL COMMENT */}
          {report.generalComment && (
            <div className="general-comment fade-in">
              <h3>General Comment</h3>
              <p>{report.generalComment}</p>
            </div>
          )}

          {/* EVALUATED ITEMS */}
          <div className="inspection-section">
            <h3>Evaluated Items</h3>
            <div className="inspection-items">
              {items.length ? (
                items.map((item: any, i: number) => {
                  const status = (item.status || "pending").toLowerCase();
                  return (
                    <div
                      key={i}
                      className="inspection-item slide-in-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="item-content">
                        <div className="item-title-section">
                          <div className={`item-status status-${status}`}>
                            {getStatusIcon(status)}
                          </div>
                          <div className="item-info">
                            <h4 className="item-name">{item.name || `Item ${i + 1}`}</h4>
                            <p className="item-description">
                              {item.description || "No description"}
                            </p>
                            {item.comment && (
                              <p className="item-comment">
                                Comment: {item.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No items evaluated.</p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS — hidden if already acted */}
          {!userAction && (
            <div className="review-actions fade-in" style={{ animationDelay: "0.5s" }}>
              <button
                className="action-btn btn-deny"
                onClick={handleDeny}
                disabled={isSubmitting}
              >
                <ThumbsDown size={20} />
                {isSubmitting ? "Processing..." : "Deny Report"}
              </button>
              <button
                className="action-btn btn-approve"
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                <ThumbsUp size={20} />
                {isSubmitting ? "Processing..." : "Approve Report"}
              </button>
            </div>
          )}

          {/* ======= MODALS ======= */}
          {showApproveConfirm && renderInPortal(
            <div
              className="modal-backdrop"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowApproveConfirm(false);
              }}
            >
              <div className="modal">
                <button
                  className="modal-close"
                  onClick={() => setShowApproveConfirm(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="modal-header-icon icon-success">
                  <CheckCircle size={40} />
                </div>
                <h3>Confirm Approval</h3>
                <p>Are you sure you want to approve this report?</p>
                <div className="modal-actions">
                  <button
                    className="modal-btn btn-secondary"
                    onClick={() => setShowApproveConfirm(false)}
                  >
                    No, Cancel
                  </button>
                  <button
                    className="modal-btn btn-success"
                    onClick={async () => {
                      setShowApproveConfirm(false);
                      await doApprove();
                    }}
                  >
                    Yes, Approve
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDenyReason && renderInPortal(
            <div
              className="modal-backdrop"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowDenyReason(false);
              }}
            >
              <div className="modal">
                <button
                  className="modal-close"
                  onClick={() => setShowDenyReason(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="modal-header-icon icon-danger">
                  <XCircle size={40} />
                </div>
                <h3>Reason for Denial</h3>
                <p>Please provide a brief reason for denying this report.</p>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  rows={4}
                  className="modal-textarea"
                  placeholder="Enter reason..."
                />
                <div className="modal-actions">
                  <button
                    className="modal-btn btn-secondary"
                    onClick={() => setShowDenyReason(false)}
                  >
                    No, Cancel
                  </button>
                  <button
                    className="modal-btn btn-danger"
                    onClick={() => {
                      const trimmed = denyReason.trim();
                      if (!trimmed) {
                        setInfoMessage("Please provide a valid reason for denial.");
                        return;
                      }
                      setShowDenyReason(false);
                      setShowDenyConfirm(true);
                    }}
                  >
                    Continue to Deny
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDenyConfirm && renderInPortal(
            <div
              className="modal-backdrop"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowDenyConfirm(false);
              }}
            >
              <div className="modal">
                <button
                  className="modal-close"
                  onClick={() => setShowDenyConfirm(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="modal-header-icon icon-danger">
                  <XCircle size={40} />
                </div>
                <h3>Confirm Denial</h3>
                <p>Are you sure you want to deny this report?</p>
                <div className="modal-actions">
                  <button
                    className="modal-btn btn-secondary"
                    onClick={() => setShowDenyConfirm(false)}
                  >
                    No, Cancel
                  </button>
                  <button
                    className="modal-btn btn-danger"
                    onClick={async () => {
                      const trimmed = denyReason.trim();
                      setShowDenyConfirm(false);
                      await doDeny(trimmed);
                    }}
                  >
                    Yes, Deny
                  </button>
                </div>
              </div>
            </div>
          )}

          {infoMessage && renderInPortal(
            <div
              className="modal-backdrop"
              onClick={(e) => {
                if (e.target === e.currentTarget) setInfoMessage(null);
              }}
            >
              <div className="modal">
                <button
                  className="modal-close"
                  onClick={() => setInfoMessage(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="modal-header-icon">
                  <Clock size={40} />
                </div>
                <h3>Notice</h3>
                <p>{infoMessage}</p>
                <div className="modal-actions">
                  <button
                    className="modal-btn btn-primary"
                    onClick={() => setInfoMessage(null)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state fade-in">
          <FileText size={64} strokeWidth={1.5} />
          <h3>No Report to Review</h3>
          <p>There are no reports available for review at this time.</p>
          <small>Check back later for new submissions.</small>
        </div>
      )}
    </StudentLayout>
  );
};

export default ReviewPage;
