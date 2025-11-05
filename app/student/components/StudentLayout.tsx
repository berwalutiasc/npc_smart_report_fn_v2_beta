/**
 * STUDENT LAYOUT COMPONENT
 * 
 * This is the main layout wrapper for all authenticated student pages.
 * It provides a consistent structure with a sidebar and content area.
 * 
 * STRUCTURE:
 * - Sidebar (left): Navigation menu that can collapse/expand
 * - Content Area (right): Where individual pages are rendered
 * 
 * USAGE:
 * Wrap any student page content with this layout component:
 * 
 * <StudentLayout>
 *   <YourPageContent />
 * </StudentLayout>
 * 
 * FEATURES:
 * - Responsive design (mobile-friendly)
 * - Sidebar toggles on mobile
 * - Sidebar can be collapsed on desktop for more space
 * - Floating clock included
 * - Smooth transitions
 */

"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FloatingClock from '@/components/FloatingClock';
import './studentLayout.css';

/**
 * PROPS INTERFACE
 * @property {React.ReactNode} children - The page content to render
 */
interface StudentLayoutProps {
  children: React.ReactNode;
}

/**
 * MAIN LAYOUT COMPONENT
 * 
 * STATE MANAGEMENT:
 * - isSidebarOpen: Controls sidebar visibility on mobile
 * - isSidebarCollapsed: Controls sidebar collapse state on desktop
 * 
 * RESPONSIVE BEHAVIOR:
 * - Mobile (< 768px): Sidebar is hidden by default, shows as overlay when toggled
 * - Desktop (>= 768px): Sidebar is always visible, can be collapsed to icon-only mode
 */
const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  // State for mobile sidebar toggle (open/closed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for desktop sidebar collapse (expanded/collapsed)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /**
   * TOGGLE SIDEBAR (Mobile)
   * Opens/closes sidebar on mobile devices
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * TOGGLE COLLAPSE (Desktop)
   * Collapses/expands sidebar on desktop devices
   * Collapsed = icons only, Expanded = icons + text
   */
  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  /**
   * CLOSE SIDEBAR (Mobile)
   * Closes sidebar when clicking outside or on a link
   */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="student-layout">
      {/* 
        OVERLAY (Mobile Only)
        - Appears when sidebar is open on mobile
        - Clicking it closes the sidebar
        - Darkens the background to focus on sidebar
      */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* 
        SIDEBAR COMPONENT
        Props:
        - isOpen: Controls visibility on mobile
        - isCollapsed: Controls collapsed state on desktop
        - onToggle: Function to toggle mobile sidebar
        - onCollapse: Function to toggle desktop collapse
        - onClose: Function to close sidebar (used when clicking links)
      */}
      <Sidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        onCollapse={toggleCollapse}
        onClose={closeSidebar}
      />

      {/* 
        MAIN CONTENT AREA
        - Adjusts its left margin based on sidebar state
        - On desktop: margin changes when sidebar is collapsed
        - On mobile: no margin, sidebar is overlay
        - Contains the page-specific content (children)
      */}
      <main className={`student-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* 
          MOBILE HEADER
          - Only visible on mobile devices
          - Contains hamburger menu button to open sidebar
          - Shows app title/logo
        */}
        <div className="mobile-header">
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="mobile-title">NPC Smart Report</h1>
        </div>

        {/* 
          PAGE CONTENT
          - This is where individual page components are rendered
          - Passed as children prop from parent pages
          - Examples: Dashboard, Profile, Reminder, etc.
        */}
        <div className="page-content">
          {children}
        </div>
      </main>

      {/* 
        FLOATING CLOCK
        - Same clock component used on landing page
        - Always visible in bottom-right corner
        - Shows current time and date
      */}
      <FloatingClock />
    </div>
  );
};

export default StudentLayout;

