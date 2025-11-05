"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInput } from '@/hooks/useInput';
import AuthLayout from '../../login/authLayout';
import FormInput from '@/components/formInput/formInput';
import PasswordToggle from '@/components/PasswordToggle/passwordToggle';
import SubmitButton from '@/components/submitButton/submitButton';
import FloatingClock from '@/components/FloatingClock';
import '@/auth/authLayout.css';

const NewPasswordPage = () => {
  const router = useRouter();
  const password = useInput('');
  const confirmPassword = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match!');
      return;
    }

    // Validate password strength (optional)
    if (password.value.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('New password set');
      
      alert('Password reset successful! You can now login with your new password.');
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        welcomeMessage="Create New Password"
        title="Set New Password"
        subtitle="Enter your new password below"
      >
      <form onSubmit={handleSubmit} className="login-form">
        <p className="verify-instruction" style={{ textAlign: 'center', marginBottom: '1rem', color: '#718096' }}>
          Your new password must be different from previously used passwords.
        </p>

        {/* New Password Input */}
        <FormInput
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          value={password.value}
          onChange={password.handleChange}
          onFocus={password.handleFocus}
          onBlur={password.handleBlur}
          isFocused={password.isFocused}
          required={true}
          autoComplete="new-password"
        />

        {/* Confirm Password Input */}
        <FormInput
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword.value}
          onChange={confirmPassword.handleChange}
          onFocus={confirmPassword.handleFocus}
          onBlur={confirmPassword.handleBlur}
          isFocused={confirmPassword.isFocused}
          required={true}
          autoComplete="new-password"
        />

        {/* Password Toggle */}
        <PasswordToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        {/* Password Requirements */}
        <div style={{ 
          fontSize: '0.875rem', 
          color: '#718096', 
          marginTop: '-0.5rem',
          padding: '0.75rem',
          background: '#f7fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Password must contain:</p>
          <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li>At least 8 characters</li>
            <li>Both uppercase and lowercase letters (recommended)</li>
            <li>At least one number (recommended)</li>
            <li>At least one special character (recommended)</li>
          </ul>
        </div>

        {/* Submit Button */}
        <SubmitButton loading={isLoading}>
          Reset Password
        </SubmitButton>
      </form>
    </AuthLayout>
    <FloatingClock />
    </>
  );
};

export default NewPasswordPage;

