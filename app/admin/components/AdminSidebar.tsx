/**
 * ADMIN SIDEBAR NAVIGATION COMPONENT
 * 
 * Responsive sidebar navigation for the admin dashboard area.
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

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  User,
  FileText,
  Calendar,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderOpen
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
interface AdminSidebarProps {
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
 * This array defines all the menu items in the admin sidebar.
 */
const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: "Today's Reports",
    href: '/admin/today-reports',
    icon: Clock,
  },
  {
    label: 'All Reports',
    href: '/admin/all-reports',
    icon: FolderOpen,
  },
  {
    label: 'Weekly Report',
    href: '/admin/weekly-report',
    icon: Calendar,
  },
  {
    label: 'Organized Reports',
    href: '/admin/organized-reports',
    icon: FolderOpen,
  },
  {
    label: 'Representatives',
    href: '/admin/representatives',
    icon: Users,
  },
  {
    label: 'Classes',
    href: '/admin/classes',
    icon: GraduationCap,
  },
  {
    label: 'Items',
    href: '/admin/items',
    icon: FileText,
  },
  {
    label: 'Profile',
    href: '/admin/profile',
    icon: User,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

/**
 * ADMIN SIDEBAR COMPONENT
 */
const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
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
  const [adminName, setAdminName] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    setAdminName(localStorage.getItem('adminName'));
    setAdminEmail(localStorage.getItem('adminEmail'));
    setRole(localStorage.getItem('role'));
  }, []);

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
                <div className="logo-icon">🔐</div>
                <span className="logo-text">NPC Admin</span>
              </>
            )}
            {/* Show just icon when collapsed */}
            {isCollapsed && (
              <div className="logo-icon">🔐</div>
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
          - Shows admin avatar and info
          - Collapses to just avatar when sidebar is collapsed
        */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <img 
              src="/assets/logo.png" 
              alt="Admin" 
              className="avatar-img"
            />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <p className="user-name">{adminName}</p>
              <p className="user-role">{role}</p>
              <p className="user-email text-xs">{adminEmail}</p>
            </div>
          )}
        </div>

        {/* 
          NAVIGATION MENU
          - Renders all navigation items from the array above
          - Highlights active page
          - Shows icons only when collapsed
        */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => {
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

export default AdminSidebar;

