"use client";

import React from 'react';
import Image from 'next/image';
import '@/auth/authLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  welcomeMessage: string;
}

const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  welcomeMessage 
}: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {/* Card Container with Image and Form */}
        <div className="auth-card">
          {/* Left Side - Image (Hidden on Mobile) */}
          <div className="auth-image-section">
            <Image
              src="/assets/hero-2.jpg"
              alt="Login illustration"
              fill
              className="auth-image"
              priority
            />
            <div className="image-overlay">
              <div className="image-overlay-content">
                <div className="welcome-icon">👋</div>
                <h1 className="welcome-title">{welcomeMessage}</h1>
                <p className="welcome-subtitle">
                  Please sign in to access your account
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form Content */}
          <div className="auth-form-section">
            <div className="form-content">
              <div className="form-header">
                <h2 className="form-title">{title}</h2>
                {subtitle && <p className="form-subtitle">{subtitle}</p>}
              </div>
              
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
