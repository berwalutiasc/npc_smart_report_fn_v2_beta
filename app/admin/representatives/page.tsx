/**
 * ADMIN REPRESENTATIVES PAGE
 * 
 * This page manages all student representatives.
 * 
 * LOCATION: /admin/representatives
 * 
 * FEATURES:
 * - List of all representatives
 * - View representative details and performance
 * - Filter by class/department
 * - Search functionality
 * - Add/Edit/Remove representatives
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  GraduationCap,
  TrendingUp,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  Shield,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Representative {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  department: string;
  reportsSubmitted: number;
  avgCompletionRate: number;
  status: 'active' | 'inactive';
  studentRole?: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    representatives: Representative[];
    stats: {
      total: number;
      active: number;
      departments: number;
    };
    departments: string[];
    filters: {
      search: string;
      department: string;
    };
  };
  message: string;
}

const RepresentativesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    departments: 0
  });
  const [departments, setDepartments] = useState<string[]>(['all']);
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Mock data for fallback
  const mockRepresentatives: Representative[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@edu.com', phone: '+1 555-0101', class: 'CS Year 3', department: 'Computer Science', reportsSubmitted: 24, avgCompletionRate: 98, status: 'active', studentRole: 'CS' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@edu.com', phone: '+1 555-0102', class: 'ENG Year 2', department: 'Engineering', reportsSubmitted: 22, avgCompletionRate: 95, status: 'active', studentRole: 'CP' },
    { id: '3', name: 'Mike Johnson', email: 'mike.j@edu.com', phone: '+1 555-0103', class: 'CHEM Year 4', department: 'Chemistry', reportsSubmitted: 20, avgCompletionRate: 92, status: 'active', studentRole: 'WS' },
    { id: '4', name: 'Sarah Williams', email: 'sarah.w@edu.com', phone: '+1 555-0104', class: 'PHYS Year 3', department: 'Physics', reportsSubmitted: 19, avgCompletionRate: 96, status: 'active', studentRole: 'CC' },
    { id: '5', name: 'Tom Brown', email: 'tom.b@edu.com', phone: '+1 555-0105', class: 'CS Year 4', department: 'Computer Science', reportsSubmitted: 18, avgCompletionRate: 94, status: 'active', studentRole: 'CS' },
    { id: '6', name: 'Alex Chen', email: 'alex.chen@edu.com', phone: '+1 555-0106', class: 'MATH Year 2', department: 'Mathematics', reportsSubmitted: 15, avgCompletionRate: 88, status: 'inactive', studentRole: 'CP' },
  ];

  /**
   * FETCH REPRESENTATIVES FROM API
   */
  const fetchRepresentatives = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterDepartment !== 'all') params.append('department', filterDepartment);

      const response = await fetch(`http://localhost:5000/api/admin/dashboard/getRepresentatives?${params}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch representatives');
      }
      
      setRepresentatives(result.data.representatives);
      setStats(result.data.stats);
      setDepartments(result.data.departments);
      
    } catch (err) {
      console.error('Error fetching representatives:', err);
      setError(err instanceof Error ? err.message : 'Failed to load representatives');
      
      // Fallback to mock data
      setRepresentatives(mockRepresentatives);
      setStats({
        total: mockRepresentatives.length,
        active: mockRepresentatives.filter(r => r.status === 'active').length,
        departments: Array.from(new Set(mockRepresentatives.map(r => r.department))).length
      });
      setDepartments(['all', ...Array.from(new Set(mockRepresentatives.map(r => r.department)))]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepresentatives();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRepresentatives();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterDepartment]);

  const filteredReps = representatives.filter(rep => {
    if (filterDepartment !== 'all' && rep.department !== filterDepartment) return false;
    if (searchTerm && !rep.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rep.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleAddRepresentative = () => {
    // Add representative functionality would go here
    alert('Add representative functionality would be implemented here');
  };

  const handleViewRepresentative = (rep: Representative) => {
    setSelectedRep(rep);
    // View representative details would go here
  };

  const handleEditRepresentative = (rep: Representative) => {
    // Edit representative functionality would go here
    alert(`Edit representative: ${rep.name}`);
    setShowActionMenu(null);
  };

  const handleDeleteRepresentative = (rep: Representative) => {
    // Delete representative functionality would go here
    if (confirm(`Are you sure you want to remove ${rep.name} as a representative?`)) {
      alert(`Delete representative: ${rep.name}`);
    }
    setShowActionMenu(null);
  };

  const toggleStatus = (rep: Representative) => {
    // Toggle status functionality would go here
    alert(`Toggle status for ${rep.name}`);
    setShowActionMenu(null);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'CS': 'bg-blue-100 text-blue-800',
      'CP': 'bg-green-100 text-green-800',
      'WS': 'bg-purple-100 text-purple-800',
      'CC': 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 80) return 'text-amber-600';
    return 'text-rose-600';
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
          onClick={fetchRepresentatives}
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
          <p className="mt-4 text-gray-600">Loading representatives...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Representatives</h1>
            <p className="text-gray-600 mt-2">
              Manage student representatives and monitor their performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchRepresentatives}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={handleAddRepresentative}
              className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Representative
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && renderErrorMessage()}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total Representatives</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-gray-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
              <p className="text-gray-600">Departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Representatives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReps.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No representatives found</h3>
            <p className="text-gray-500">
              {searchTerm || filterDepartment !== 'all' 
                ? 'No representatives match your current filters' 
                : 'No representatives available'
              }
            </p>
          </div>
        ) : (
          filteredReps.map((rep) => (
            <div key={rep.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      {rep.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{rep.name}</h3>
                      <p className="text-sm text-gray-600">{rep.class}</p>
                    </div>
                  </div>
                  
                  {/* Action Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === rep.id ? null : rep.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showActionMenu === rep.id && (
                      <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                        <button
                          onClick={() => handleViewRepresentative(rep)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditRepresentative(rep)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(rep)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          {rep.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          {rep.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteRepresentative(rep)}
                          className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Role and Status */}
                <div className="flex items-center gap-2 mt-4">
                  {rep.studentRole && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(rep.studentRole)}`}>
                      <Shield className="w-3 h-3" />
                      {rep.studentRole}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    rep.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rep.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {rep.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Department */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900">{rep.department}</p>
                  <p className="text-sm text-gray-600">Department</p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{rep.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{rep.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">{rep.reportsSubmitted}</p>
                    <p className="text-xs text-gray-600">Reports</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className={`text-lg font-semibold ${getCompletionColor(rep.avgCompletionRate)}`}>
                      {rep.avgCompletionRate}%
                    </p>
                    <p className="text-xs text-gray-600">Completion</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Performance</span>
                    <span>{rep.avgCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        rep.avgCompletionRate >= 90 ? 'bg-emerald-500' :
                        rep.avgCompletionRate >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${rep.avgCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Close action menu when clicking outside */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </AdminLayout>
  );
};

export default RepresentativesPage;