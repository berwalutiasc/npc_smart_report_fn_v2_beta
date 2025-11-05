/**
 * STUDENT SETTINGS PAGE
 * 
 * This page allows students to configure their account and preferences.
 * 
 * LOCATION: /student/settings
 * 
 * FEATURES:
 * - Theme selection (Light, Dark, System)
 * - Notification preferences
 * - Language selection
 * - Quick links to common actions
 * - System settings
 * - Save preferences
 */

"use client";

import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Palette, 
  Bell, 
  Globe, 
  Monitor,
  Sun,
  Moon,
  LogOut,
  Lock,
  User,
  Mail,
  Shield,
  Download,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react';
import LogoutConfirmation from '@/components/LogoutConfirmation';
import { useLogout } from '@/hooks/useLogout';
import './settings.css';

// TYPES
interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reportReminders: boolean;
  weeklyDigest: boolean;
}

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    reportReminders: true,
    weeklyDigest: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { logout, isLoggingOut } = useLogout();
  
  // Sync settings with theme context
  useEffect(() => {
    setSettings(prev => ({ ...prev, theme }));
  }, [theme]);

  // Handle logout confirm
  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutPopup(false);
  };

  // Quick links data
  const quickLinks = [
    { 
      title: 'My Profile', 
      description: 'View and edit your profile information',
      href: '/student/profile', 
      icon: <User size={20} />, 
      color: '#3b82f6' 
    },
    { 
      title: 'Change Password', 
      description: 'Update your account password',
      href: '/student/profile#security', 
      icon: <Lock size={20} />, 
      color: '#8b5cf6' 
    },
    { 
      title: 'Logout', 
      description: 'Sign out of your account',
      href: '#logout', 
      icon: <LogOut size={20} />, 
      color: '#ef4444',
      onClick: () => {
        setShowLogoutPopup(true);
      }
    }
  ];

  // System actions
  const systemActions = [
    {
      title: 'Download My Data',
      description: 'Export all your data in JSON format',
      icon: <Download size={20} />,
      color: '#10b981',
      action: () => alert('Data export started...')
    },
    {
      title: 'Clear Cache',
      description: 'Clear temporary files and cache',
      icon: <Trash2 size={20} />,
      color: '#f59e0b',
      action: () => {
        if (confirm('Are you sure you want to clear cache?')) {
          alert('Cache cleared successfully!');
        }
      }
    }
  ];

  // Handle setting change
  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    if (key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
    setSettings({ ...settings, [key]: value });
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Get theme icon
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      case 'system':
        return <Monitor size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  return (
    <StudentLayout>
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1a202c',
          margin: 0 
        }}>
          Settings
        </h1>
        <p style={{ 
          color: '#718096', 
          marginTop: '0.5rem',
          fontSize: '0.95rem' 
        }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <div className="success-message slide-down">
          <CheckCircle size={20} />
          Settings saved successfully!
        </div>
      )}

      <div className="settings-container">
        {/* LEFT COLUMN - Settings */}
        <div className="settings-left">
          {/* APPEARANCE SETTINGS */}
          <div className="settings-card fade-in">
            <div className="settings-card-header">
              <Palette size={20} />
              <h3>Appearance</h3>
            </div>
            <div className="settings-card-body">
              {/* Theme Selection */}
              <div className="setting-group">
                <label className="setting-label">Theme</label>
                <p className="setting-description">Choose your preferred color theme</p>
                <div className="theme-options">
                  {(['light', 'dark', 'system'] as const).map((theme) => (
                    <button
                      key={theme}
                      className={`theme-option ${settings.theme === theme ? 'active' : ''}`}
                      onClick={() => handleSettingChange('theme', theme)}
                    >
                      {getThemeIcon(theme)}
                      <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NOTIFICATION SETTINGS */}
          <div className="settings-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="settings-card-header">
              <Bell size={20} />
              <h3>Notifications</h3>
            </div>
            <div className="settings-card-body">
              {/* Email Notifications */}
              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Mail size={16} />
                    Email Notifications
                  </div>
                  <p className="setting-item-description">Receive email updates about your reports</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Bell size={16} />
                    Push Notifications
                  </div>
                  <p className="setting-item-description">Get real-time push notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Report Reminders */}
              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Shield size={16} />
                    Report Reminders
                  </div>
                  <p className="setting-item-description">Get reminded about pending reports</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.reportReminders}
                    onChange={(e) => handleSettingChange('reportReminders', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Weekly Digest */}
              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Mail size={16} />
                    Weekly Digest
                  </div>
                  <p className="setting-item-description">Receive weekly summary emails</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.weeklyDigest}
                    onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* LANGUAGE SETTINGS */}
          <div className="settings-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="settings-card-header">
              <Globe size={20} />
              <h3>Language & Region</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-group">
                <label className="setting-label">Language</label>
                <p className="setting-description">Select your preferred language</p>
                <select
                  className="setting-select"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            className="btn-save-settings fade-in"
            style={{ animationDelay: '0.3s' }}
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* RIGHT COLUMN - Quick Links & Actions */}
        <div className="settings-right">
          {/* QUICK LINKS */}
          <div className="settings-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="settings-card-header">
              <User size={20} />
              <h3>Quick Links</h3>
            </div>
            <div className="settings-card-body">
              <div className="quick-links-list">
                {quickLinks.map((link, index) => (
                  link.onClick ? (
                    <button
                      key={index}
                      className="quick-link-item"
                      onClick={link.onClick}
                    >
                      <div className="quick-link-icon" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                        {link.icon}
                      </div>
                      <div className="quick-link-content">
                        <div className="quick-link-title">{link.title}</div>
                        <div className="quick-link-description">{link.description}</div>
                      </div>
                    </button>
                  ) : (
                    <Link
                      key={index}
                      href={link.href}
                      className="quick-link-item"
                    >
                      <div className="quick-link-icon" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                        {link.icon}
                      </div>
                      <div className="quick-link-content">
                        <div className="quick-link-title">{link.title}</div>
                        <div className="quick-link-description">{link.description}</div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* SYSTEM ACTIONS */}
          <div className="settings-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="settings-card-header">
              <Monitor size={20} />
              <h3>System</h3>
            </div>
            <div className="settings-card-body">
              <div className="system-actions-list">
                {systemActions.map((action, index) => (
                  <button
                    key={index}
                    className="system-action-item"
                    onClick={action.action}
                  >
                    <div className="system-action-icon" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                      {action.icon}
                    </div>
                    <div className="system-action-content">
                      <div className="system-action-title">{action.title}</div>
                      <div className="system-action-description">{action.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION POPUP */}
      <LogoutConfirmation
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </StudentLayout>
  );
};

export default SettingsPage;

