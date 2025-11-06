"use client";

import React, { useState, useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import AuthLayout from '../login/authLayout';
import SubmitButton from '@/components/submitButton/submitButton';
import FloatingClock from '@/components/FloatingClock';
import '@/auth/authLayout.css';
import './verify.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/lib/toast-utils';

const VerifyPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    // Only allow digits
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus the last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toastError({ title: 'Invalid Code', description: 'Please enter all 6 digits.' });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      
      //send data to the api
      const token = (() => { try { return localStorage.getItem('loginToken') || undefined; } catch { return undefined; } })();
      const response = await fetch('https://npc-smart-report-bn-v2-beta.onrender.com/api/auth/verifyLoginOtp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ otp: otpValue, ...(token ? { token } : {}) }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toastSuccess({
          title: 'Verification Successful',
          description: 'Redirecting to Dashboard...',
        });

        //chosing directory
        //getting the role sent from json response in api
        let directory = '';
        const role = data.user.role;
        if (role === 'STUDENT') {
          directory = '/student/dashboard';
        }else {
          directory = '/admin/dashboard';
        }


        //save the role to local storage

        if (role === 'STUDENT') {   //student
        localStorage.setItem('role', role);
          localStorage.setItem('studentName', data.user.name);
          localStorage.setItem('studentEmail', data.user.email);
          localStorage.setItem('studentRole', data.user.studentRole);
        }else {
          //admin
          localStorage.setItem('role', role);
          localStorage.setItem('adminName', data.user.name);
          localStorage.setItem('adminEmail', data.user.email);
        }
        

        //wait 2 seconds before redirecting to let user see the toast
        setTimeout(() => {
          router.push(`https://npc-smart-report-fn-v2-beta-bozj.vercel.app/${directory}`);
        }, 3000);
      } else {
        toastError({
          title: 'Verification Failed',
          description: data.message || 'Please check your OTP and try again.',
        })
      }
    } catch (error) {
      toastError({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = () => {
    console.log('Resending OTP...');
    toastSuccess({ title: 'OTP Sent', description: 'A new OTP has been sent to your email/phone.' });
    setOtp(Array(6).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <>
      <AuthLayout
        welcomeMessage="Verify Your Account"
        title="Enter Verification Code"
        subtitle="We've sent a 6-digit code to your email/phone"
      >
      <form onSubmit={handleSubmit} className="verify-form">
        <p className="verify-instruction">
          Please enter the 6-digit verification code below
        </p>

        {/* OTP Input Fields */}
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="otp-input"
              autoFocus={index === 0}
              required
            />
          ))}
        </div>

        {/* Resend Code */}
        <div className="resend-section">
          <p className="resend-text">
            Didn't receive the code?{' '}
            <button
              type="button"
              className="resend-link"
              onClick={handleResend}
            >
              Resend Code
            </button>
          </p>
        </div>

        {/* Submit Button */}
        <SubmitButton loading={isLoading}>
          Verify
        </SubmitButton>

        {/* Back to Login Link */}
        <div className="signup-section">
          <p className="signup-text">
            <Link
              href="/auth/login"
              className="signup-link"
            >
              ← Back to Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
    <FloatingClock />
    </>
  );
};

export default VerifyPage;

