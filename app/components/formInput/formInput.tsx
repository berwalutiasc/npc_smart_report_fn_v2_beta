"use client";

import React from 'react';
import './formInput.css';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  required?: boolean;
  autoComplete?: string;
  id?: string;
}

const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused,
  required = false,
  autoComplete = 'off',
  id
}: FormInputProps) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div className="form-input-container">
      <div className="input-wrapper">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          autoComplete={autoComplete}
          className="form-input"
        />
        <label 
          htmlFor={inputId} 
          className={`form-label ${value || isFocused ? 'label-raised' : ''}`}
        >
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
        <div className="input-underline">
          <div className={`underline ${isFocused ? 'underline-active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};

export default FormInput;
