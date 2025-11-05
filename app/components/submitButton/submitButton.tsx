"use client";

import React from 'react';
import './submitButton.css';

interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const SubmitButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  onClick 
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`submit-button ${loading ? 'loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <div className="button-spinner"></div>
          Signing In...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
