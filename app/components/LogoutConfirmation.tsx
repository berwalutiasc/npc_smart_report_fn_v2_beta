/**
 * LOGOUT CONFIRMATION POPUP COMPONENT
 * 
 * A reusable modal popup that asks users to confirm before logging out.
 * 
 * USAGE:
 * ```tsx
 * const [showLogoutPopup, setShowLogoutPopup] = useState(false);
 * 
 * <LogoutConfirmation 
 *   isOpen={showLogoutPopup}
 *   onClose={() => setShowLogoutPopup(false)}
 *   onConfirm={handleLogout}
 *   isLoading={isLoggingOut}
 * />
 * ```
 */

"use client";

import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';
import './LogoutConfirmation.css';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div className="logout-popup-overlay" onClick={handleBackdropClick}>
      <div className="logout-popup-container">
        <button
          className="logout-popup-close"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="logout-popup-icon">
          <LogOut size={48} />
        </div>

        <h2 className="logout-popup-title">Are you sure you want to logout?</h2>
        
        <p className="logout-popup-message">
          You will be signed out of your account. You'll need to log in again to access your dashboard.
        </p>

        <div className="logout-popup-actions">
          <button
            className="logout-popup-button logout-popup-button-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            No, Cancel
          </button>
          <button
            className="logout-popup-button logout-popup-button-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Yes, Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;

