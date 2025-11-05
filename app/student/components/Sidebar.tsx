/**
 * SIDEBAR NAVIGATION COMPONENT
 * 
 * Responsive sidebar navigation for the student dashboard area.
 * 
 * FEATURES:
 * - Collapsible design (icon-only or full width)
 * - Mobile overlay mode
 * - Active link highlighting
 * - Smooth transitions
 * - User profile section
 * - Logout functionality
 * 
 * RESPONSIVE BEHAVIOR:
 * - Desktop: Side-by-side with content, can collapse to icons only
 * - Mobile: Slides in as overlay from left, full menu with text
 */

"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  User,
  Bell,
  FileText,
  Eye,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import LogoutConfirmation from '@/components/LogoutConfirmation';
import { useLogout } from '@/hooks/useLogout';
import './sidebar.css';

/**
 * PROPS INTERFACE
 * @property {boolean} isOpen - Controls sidebar visibility on mobile
 * @property {boolean} isCollapsed - Controls collapsed state on desktop
 * @property {function} onToggle - Callback to toggle mobile sidebar
 * @property {function} onCollapse - Callback to toggle desktop collapse
 * @property {function} onClose - Callback to close sidebar
 */
interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onCollapse: () => void;
  onClose: () => void;
}

/**
 * NAVIGATION ITEM INTERFACE
 * Defines the structure of each menu item
 * 
 * @property {string} label - Display text for the menu item
 * @property {string} href - URL path to navigate to
 * @property {React.ComponentType} icon - Lucide icon component
 * @property {string[]} [allowedRoles] - Optional array of roles that can access this item
 * @property {string[]} [hiddenRoles] - Optional array of roles that should hide this item
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: string[];
  hiddenRoles?: string[];
}

/**
 * NAVIGATION MENU ITEMS
 * 
 * This array defines all the menu items in the sidebar.
 * 
 * TO ADD A NEW PAGE:
 * 1. Add a new object to this array
 * 2. Specify label, href, and icon
 * 3. Create the corresponding page in app/student/[your-page]/page.tsx
 * 
 * AVAILABLE ICONS:
 * Import from 'lucide-react' - https://lucide.dev/icons/
 */
const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/student/dashboard',
    icon: LayoutDashboard,
    // All roles can access dashboard
  },
  {
    label: 'Submit',
    href: '/student/submit',
    icon: FileText,
    // hiddenRoles: ['CP', 'CS', 'CC']
  },
  {
    label: 'Report',
    href: '/student/report',
    icon: FileText,
  },
  // {
  //   label: 'Review',
  //   href: '/student/review',
  //   icon: Eye,
  //   // hiddenRoles: ['CC','WS']
  // },
  // {
  //   label: 'Reminder',
  //   href: '/student/reminder',
  //   icon: Bell,
  //   // hiddenRoles: ['CP','CS','CC']
  // },
  {
    label: 'Profile',
    href: '/student/profile',
    icon: User,
    // All roles can access profile
  },
  {
    label: 'Settings',
    href: '/student/settings',
    icon: Settings,
  },
];

/**
 * ROLE-BASED FILTERING LOGIC
 * 
 * @param role - The user's role from localStorage
 * @param items - Array of navigation items to filter
 * @returns Filtered array of navigation items based on role permissions
 */
const filterNavigationItemsByRole = (studentRole: string | null, items: NavItem[]): NavItem[] => {
  if (!studentRole) {
    // If no role is set, return only items without restrictions
    return items.filter(item => !item.allowedRoles && !item.hiddenRoles);
  }

  return items.filter(item => {
    // If item has allowedRoles, check if user's role is included
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      return item.allowedRoles.includes(studentRole);
    }
    
    // If item has hiddenRoles, check if user's role is NOT included
    if (item.hiddenRoles && item.hiddenRoles.length > 0) {
      return !item.hiddenRoles.includes(studentRole);
    }
    
    // If no restrictions, show the item
    return true;
  });
};

/**
 * SIDEBAR COMPONENT
 */
const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isCollapsed, 
  onToggle, 
  onCollapse,
  onClose 
}) => {
  // Get current pathname to highlight active link
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { logout, isLoggingOut } = useLogout();
  const [role, setRole] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [studentRole, setStudentRole] = useState<string | null>(null);

  useEffect(() => {
    // Runs only in the browser
    setRole(localStorage.getItem("role"));
    setStudentName(localStorage.getItem("studentName"));
    setStudentEmail(localStorage.getItem("studentEmail"));
  }, []);

  /**
   * FILTERED NAVIGATION ITEMS
   * 
   * Uses useMemo to avoid recalculating on every render
   * Only recalculates when the role changes
   */
  const filteredNavigationItems = useMemo(() => {
    return filterNavigationItemsByRole(studentRole, navigationItems);
  }, [studentRole]);

  /**
   * HANDLE LOGOUT CLICK
   * 
   * Shows the logout confirmation popup
   */
  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  /**
   * HANDLE LOGOUT CONFIRM
   * 
   * Called when user confirms logout in the popup
   */
  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutPopup(false);
  };

  /**
   * HANDLE LINK CLICK
   * Closes sidebar on mobile when a link is clicked
   */
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* 
        SIDEBAR CONTAINER
        
        CLASSES:
        - sidebar: Base styles
        - open: Applied on mobile when sidebar should be visible
        - collapsed: Applied on desktop when sidebar should show icons only
        
        CSS controls the width and visibility based on these classes
      */}
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {/* 
          SIDEBAR HEADER
          - Shows logo and app name
          - Contains collapse button for desktop
        */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {/* Logo/Icon - only shown when not collapsed */}
            {!isCollapsed && (
              <>
                <div className="logo-icon">📊</div>
                <span className="logo-text">NPC Student </span>
              </>
            )}
            {/* Show just icon when collapsed */}
            {isCollapsed && (
              <div className="logo-icon">📊</div>
            )}
          </div>
          
          {/* 
            COLLAPSE BUTTON (Desktop Only)
            - Toggles between expanded and collapsed states
            - Shows chevron icon indicating direction
            - Hidden on mobile devices
          */}
          <button 
            className="collapse-toggle desktop-only"
            onClick={onCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* 
          USER PROFILE SECTION
          - Shows user avatar and info
          - Collapses to just avatar when sidebar is collapsed
        */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <img 
              src="/assets/logo.png" 
              alt="User" 
              className="avatar-img"
            />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <p className="user-name">{studentName}</p>
              <p className="user-role">{role}</p>
              <p className="user-email">{studentEmail}</p>
            </div>
          )}
        </div>

        {/* 
          NAVIGATION MENU
          - Renders filtered navigation items based on role
          - Highlights active page
          - Shows icons only when collapsed
        */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {filteredNavigationItems.map((item) => {
              // Check if this link is currently active
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href} className="nav-item">
                  <Link 
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    {/* Icon - always visible */}
                    <Icon className="nav-icon" />
                    
                    {/* Label - hidden when collapsed */}
                    {!isCollapsed && (
                      <span className="nav-label">{item.label}</span>
                    )}

                    {/* Active indicator - shows on active page */}
                    {isActive && <div className="active-indicator" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 
          SIDEBAR FOOTER
          - Contains logout button
          - Always at the bottom
        */}
        <div className="sidebar-footer">
          <button 
            className="logout-button"
            onClick={handleLogoutClick}
          >
            <LogOut className="nav-icon" />
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* LOGOUT CONFIRMATION POPUP */}
      <LogoutConfirmation
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Sidebar;