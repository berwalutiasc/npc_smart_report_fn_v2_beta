"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '../../login/authLayout';
import SubmitButton from '@/components/submitButton/submitButton';
import FloatingClock from '@/components/FloatingClock';
import '@/auth/authLayout.css';
import './verify-email.css';
import { toastSuccess, toastError } from '@/lib/toast-utils';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

const EmailVerifyPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isRetrying, setIsRetrying] = useState(false);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verifySignupLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setVerificationStatus('success');
        toastSuccess({
          title: 'Email Verified',
          description: 'Your email has been successfully verified!',
        });
      } else {
        setVerificationStatus('error');
        toastError({
          title: 'Verification Failed',
          description: data.error || 'There was a problem verifying your email. Please try again.',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      toastError({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your connection and try again.',
      });
    }
  };

  useEffect(() => {
    // Verify email on component mount
    verifyEmail();
  }, []);

  const handleTryAgain = () => {
    setIsRetrying(true);
    setVerificationStatus('loading');
    verifyEmail().finally(() => {
      setIsRetrying(false);
    });
  };

  const handleGoToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <AuthLayout
        welcomeMessage="Email Verification"
        title="Verify Your Email"
        subtitle="We're verifying your email address"
      >
        <div className="verify-email-content">
          {verificationStatus === 'loading' && (
            <div className="verify-status verify-loading">
              <div className="verify-icon-wrapper loading">
                <Loader2 className="verify-icon spinning" />
              </div>
              <h3 className="verify-title">Verifying Your Email</h3>
              <p className="verify-description">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="verify-status verify-success">
              <div className="verify-icon-wrapper success">
                <CheckCircle2 className="verify-icon" />
              </div>
              <h3 className="verify-title">Email Verified Successfully!</h3>
              <p className="verify-description">
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <div className="verify-actions">
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleGoToLogin}
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="verify-status verify-error">
              <div className="verify-icon-wrapper error">
                <XCircle className="verify-icon" />
              </div>
              <h3 className="verify-title">Verification Failed</h3>
              <p className="verify-description">
                There was a problem verifying your email. This could be due to an expired or invalid verification link.
              </p>
              <div className="verify-actions">
                <button
                  type="button"
                  className="btn-try-again"
                  onClick={handleTryAgain}
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="spinning" />
                      Trying Again...
                    </>
                  ) : (
                    <>
                      <Mail />
                      Try Again
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleGoToLogin}
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </AuthLayout>
      <FloatingClock />
    </>
  );
};

const EmailVerifyPage = () => {
  return (
    <Suspense fallback={
      <>
        <AuthLayout
          welcomeMessage="Email Verification"
          title="Verify Your Email"
          subtitle="Loading verification page..."
        >
          <div className="verify-email-content">
            <div className="verify-status verify-loading">
              <div className="verify-icon-wrapper loading">
                <Loader2 className="verify-icon spinning" />
              </div>
              <h3 className="verify-title">Loading...</h3>
              <p className="verify-description">
                Please wait while we load the verification page...
              </p>
            </div>
          </div>
        </AuthLayout>
        <FloatingClock />
      </>
    }>
      <EmailVerifyPageContent />
    </Suspense>
  );
};

export default EmailVerifyPage;

