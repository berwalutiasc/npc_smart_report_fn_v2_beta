"use client";

import { useState } from 'react';

export const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const reset = () => {
    setValue('');
    setIsFocused(false);
  };

  return {
    value,
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
    reset,
    setValue
  };
};
