/**
 * ADMIN SETTINGS PAGE
 * 
 * This page allows admins to configure system and account settings.
 * 
 * LOCATION: /admin/settings
 * 
 * FEATURES:
 * - System configuration
 * - Theme selection
 * - Notification preferences
 * - Email settings
 * - Backup and maintenance
 * - Quick actions
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
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
  Database,
  Save,
  CheckCircle,
  Server,
  Settings as SettingsIcon
} from 'lucide-react';
import LogoutConfirmation from '@/components/LogoutConfirmation';
import { useLogout } from '@/hooks/useLogout';
import '../../student/settings/settings.css';

const AdminSettingsPage = () => {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    reportAlerts: true,
    weeklyReports: true,
    systemAlerts: true,
    autoBackup: true
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

  const quickLinks = [
    { 
      title: 'My Profile', 
      description: 'View and edit your admin profile',
      href: '/admin/profile', 
      icon: <User size={20} />, 
      color: '#3b82f6' 
    },
    { 
      title: 'Change Password', 
      description: 'Update your account password',
      href: '/admin/profile#security', 
      icon: <Lock size={20} />, 
      color: '#8b5cf6' 
    },
    { 
      title: 'Logout', 
      description: 'Sign out of admin panel',
      href: '#logout', 
      icon: <LogOut size={20} />, 
      color: '#ef4444',
      onClick: () => {
        setShowLogoutPopup(true);
      }
    }
  ];

  const systemActions = [
    {
      title: 'Backup Database',
      description: 'Create a backup of all system data',
      icon: <Database size={20} />,
      color: '#10b981',
      action: () => alert('Starting database backup...')
    },
    {
      title: 'Export Reports',
      description: 'Export all reports in CSV format',
      icon: <Download size={20} />,
      color: '#3b82f6',
      action: () => alert('Exporting reports...')
    },
    {
      title: 'System Status',
      description: 'Check system health and status',
      icon: <Server size={20} />,
      color: '#f59e0b',
      action: () => alert('System status: All services operational')
    },
    {
      title: 'Maintenance Mode',
      description: 'Enable/disable maintenance mode',
      icon: <SettingsIcon size={20} />,
      color: '#ef4444',
      action: () => {
        if (confirm('Are you sure you want to toggle maintenance mode?')) {
          alert('Maintenance mode toggled');
        }
      }
    }
  ];

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    if (key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

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
    <AdminLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
          Admin Settings
        </h1>
        <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Manage system configuration and your preferences
        </p>
      </div>

      {showSuccess && (
        <div className="success-message slide-down">
          <CheckCircle size={20} />
          Settings saved successfully!
        </div>
      )}

      <div className="settings-container">
        <div className="settings-left">
          {/* APPEARANCE */}
          <div className="settings-card fade-in">
            <div className="settings-card-header">
              <Palette size={20} />
              <h3>Appearance</h3>
            </div>
            <div className="settings-card-body">
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

          {/* NOTIFICATIONS */}
          <div className="settings-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="settings-card-header">
              <Bell size={20} />
              <h3>Notifications</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Mail size={16} />
                    Email Notifications
                  </div>
                  <p className="setting-item-description">Receive email updates about system events</p>
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

              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Bell size={16} />
                    Report Alerts
                  </div>
                  <p className="setting-item-description">Get notified about new reports</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.reportAlerts}
                    onChange={(e) => handleSettingChange('reportAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Shield size={16} />
                    System Alerts
                  </div>
                  <p className="setting-item-description">Critical system notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.systemAlerts}
                    onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Mail size={16} />
                    Weekly Reports
                  </div>
                  <p className="setting-item-description">Receive weekly summary emails</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* SYSTEM SETTINGS */}
          <div className="settings-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="settings-card-header">
              <Server size={20} />
              <h3>System Configuration</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-item">
                <div className="setting-item-info">
                  <div className="setting-item-title">
                    <Database size={16} />
                    Auto Backup
                  </div>
                  <p className="setting-item-description">Automatically backup data daily</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-group" style={{ marginTop: '1rem' }}>
                <label className="setting-label">Language</label>
                <p className="setting-description">Select system language</p>
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
              <SettingsIcon size={20} />
              <h3>System Actions</h3>
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
    </AdminLayout>
  );
};

export default AdminSettingsPage;

