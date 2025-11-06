"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInput } from '@/hooks/useInput';
import AuthLayout from '../login/authLayout';
import FormInput from '@/components/formInput/formInput';
import PasswordToggle from '@/components/PasswordToggle/passwordToggle';
import SubmitButton from '@/components/submitButton/submitButton';
import FloatingClock from '@/components/FloatingClock';
import '@/auth/authLayout.css';
import Link from 'next/link';
import { toastError, toastSuccess } from '@/lib/toast-utils';

const SignupPage = () => {
  const router = useRouter();
  
  // Form state management
  const name = useInput('');
  const email = useInput('');
  const phone = useInput('');
  const password = useInput('');
  const confirmPassword = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match!');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      
      const response = await fetch('https://npc-smart-report-bn-v2-beta.onrender.com/api/auth/createStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.value, email: email.value, phone: phone.value, password: password.value }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toastSuccess({
          title: 'Signup Successful',
          description: 'Check your email for verification and complete your registration...',
        });} else {
          toastError({
            title: 'Signup Failed',
            description: data.error || 'Please check your details and try again.',
          });
        }
       
    } catch (error) {
      console.error('Signup error:', error);
      toastError({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        welcomeMessage="Join Us Today!"
        title="Create Your Account"
        subtitle="Fill in your details to get started"
      >
      <form onSubmit={handleSubmit} className="login-form">
        {/* Full Name Input */}
        <FormInput
          label="Full Name"
          type="text"
          value={name.value}
          onChange={name.handleChange}
          onFocus={name.handleFocus}
          onBlur={name.handleBlur}
          isFocused={name.isFocused}
          required={true}
          autoComplete="name"
        />

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

        {/* Phone Input */}
        <FormInput
          label="Phone Number"
          type="tel"
          value={phone.value}
          onChange={phone.handleChange}
          onFocus={phone.handleFocus}
          onBlur={phone.handleBlur}
          isFocused={phone.isFocused}
          required={true}
          autoComplete="tel"
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
          autoComplete="new-password"
        />

        {/* Confirm Password Input */}
        <FormInput
          label="Confirm Password"
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

        {/* Terms and Conditions */}
        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            <span>I agree to the Terms and Conditions</span>
          </label>
        </div>

        {/* Submit Button */}
        <SubmitButton loading={isLoading}>
          Create Account
        </SubmitButton>

        {/* Login Link */}
        <div className="signup-section">
          <p className="signup-text">
            Already have an account?{' '}
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

export default SignupPage;

