/**
 * Toast Utility Functions
 * 
 * Simple wrapper functions for easy toast notifications
 */

import { toast } from "@/hooks/use-toast";

export type ToastVariant = "default" | "destructive" | "success" | "warning";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

/**
 * Show a success toast
 */
export const toastSuccess = ({ title = "Success", description, duration = 3000 }: ToastOptions = {}) => {
  return toast({
    variant: "success",
    title,
    description,
    duration,
  });
};

/**
 * Show an error toast
 */
export const toastError = ({ title = "Error", description, duration = 4000 }: ToastOptions = {}) => {
  return toast({
    variant: "destructive",
    title,
    description,
    duration,
  });
};

/**
 * Show a warning toast
 */
export const toastWarning = ({ title = "Warning", description, duration = 3500 }: ToastOptions = {}) => {
  return toast({
    variant: "warning",
    title,
    description,
    duration,
  });
};

/**
 * Show an info toast
 */
export const toastInfo = ({ title = "Info", description, duration = 3000 }: ToastOptions = {}) => {
  return toast({
    variant: "default",
    title,
    description,
    duration,
  });
};

/**
 * Show a simple message toast (success variant)
 */
export const toastMessage = (message: string, variant: ToastVariant = "default") => {
  const toastFunctions = {
    success: toastSuccess,
    destructive: toastError,
    warning: toastWarning,
    default: toastInfo,
  };

  return toastFunctions[variant]({ description: message });
};

