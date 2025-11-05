"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const FloatingClock = () => {
  const [time, setTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 animate-float transition-all duration-700 ease-in-out ${
        isExpanded ? 'translate-x-[calc(-100vw+100%+3rem)]' : ''
      }`}
      onMouseEnter={() => setIsExpanded(true)}
    >
      <div className="bg-card border-2 border-primary rounded-2xl shadow-strong p-4 min-w-[160px] backdrop-blur-sm bg-card/95">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground" suppressHydrationWarning>
            {formatDate(time)}
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground font-mono" suppressHydrationWarning>
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default FloatingClock;
