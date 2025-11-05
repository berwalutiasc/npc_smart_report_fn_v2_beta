/**
 * STUDENT REMINDER PAGE
 * 
 * This page allows sending email reminders to recipients.
 * 
 * LOCATION: /student/reminder
 * 
 * FEATURES:
 * - Send report reminders
 * - Dropdown for reminder type selection
 * - Subject and email content fields
 * - Recipients selection
 * - Loading states and animations
 * - Form validation
 */

"use client";

import React, { useState } from 'react';
import StudentLayout from '../components/StudentLayout';
import { 
  Send, 
  Users, 
  Mail, 
  FileText,
  CheckCircle,
  Loader,
  Bell
} from 'lucide-react';
import './reminder.css';

// TYPES
interface ReminderFormData {
  reminderType: string;
  subject: string;
  message: string;
}


const ReminderPage = () => {
  const [formData, setFormData] = useState<ReminderFormData>({
    reminderType: 'report_submission',
    subject: '',
    message: '',
  });
  
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleInputChange = (field: keyof ReminderFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };
  

  

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle send reminder
  const handleSendReminder = async () => {
    if (!validateForm()) return;

    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setShowSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        reminderType: 'report_submission',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  // Get reminder type template
  const getReminderTemplate = (type: string) => {
    const templates: Record<string, { subject: string; message: string }> = {
      report_submission: {
        subject: 'Reminder: Report Submission Due',
        message: 'This is a friendly reminder that your report submission is due soon. Please ensure you complete and submit your report by the deadline.\n\nThank you for your cooperation.'
      },
      review_pending: {
        subject: 'Action Required: Report Review Pending',
        message: 'You have pending reports that require your review. Please log in to the system and complete the review process.\n\nYour prompt attention is appreciated.'
      },
      approval_needed: {
        subject: 'Approval Required: Reports Awaiting Your Approval',
        message: 'There are reports waiting for your approval. Please review and approve/deny them at your earliest convenience.\n\nThank you.'
      },
      deadline_approaching: {
        subject: 'Alert: Deadline Approaching',
        message: 'This is to inform you that the deadline for your report submission is approaching. Please complete your work before the due date.\n\nThank you.'
      }
    };

    return templates[type] || { subject: '', message: '' };
  };

  // Handle reminder type change
  const handleReminderTypeChange = (type: string) => {
    const template = getReminderTemplate(type);
    setFormData({
      ...formData,
      reminderType: type,
      subject: template.subject,
      message: template.message
    });
  };

  return (
    <StudentLayout>
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1a202c',
          margin: 0 
        }}>
          Send Reminder
        </h1>
        <p style={{ 
          color: '#718096', 
          marginTop: '0.5rem',
          fontSize: '0.95rem' 
        }}>
          Send email reminders to students and staff
        </p>
      </div>

      {/* SUCCESS MESSAGE
      {showSuccess && (
        <div className="success-banner slide-down">
          <CheckCircle size={24} />
          <div>
            <h4>Reminder Sent Successfully!</h4>
            <p>Your reminder has been sent to {formData.recipients.length} recipient(s)</p>
          </div>
        </div>
      )} */}

      {/* REMINDER FORM */}
      <div className="reminder-container fade-in">
        <div className="reminder-card">
          <div className="reminder-card-header">
            <Bell size={24} />
            <div>
              <h3 className="card-title">Compose Reminder</h3>
              <p className="card-subtitle">Fill in the details to send an email reminder</p>
            </div>
          </div>

          <div className="reminder-form">
            {/* REMINDER TYPE */}
            <div className="form-field">
              <label className="form-label">
                <FileText size={16} />
                Reminder Type
              </label>
              <select
                className="form-select"
                value={formData.reminderType}
                onChange={(e) => handleReminderTypeChange(e.target.value)}
              >
                <option value="report_submission">Report Submission Reminder</option>
                <option value="review_pending">Review Pending Reminder</option>
                <option value="approval_needed">Approval Needed Reminder</option>
                <option value="deadline_approaching">Deadline Approaching Alert</option>
              </select>
            </div>

            {/* SUBJECT */}
            <div className="form-field">
              <label className="form-label">
                <Mail size={16} />
                Subject
              </label>
              <input
                type="text"
                className={`form-input ${errors.subject ? 'error' : ''}`}
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
              {errors.subject && (
                <span className="error-message">{errors.subject}</span>
              )}
            </div>

            {/* MESSAGE */}
            <div className="form-field">
              <label className="form-label">
                <FileText size={16} />
                Message
              </label>
              <textarea
                className={`form-textarea ${errors.message ? 'error' : ''}`}
                placeholder="Enter your message here..."
                rows={8}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
              {errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
              <div className="character-count">
                {formData.message.length} characters
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className="btn-send"
              onClick={handleSendReminder}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader size={20} className="spinning" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Reminder
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default ReminderPage;

