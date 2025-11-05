"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInput } from '@/hooks/useInput';
import AuthLayout from '../login/authLayout';
import FormInput from '@/components/formInput/formInput';
import SubmitButton from '@/components/submitButton/submitButton';
import FloatingClock from '@/components/FloatingClock';
import '@/auth/authLayout.css';
import Link from 'next/link';

const ResetPasswordPage = () => {
  const router = useRouter();
  const email = useInput('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Reset password request for:', email.value);
      
      alert('Password reset link has been sent to your email!');
      
      // Redirect to new password page (in real app, user would click email link)
      router.push('/auth/reset-password/new-password');
    } catch (error) {
      console.error('Reset password error:', error);
      alert('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        welcomeMessage="Forgot Password?"
        title="Reset Your Password"
        subtitle="Enter your email address and we'll send you a reset link"
      >
      <form onSubmit={handleSubmit} className="login-form">
        <p className="verify-instruction" style={{ textAlign: 'center', marginBottom: '1rem', color: '#718096' }}>
          Don't worry! It happens. Please enter the email address associated with your account.
        </p>

        {/* Email Input */}
        <FormInput
          label="Email Address"
          type="email"
          value={email.value}
          onChange={email.handleChange}
          onFocus={email.handleFocus}
          onBlur={email.handleBlur}
          isFocused={email.isFocused}
          required={true}
          autoComplete="email"
        />

        {/* Submit Button */}
        <SubmitButton loading={isLoading}>
          Send Reset Link
        </SubmitButton>

        {/* Back to Login Link */}
        <div className="signup-section">
          <p className="signup-text">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="signup-link"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
    <FloatingClock />
    </>
  );
};

export default ResetPasswordPage;

