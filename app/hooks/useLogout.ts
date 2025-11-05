/**
 * CUSTOM HOOK: useLogout
 * 
 * Handles logout functionality including API call and navigation.
 * 
 * USAGE:
 * ```tsx
 * const { logout, isLoggingOut } = useLogout();
 * 
 * // Then call logout() when user confirms
 * logout();
 * ```
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

export const useLogout = (): UseLogoutReturn => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call logout API
      const response = await fetch('http://localhost:5000/api/auth/logoutUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session management
      });

      // Clear any local storage or cookies if needed
      // (Adjust based on your auth implementation)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
        // Add any other cleanup needed
      }

      
      window.location.href = '/auth/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still proceed with logout even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
      
      router.push('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut
  };
};

