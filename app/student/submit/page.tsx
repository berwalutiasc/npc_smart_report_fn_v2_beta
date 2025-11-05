/**
 * SUBMIT REPORT PAGE
 *
 * This page allows students to submit inspection reports.
 *
 * LOCATION: /student/submit
 *
 * FEATURES:
 * - Fetch all inspection items from the backend API
 * - Mark items as Good, Bad, or Flagged
 * - Add comments to each item
 * - Mark All Good button
 * - Clear Selection button
 * - Submit Report button
 * - Quick tips sidebar
 * - Statistics display
 */

"use client";

import React, { useState, useEffect } from "react";
import StudentLayout from "../components/StudentLayout";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  RotateCcw,
  Lightbulb,
  TrendingUp,
  Info,
} from "lucide-react";
import { toastSuccess, toastError } from "@/lib/toast-utils";
import "./submit.css";

// TYPES
interface InspectionItem {
  id: string;
  name: string;
  description: string;
  status: "good" | "bad" | "flagged" | "pending";
  comment: string;
}

const SubmitPage = () => {
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalComment, setGeneralComment] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  useEffect(() => {
    setStudentEmail(localStorage.getItem("studentEmail") || "");
  }, []);

  /**
   * FETCH INSPECTION ITEMS FROM BACKEND
   */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/item/getAllItems");
        const data = await res.json();

        if (data.success && Array.isArray(data.items)) {
          const fetchedItems = data.items.map((item: any, index: number) => ({
            id: item.id,
            name: item.name,
            description: item.description || "No description provided.",
            status: "pending",
            comment: "",
          }));
          setItems(fetchedItems);
        } else {
          console.error("Failed to fetch items:", data.message);
        }
      } catch (err) {
        console.error("Error fetching inspection items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  /**
   * CALCULATE STATISTICS
   */
  const stats = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  /**
   * HANDLE STATUS CHANGE
   */
  const handleStatusChange = (
    itemId: string,
    status: "good" | "bad" | "flagged"
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
  };

  /**
   * HANDLE COMMENT CHANGE
   */
  const handleCommentChange = (itemId: string, comment: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, comment } : item))
    );
  };

  /**
   * MARK ALL ITEMS AS GOOD
   */
  const handleMarkAllGood = () => {
    setItems((prev) => prev.map((item) => ({ ...item, status: "good" })));
  };

  /**
   * CLEAR SELECTION
   */
  const handleClearSelection = () => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, status: "pending", comment: "" }))
    );
  };

  /**
   * SUBMIT REPORT TO BACKEND
   */
  const handleSubmit = async () => {
    const hasUnmarked = items.some((item) => item.status === "pending");
    if (hasUnmarked) {
      toastError({
        title: "Incomplete Form",
        description: "Please mark all items before submitting!",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/student/report/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          reporterEmail: studentEmail,
          //add date of today on title
          title: "Classroom Inspection Report " + new Date().toLocaleDateString(),
          //we will provide the comment / notes that was sent by the student in the comment field not for each item but the overall comment / notes
          generalComment: generalComment || "Inspection completed successfully.",
          itemEvaluated: items,
          category: "ONTIME",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toastSuccess({
          title: "Report Submitted Successfully!",
          description: "Your inspection report has been submitted for review",
        });
        setItems(
          items.map((item) => ({
            ...item,
            status: "pending",
            comment: "",
          }))
        );
        setGeneralComment("");
      } else {
        toastError({
          title: "Submission Failed",
          description: data.message || "Failed to submit report.",
        });
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      toastError({
        title: "Error",
        description: "An error occurred while submitting your report.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * RENDER STATUS ICON
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle size={20} />;
      case "bad":
        return <XCircle size={20} />;
      case "flagged":
        return <AlertTriangle size={20} />;
      default:
        return null;
    }
  };

  /**
   * RENDER PAGE
   */
  if (isLoading) {
    return (
      <StudentLayout>
        <div className="loading-screen">
          <p>Loading inspection items...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1a202c",
            margin: 0,
          }}
        >
          Submit Report
        </h1>
        <p
          style={{
            color: "#718096",
            marginTop: "0.5rem",
            fontSize: "0.95rem",
          }}
        >
          Complete the inspection checklist and submit your report
        </p>
      </div>

      <div className="submit-container">
        {/* LEFT COLUMN - FORM */}
        <div className="submit-left">
          {/* ACTION BUTTONS */}
          <div className="action-buttons fade-in">
            <button className="btn-mark-all" onClick={handleMarkAllGood}>
              <CheckCircle size={18} />
              Mark All Good
            </button>
            <button className="btn-clear" onClick={handleClearSelection}>
              <RotateCcw size={18} />
              Clear Selection
            </button>
          </div>

          {/* INSPECTION ITEMS FORM */}
          <div className="inspection-form">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="form-item slide-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="form-item-header">
                  <div className="form-item-title">
                    <span className="item-number">{index + 1}</span>
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className="form-item-body">
                  {/* STATUS BUTTONS */}
                  <div className="status-buttons">
                    <button
                      className={`status-btn good ${
                        item.status === "good" ? "active" : ""
                      }`}
                      onClick={() => handleStatusChange(item.id, "good")}
                    >
                      <CheckCircle size={18} />
                      Good
                    </button>
                    <button
                      className={`status-btn bad ${
                        item.status === "bad" ? "active" : ""
                      }`}
                      onClick={() => handleStatusChange(item.id, "bad")}
                    >
                      <XCircle size={18} />
                      Bad
                    </button>
                    <button
                      className={`status-btn flagged ${
                        item.status === "flagged" ? "active" : ""
                      }`}
                      onClick={() => handleStatusChange(item.id, "flagged")}
                    >
                      <AlertTriangle size={18} />
                      Flagged
                    </button>
                  </div>

                  {/* COMMENT FIELD */}
                  <div className="comment-field">
                    <label>
                      Comment / Notes{" "}
                      {item.status !== "good" && (
                        <span className="required">*</span>
                      )}
                    </label>
                    <textarea
                      placeholder="Add your observations or notes here..."
                      value={item.comment}
                      onChange={(e) =>
                        handleCommentChange(item.id, e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GENERAL COMMENT / NOTES FIELD */}
          <div className="general-comment-field fade-in" style={{ animationDelay: "0.5s" }}>
            <label htmlFor="generalComment">
              Comment / Notes
            </label>
            <textarea
              id="generalComment"
              placeholder="Add your overall observations or notes for this inspection report..."
              value={generalComment}
              onChange={(e) => setGeneralComment(e.target.value)}
              rows={4}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            className="btn-submit-report fade-in"
            style={{ animationDelay: "0.6s" }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Send size={20} />
            {isSubmitting ? "Submitting Report..." : "Submit Report"}
          </button>
        </div>

        {/* RIGHT COLUMN - TIPS & STATS */}
        <div className="submit-right">
          {/* QUICK TIPS */}
          <div
            className="tips-card fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="tips-header">
              <Lightbulb size={20} />
              <h3>Quick Tips</h3>
            </div>
            <div className="tips-body">
              <div className="tip-item">
                <div className="tip-icon good">
                  <CheckCircle size={18} />
                </div>
                <div className="tip-content">
                  <h4>Good</h4>
                  <p>
                    Item is in excellent condition, functioning properly, and
                    meets all safety standards.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-icon bad">
                  <XCircle size={18} />
                </div>
                <div className="tip-content">
                  <h4>Bad</h4>
                  <p>
                    Item is broken, missing, or poses a safety hazard. Requires
                    immediate attention.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-icon flagged">
                  <AlertTriangle size={18} />
                </div>
                <div className="tip-content">
                  <h4>Flagged</h4>
                  <p>
                    Item needs attention or minor repairs. Not critical but
                    should be addressed soon.
                  </p>
                </div>
              </div>

              <div className="tip-note">
                <Info size={16} />
                <p>
                  Always add comments for Bad and Flagged items to provide
                  context.
                </p>
              </div>
            </div>
          </div>

          {/* STATISTICS */}
          <div
            className="stats-card fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="stats-header">
              <TrendingUp size={20} />
              <h3>Submission Stats</h3>
            </div>
            <div className="stats-body">
              <div className="stat-item good">
                <CheckCircle size={20} />
                <div className="stat-info">
                  <div className="stat-value">{stats.good || 0}</div>
                  <div className="stat-label">Good Items</div>
                </div>
              </div>

              <div className="stat-item bad">
                <XCircle size={20} />
                <div className="stat-info">
                  <div className="stat-value">{stats.bad || 0}</div>
                  <div className="stat-label">Bad Items</div>
                </div>
              </div>

              <div className="stat-item flagged">
                <AlertTriangle size={20} />
                <div className="stat-info">
                  <div className="stat-value">{stats.flagged || 0}</div>
                  <div className="stat-label">Flagged Items</div>
                </div>
              </div>

              <div className="stat-item pending">
                <div className="pending-icon">—</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.pending || 0}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>

              <div className="progress-bar">
                <div className="progress-label">
                  <span>Completion Progress</span>
                  <span className="progress-percentage">
                    {Math.round(
                      ((items.length - (stats.pending || 0)) / items.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        ((items.length - (stats.pending || 0)) /
                          items.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default SubmitPage;
