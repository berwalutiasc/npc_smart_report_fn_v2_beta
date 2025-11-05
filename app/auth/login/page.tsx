"use client";

import React, { useState } from 'react';
import { useInput } from '@/hooks/useInput';
import AuthLayout from './authLayout';
import FormInput from '@/components/formInput/formInput';
import PasswordToggle from '@/components/PasswordToggle/passwordToggle';
import SubmitButton from '@/components/submitButton/submitButton';
import FloatingClock from '@/components/FloatingClock';
import '@/auth/authLayout.css';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toastSuccess, toastError, toastWarning } from '@/lib/toast-utils';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state management
  const email = useInput('');
  const password = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form validation
    if (!email.value.trim()) {
      toastError({
        title: 'Validation Error',
        description: 'Please enter your email address',
      });
      return;
    }

    if (!email.value.includes('@') || !email.value.includes('.')) {
      toastError({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
      });
      return;
    }

    if (!password.value.trim()) {
      toastError({
        title: 'Validation Error',
        description: 'Please enter your password',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Send data to the API
      const response = await fetch('http://localhost:5000/api/auth/loginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ 
          email: email.value, 
          password: password.value, 
          rememberMe 
        }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok) {
        toastSuccess({
          title: 'Login Successful',
          description: 'Redirecting to Verificaton Page...',
        });
        
        // Get the intended destination or default to dashboard
        const from = '/auth/verify';
        
        // Wait a moment for the toast to show, then hard redirect
        setTimeout(() => {
          console.log('Redirecting to:', from);
          // Use hard redirect to ensure middleware runs with fresh cookies
          window.location.href = from;
        }, 3000);
        
      } else {
        toastError({
          title: 'Login Failed',
          description: data.error || 'Please check your credentials and try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toastError({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // // Add debug function to check auth status (remove in production)
  // const checkAuthStatus = async () => {
  //   try {
  //     console.log('🔍 Checking auth status...');
  //     const response = await fetch('http://localhost:5000/api/auth/check', {
  //       credentials: 'include'
  //     });
  //     const data = await response.json();
  //     console.log('Auth status:', data);
      
  //     toastSuccess({
  //       title: 'Auth Status',
  //       description: `Authenticated: ${data.authenticated ? 'Yes' : 'No'}`,
  //     });
  //   } catch (error) {
  //     console.error('Auth check error:', error);
  //   }
  // };

  return (
    <>
      <AuthLayout
        welcomeMessage="Welcome Back!"
        title="Sign In to Your Account"
        subtitle="Enter your credentials to access the system"
      >
        <form onSubmit={handleSubmit} className="login-form">
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

          {/* Password Input */}
          <FormInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password.value}
            onChange={password.handleChange}
            onFocus={password.handleFocus}
            onBlur={password.handleBlur}
            isFocused={password.isFocused}
            required={true}
            autoComplete="current-password"
          />

          {/* Password Toggle */}
          <PasswordToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            
            <Link
              href="/auth/reset-password"
              className="forgot-password-link"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <SubmitButton loading={isLoading}>
            Sign In
          </SubmitButton>

          {/* Sign Up Link */}
          <div className="signup-section">
            <p className="signup-text">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="signup-link"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </form>
      </AuthLayout>
      <FloatingClock />
    </>
  );
};

export default LoginPage;