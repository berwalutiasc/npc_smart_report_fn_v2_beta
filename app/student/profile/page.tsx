/**
 * STUDENT PROFILE PAGE
 * 
 * This page allows students to view and edit their profile information.
 * 
 * LOCATION: /student/profile
 * 
 * FEATURES:
 * - Profile card with photo and basic info
 * - Edit personal information (name, email, phone, class)
 * - Change password section
 * - Account actions (logout)
 * - Student statistics
 * - Smooth animations
 * - API integration with localhost:5000
 */

"use client";

import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
  Lock,
  LogOut,
  Camera,
  Award,
  BookOpen,
  FileText,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';
import LogoutConfirmation from '@/components/LogoutConfirmation';
import { useLogout } from '@/hooks/useLogout';
import './profile.css';

// TYPES
interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  class: string;
  department: string;
  enrollmentDate: string;
  address: string;
  dateOfBirth: string;
  studentRole: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [editData, setEditData] = useState<StudentData | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [stats, setStats] = useState<StatItem[]>([]);
  const { logout, isLoggingOut } = useLogout();

  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  useEffect(() => {
    setStudentEmail(localStorage.getItem('studentEmail'));
  }, []);
  // Get current user ID - Replace with your actual auth context


  // Fetch student profile from API
  const fetchStudentProfile = async () => {
    setIsLoading(true);
    try {
      const userId = studentEmail;
      const response = await fetch(`http://localhost:5000/api/student/dashboard/getProfile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      // const response = await fetch(`http://localhost:5000/api/student/dashboard/maserati?email=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStudentData(result.data);
        setEditData(result.data);
        
        // Transform statistics for frontend display
        const transformedStats = result.data.statistics.map((stat: StatItem) => ({
          ...stat,
          icon: getIconComponent(stat.icon)
        }));
        setStats(transformedStats);
      } else {
        console.error('Failed to fetch profile:', result.message);
        // Fallback to empty state or show error
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      // You can set a fallback state here if needed
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconProps = { size: 20 };
    switch (iconName) {
      case 'FileText':
        return <FileText {...iconProps} />;
      case 'CheckCircle':
        return <CheckCircle {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      case 'Award':
        return <Award {...iconProps} />;
      case 'BookOpen':
        return <BookOpen {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStudentProfile();
  }, []);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      setEditData(studentData); // Reset to original data
    }
    setIsEditing(!isEditing);
  };

  // Handle input changes
  const handleInputChange = (field: keyof StudentData, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  // Handle password input changes
  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  // Save profile changes
  const handleSave = async () => {
    if (!editData) return;
    
    setIsSaving(true);
    
    try {
      const userId = studentEmail;
      const response = await fetch('http://localhost:5000/api/student/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          updates: {
            name: `${editData.firstName} ${editData.lastName}`,
            email: editData.email,
            phone: editData.phone,
            address: editData.address,
            // Add other fields as needed
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      
      if (result.success) {
        setStudentData(editData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    setIsSaving(true);
    
    try {
      const userId = studentEmail;
      const response = await fetch('http://localhost:5000/api/student/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
      } else {
        alert('Failed to change password: ' + result.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout click
  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  // Handle logout confirm
  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutPopup(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <StudentLayout>
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#1a202c',
            margin: 0 
          }}>
            My Profile
          </h1>
          <p style={{ 
            color: '#718096', 
            marginTop: '0.5rem',
            fontSize: '0.95rem' 
          }}>
            Loading your profile...
          </p>
        </div>
        
        <div className="profile-container">
          {/* Loading skeletons */}
          <div className="profile-left">
            <div className="profile-card skeleton-card">
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          </div>
          <div className="profile-right">
            <div className="info-card skeleton-card">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // Error state - no data loaded
  if (!studentData) {
    return (
      <StudentLayout>
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#1a202c',
            margin: 0 
          }}>
            My Profile
          </h1>
        </div>
        
        <div className="error-state">
          <User size={64} />
          <h3>Unable to load profile</h3>
          <p>There was an error loading your profile information.</p>
          <button onClick={fetchStudentProfile} className="btn-retry">
            Try Again
          </button>
        </div>
      </StudentLayout>
    );
  }

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
          My Profile
        </h1>
        <p style={{ 
          color: '#718096', 
          marginTop: '0.5rem',
          fontSize: '0.95rem' 
        }}>
          Manage your personal information and preferences
        </p>
      </div>

      {/* PROFILE CONTENT */}
      <div className="profile-container">
        {/* LEFT COLUMN - Profile Card */}
        <div className="profile-left">
          {/* PROFILE CARD */}
          <div className="profile-card fade-in">
            <div className="profile-header">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  <User size={48} />
                </div>
                <button className="avatar-upload-btn">
                  <Camera size={16} />
                </button>
              </div>
              <div className="profile-header-info">
                <h2 className="profile-name">{studentData.firstName} {studentData.lastName}</h2>
                <p className="profile-id">{studentData.studentId}</p>
                <p className="profile-department">{studentData.department}</p>
                <p className="profile-role">Role: {studentData.studentRole}</p>
              </div>
            </div>

            <div className="profile-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="profile-actions">
              <button className="btn-logout" onClick={handleLogoutClick}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Information & Settings */}
        <div className="profile-right">
          {/* PERSONAL INFORMATION */}
          <div className="info-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="info-card-header">
              <h3 className="info-card-title">Personal Information</h3>
              {!isEditing ? (
                <button className="btn-edit" onClick={handleEditToggle}>
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn-cancel" onClick={handleEditToggle}>
                    <X size={16} />
                    Cancel
                  </button>
                  <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                    <Save size={16} />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className="info-grid">
              {/* First Name */}
              <div className="info-field">
                <label className="info-label">
                  <User size={16} />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editData?.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{studentData.firstName}</div>
                )}
              </div>

              {/* Last Name */}
              <div className="info-field">
                <label className="info-label">
                  <User size={16} />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editData?.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{studentData.lastName}</div>
                )}
              </div>

              {/* Email */}
              <div className="info-field">
                <label className="info-label">
                  <Mail size={16} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className="info-input"
                    value={editData?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{studentData.email}</div>
                )}
              </div>

              {/* Phone */}
              <div className="info-field">
                <label className="info-label">
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="info-input"
                    value={editData?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{studentData.phone}</div>
                )}
              </div>

              {/* Class */}
              <div className="info-field">
                <label className="info-label">
                  <GraduationCap size={16} />
                  Class
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editData?.class || ''}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    placeholder="Enter your class"
                  />
                ) : (
                  <div className="info-value">{studentData.class}</div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="info-field">
                <label className="info-label">
                  <Calendar size={16} />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    className="info-input"
                    value={editData?.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <div className="info-value">
                    {new Date(studentData.dateOfBirth).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                )}
              </div>

              {/* Enrollment Date */}
              <div className="info-field">
                <label className="info-label">
                  <Calendar size={16} />
                  Enrollment Date
                </label>
                <div className="info-value info-value-readonly">{studentData.enrollmentDate}</div>
              </div>

              {/* Student ID */}
              <div className="info-field">
                <label className="info-label">
                  <Award size={16} />
                  Student ID
                </label>
                <div className="info-value info-value-readonly">{studentData.studentId}</div>
              </div>

              {/* Address */}
              <div className="info-field info-field-full">
                <label className="info-label">
                  <MapPin size={16} />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    className="info-input info-textarea"
                    value={editData?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="info-value">{studentData.address}</div>
                )}
              </div>
            </div>
          </div>

          {/* SECURITY SETTINGS */}
          <div className="info-card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="info-card-header">
              <h3 className="info-card-title">
                <Lock size={20} />
                Security Settings
              </h3>
            </div>

            {!isChangingPassword ? (
              <div className="security-content">
                <p className="security-description">
                  Keep your account secure by regularly updating your password.
                </p>
                <button className="btn-change-password" onClick={() => setIsChangingPassword(true)}>
                  <Lock size={16} />
                  Change Password
                </button>
              </div>
            ) : (
              <div className="password-form">
                <div className="info-field">
                  <label className="info-label">Current Password</label>
                  <input
                    type="password"
                    className="info-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="info-field">
                  <label className="info-label">New Password</label>
                  <input
                    type="password"
                    className="info-input"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>

                <div className="info-field">
                  <label className="info-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="info-input"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="password-actions">
                  <button 
                    className="btn-cancel" 
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-save" 
                    onClick={handlePasswordSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
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

export default ProfilePage;