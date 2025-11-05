/**
 * ADMIN CLASSES PAGE
 * 
 * This page manages all classes/departments.
 * 
 * LOCATION: /admin/classes
 * 
 * FEATURES:
 * - List of all classes
 * - View class details and statistics
 * - Filter and search
 * - Add/Edit/Remove classes
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  GraduationCap,
  Search,
  Plus,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  BookOpen,
  Calendar,
  UserCheck,
  X,
  Mail,
  Phone
} from 'lucide-react';

interface Class {
  id: string;
  name: string;
  description?: string;
  department: string;
  year: number;
  totalStudents: number;
  representatives: number;
  reportsThisWeek: number;
  room: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  studentList?: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    role?: string;
  }>;
  recentReports?: Array<{
    id: string;
    title: string;
    reporter: string;
    status: string;
    createdAt: string;
  }>;
}

interface ApiResponse {
  success: boolean;
  data: {
    classes: Class[];
    stats: {
      totalClasses: number;
      totalStudents: number;
      totalRepresentatives: number;
      reportsThisWeek: number;
    };
    filters: {
      search: string;
    };
  };
  message: string;
}

const ClassesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalRepresentatives: 0,
    reportsThisWeek: 0
  });
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');

  // Mock data for fallback
  const mockClasses: Class[] = [
    { id: '1', name: 'Computer Science Year 3', department: 'Computer Science', year: 3, totalStudents: 45, representatives: 3, reportsThisWeek: 12, room: 'Building A - Room 301', status: 'active' },
    { id: '2', name: 'Engineering Year 2', department: 'Engineering', year: 2, totalStudents: 52, representatives: 4, reportsThisWeek: 15, room: 'Building B - Room 205', status: 'active' },
    { id: '3', name: 'Chemistry Year 4', department: 'Chemistry', year: 4, totalStudents: 38, representatives: 2, reportsThisWeek: 8, room: 'Building C - Lab 401', status: 'active' },
    { id: '4', name: 'Physics Year 3', department: 'Physics', year: 3, totalStudents: 41, representatives: 3, reportsThisWeek: 11, room: 'Building C - Room 302', status: 'active' },
    { id: '5', name: 'Mathematics Year 2', department: 'Mathematics', year: 2, totalStudents: 48, representatives: 3, reportsThisWeek: 10, room: 'Building A - Room 201', status: 'active' },
    { id: '6', name: 'Business Studies Year 1', department: 'Business', year: 1, totalStudents: 55, representatives: 4, reportsThisWeek: 14, room: 'Building D - Room 101', status: 'active' }
  ];

  /**
   * FETCH CLASSES FROM API
   */
  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`http://localhost:5000/api/admin/dashboard/getClasses?${params}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch classes');
      }
      
      setClasses(result.data.classes);
      setStats(result.data.stats);
      
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load classes');
      
      // Fallback to mock data
      setClasses(mockClasses);
      setStats({
        totalClasses: mockClasses.length,
        totalStudents: mockClasses.reduce((sum, cls) => sum + cls.totalStudents, 0),
        totalRepresentatives: mockClasses.reduce((sum, cls) => sum + cls.representatives, 0),
        reportsThisWeek: mockClasses.reduce((sum, cls) => sum + cls.reportsThisWeek, 0)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchClasses();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = async () => {
    if (!newClassName.trim()) {
      alert('Please enter a class name');
      return;
    }

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newClassName,
          description: newClassDescription
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create class');
      }

      setNewClassName('');
      setNewClassDescription('');
      setShowAddModal(false);
      fetchClasses(); // Refresh the list
      
    } catch (err) {
      console.error('Error creating class:', err);
      alert(err instanceof Error ? err.message : 'Failed to create class');
    }
  };

  const handleViewClass = async (cls: Class) => {
    try {
      const response = await fetch(`/api/admin/classes/${cls.id}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch class details');
      }

      setSelectedClass(result.data.class);
      setShowClassModal(true);
    } catch (err) {
      console.error('Error fetching class details:', err);
      // Fallback to basic class info
      setSelectedClass(cls);
      setShowClassModal(true);
    }
  };

  const handleEditClass = (cls: Class) => {
    // Edit class functionality would go here
    alert(`Edit class: ${cls.name}`);
    setShowActionMenu(null);
  };

  const handleDeleteClass = async (cls: Class) => {
    if (confirm(`Are you sure you want to delete ${cls.name}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/admin/classes/${cls.id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to delete class');
        }

        fetchClasses(); // Refresh the list
      } catch (err) {
        console.error('Error deleting class:', err);
        alert(err instanceof Error ? err.message : 'Failed to delete class');
      }
    }
    setShowActionMenu(null);
  };

  const toggleStatus = (cls: Class) => {
    // Toggle status functionality would go here
    alert(`Toggle status for ${cls.name}`);
    setShowActionMenu(null);
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Engineering': 'from-blue-500 to-cyan-600',
      'Computer Science': 'from-purple-500 to-indigo-600',
      'Science': 'from-emerald-500 to-green-600',
      'Chemistry': 'from-orange-500 to-amber-600',
      'Physics': 'from-red-500 to-pink-600',
      'Mathematics': 'from-teal-500 to-cyan-600',
      'Business': 'from-violet-500 to-purple-600'
    };
    return colors[department] || 'from-gray-500 to-gray-600';
  };

  const getYearColor = (year: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800'
    ];
    return colors[year - 1] || colors[0];
  };

  /**
   * RENDER ERROR MESSAGE
   */
  const renderErrorMessage = () => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-red-800 flex-1">{error}</span>
        <button 
          onClick={fetchClasses}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading classes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600 mt-2">
              Manage classes, departments, and student groups
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchClasses}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && renderErrorMessage()}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
              <p className="text-gray-600">Total Classes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="text-gray-600">Total Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRepresentatives}</p>
              <p className="text-gray-600">Representatives</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.reportsThisWeek}</p>
              <p className="text-gray-600">Weekly Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search classes, departments, or rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'No classes match your search criteria' 
                : 'No classes available'
              }
            </p>
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              {/* Card Header with Gradient */}
              <div className={`rounded-t-xl p-6 bg-gradient-to-r ${getDepartmentColor(cls.department)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{cls.name}</h3>
                      <p className="text-white/80 text-sm">{cls.department}</p>
                    </div>
                  </div>
                  
                  {/* Action Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === cls.id ? null : cls.id)}
                      className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showActionMenu === cls.id && (
                      <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                        <button
                          onClick={() => handleViewClass(cls)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditClass(cls)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Class
                        </button>
                        <button
                          onClick={() => toggleStatus(cls)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <TrendingUp className="w-4 h-4" />
                          {cls.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls)}
                          className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Class
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Year Badge */}
                <div className="flex items-center gap-2 mt-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getYearColor(cls.year)}`}>
                    <BookOpen className="w-3 h-3" />
                    Year {cls.year}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    cls.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cls.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{cls.room}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">{cls.totalStudents}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">{cls.representatives}</p>
                    <p className="text-xs text-gray-600">Reps</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">{cls.reportsThisWeek}</p>
                    <p className="text-xs text-gray-600">Reports</p>
                  </div>
                </div>

                {/* Description */}
                {cls.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {cls.description}
                    </p>
                  </div>
                )}

                {/* Progress Bar for Activity */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Activity Level</span>
                    <span>{Math.min(100, Math.round((cls.reportsThisWeek / cls.totalStudents) * 100))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        cls.reportsThisWeek > 10 ? 'bg-emerald-500' :
                        cls.reportsThisWeek > 5 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((cls.reportsThisWeek / cls.totalStudents) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Class Details Modal */}
      {showClassModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedClass.name}</h2>
                <button
                  onClick={() => setShowClassModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedClass.department} • Year {selectedClass.year}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedClass.room}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedClass.totalStudents} students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedClass.representatives} representatives</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedClass.reportsThisWeek} reports this week</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {selectedClass.recentReports && selectedClass.recentReports.length > 0 ? (
                      selectedClass.recentReports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                            <p className="text-gray-500 text-xs">{report.reporter}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            report.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Students List */}
              {selectedClass.studentList && selectedClass.studentList.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Students ({selectedClass.studentList.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedClass.studentList.slice(0, 6).map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                          <p className="text-gray-500 text-xs">{student.email}</p>
                        </div>
                        {student.role && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            student.role === 'CS' ? 'bg-blue-100 text-blue-800' :
                            student.role === 'CP' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {student.role}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedClass.studentList.length > 6 && (
                    <p className="text-gray-500 text-sm mt-3">
                      +{selectedClass.studentList.length - 6} more students
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Class</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g., Computer Science Year 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newClassDescription}
                    onChange={(e) => setNewClassDescription(e.target.value)}
                    placeholder="Optional class description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClass}
                  className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close action menu when clicking outside */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </AdminLayout>
  );
};

export default ClassesPage;