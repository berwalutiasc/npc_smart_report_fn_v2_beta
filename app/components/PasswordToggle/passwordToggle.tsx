"use client";

import React from 'react';
import './passwordToggle.css';

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ showPassword, onToggle }: PasswordToggleProps) => {
  return (
    <div className="password-toggle-container">
      <label className="toggle-label">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={onToggle}
          className="toggle-checkbox"
        />
        <span className="toggle-slider"></span>
        <span className="toggle-text">Show Password</span>
      </label>
    </div>
  );
};

export default PasswordToggle;
