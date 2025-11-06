/**
 * ADMIN ITEMS PAGE
 * 
 * This page displays and manages all inspection items.
 * 
 * LOCATION: /admin/items
 * 
 * FEATURES:
 * - List of all inspection items
 * - Search functionality
 * - Add/Edit/Delete items
 * - Item categories
 * - Usage statistics
 */

"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  FileText,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  X,
  BarChart3,
  Filter,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Shield
} from 'lucide-react';

interface InspectionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  mandatory: boolean;
  usageCount: number;
  goodCount: number;
  badCount: number;
  flaggedCount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    items: InspectionItem[];
    stats: {
      totalItems: number;
      mandatory: number;
      totalUsage: number;
      avgGoodRate: number;
    };
    categories: string[];
    filters: {
      search: string;
      category: string;
    };
  };
  message: string;
}

const ItemsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    mandatory: 0,
    totalUsage: 0,
    avgGoodRate: 0
  });
  const [categories, setCategories] = useState<string[]>(['all']);
  const [selectedItem, setSelectedItem] = useState<InspectionItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  // Mock data for fallback
  const mockItems: InspectionItem[] = [
    {
      id: '1',
      name: 'Fire Extinguisher',
      description: 'Check if fire extinguisher is accessible and not expired',
      category: 'Safety Equipment',
      mandatory: true,
      usageCount: 1248,
      goodCount: 1180,
      badCount: 45,
      flaggedCount: 23
    },
    {
      id: '2',
      name: 'Emergency Exit Signs',
      description: 'Verify all emergency exit signs are illuminated',
      category: 'Safety Equipment',
      mandatory: true,
      usageCount: 1248,
      goodCount: 1190,
      badCount: 38,
      flaggedCount: 20
    },
    {
      id: '3',
      name: 'Window Glass',
      description: 'Inspect all windows for cracks or damage',
      category: 'Infrastructure',
      mandatory: true,
      usageCount: 1248,
      goodCount: 1150,
      badCount: 65,
      flaggedCount: 33
    },
    {
      id: '4',
      name: 'Floor Condition',
      description: 'Check for spills, cracks, or trip hazards',
      category: 'Infrastructure',
      mandatory: true,
      usageCount: 1248,
      goodCount: 1170,
      badCount: 52,
      flaggedCount: 26
    },
    {
      id: '5',
      name: 'Electrical Outlets',
      description: 'Ensure all outlets are functioning and properly covered',
      category: 'Electrical',
      mandatory: true,
      usageCount: 1248,
      goodCount: 1140,
      badCount: 75,
      flaggedCount: 33
    },
    {
      id: '6',
      name: 'First Aid Kit',
      description: 'Verify first aid kit is stocked and accessible',
      category: 'Safety Equipment',
      mandatory: true,
      usageCount: 1248,
      goodCount: 1165,
      badCount: 58,
      flaggedCount: 25
    }
  ];

  /**
   * FETCH ITEMS FROM API
   */
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const response = await fetch(`https://npc-smart-report-bn-v2-beta.onrender.com/api/admin/dashboard/getItems?${params}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch inspection items');
      }
      
      setItems(result.data.items);
      setStats(result.data.stats);
      setCategories(result.data.categories);
      
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inspection items');
      
      // Fallback to mock data
      setItems(mockItems);
      setStats({
        totalItems: mockItems.length,
        mandatory: mockItems.filter(i => i.mandatory).length,
        totalUsage: mockItems.reduce((sum, i) => sum + i.usageCount, 0),
        avgGoodRate: Math.round((mockItems.reduce((sum, i) => sum + (i.goodCount / i.usageCount * 100), 0)) / mockItems.length)
      });
      setCategories(['all', ...Array.from(new Set(mockItems.map(item => item.category)))]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter]);

  const filteredItems = items.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      alert('Please enter an item name');
      return;
    }

    try {
      const response = await fetch('/api/admin/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newItemName,
          description: newItemDescription
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create item');
      }

      setNewItemName('');
      setNewItemDescription('');
      setShowAddModal(false);
      fetchItems(); // Refresh the list
      
    } catch (err) {
      console.error('Error creating item:', err);
      alert(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const handleViewItem = async (item: InspectionItem) => {
    try {
      const response = await fetch(`/api/admin/items/${item.id}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch item details');
      }

      setSelectedItem(result.data.item);
      setShowItemModal(true);
    } catch (err) {
      console.error('Error fetching item details:', err);
      // Fallback to basic item info
      setSelectedItem(item);
      setShowItemModal(true);
    }
  };

  const handleEditItem = (item: InspectionItem) => {
    // Edit item functionality would go here
    alert(`Edit item: ${item.name}`);
    setShowActionMenu(null);
  };

  const handleDeleteItem = async (item: InspectionItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/admin/items/${item.id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to delete item');
        }

        fetchItems(); // Refresh the list
      } catch (err) {
        console.error('Error deleting item:', err);
        alert(err instanceof Error ? err.message : 'Failed to delete item');
      }
    }
    setShowActionMenu(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Safety Equipment': 'from-red-500 to-orange-600',
      'Infrastructure': 'from-blue-500 to-cyan-600',
      'Electrical': 'from-yellow-500 to-amber-600',
      'HVAC': 'from-green-500 to-emerald-600',
      'Furniture': 'from-purple-500 to-indigo-600',
      'Equipment': 'from-pink-500 to-rose-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 80) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getStatusBgColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 80) return 'bg-amber-500';
    return 'bg-rose-500';
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
          onClick={fetchItems}
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
          <p className="mt-4 text-gray-600">Loading inspection items...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Inspection Items</h1>
            <p className="text-gray-600 mt-2">
              Manage all inspection items used in reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchItems}
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
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && renderErrorMessage()}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              <p className="text-gray-600">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-lg">
              <Shield className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.mandatory}</p>
              <p className="text-gray-600">Mandatory</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsage.toLocaleString()}</p>
              <p className="text-gray-600">Total Usage</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgGoodRate}%</p>
              <p className="text-gray-600">Avg Good Rate</p>
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
              placeholder="Search items by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== 'all' 
                ? 'No items match your current filters' 
                : 'No inspection items available'
              }
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const goodRate = Math.round((item.goodCount / item.usageCount) * 100);
            const badRate = Math.round((item.badCount / item.usageCount) * 100);
            const flaggedRate = Math.round((item.flaggedCount / item.usageCount) * 100);

            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                {/* Card Header with Gradient */}
                <div className={`rounded-t-xl p-6 bg-gradient-to-r ${getCategoryColor(item.category)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                        <p className="text-white/80 text-sm">{item.category}</p>
                      </div>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
                        className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {showActionMenu === item.id && (
                        <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                          <button
                            onClick={() => handleViewItem(item)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditItem(item)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit Item
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Mandatory Badge */}
                  {item.mandatory && (
                    <div className="flex items-center gap-2 mt-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                        <Shield className="w-3 h-3" />
                        Mandatory
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Usage Statistics */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Usage Statistics</span>
                      <span className="text-sm text-gray-500">{item.usageCount.toLocaleString()} times</span>
                    </div>

                    {/* Stats Breakdown */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-emerald-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-emerald-600">{goodRate}%</p>
                        <p className="text-xs text-gray-500">Good</p>
                      </div>
                      <div className="text-center p-2 bg-amber-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-amber-600">{badRate}%</p>
                        <p className="text-xs text-gray-500">Bad</p>
                      </div>
                      <div className="text-center p-2 bg-rose-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-rose-600">{flaggedRate}%</p>
                        <p className="text-xs text-gray-500">Flagged</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Performance</span>
                        <span>{goodRate}% Good</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getStatusBgColor(goodRate)}`}
                          style={{ width: `${goodRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Item Details Modal */}
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                <button
                  onClick={() => setShowItemModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {selectedItem.category}
                </span>
                {selectedItem.mandatory && (
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Mandatory
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-gray-600">{selectedItem.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Usage</label>
                      <p className="text-gray-900 font-semibold">{selectedItem.usageCount.toLocaleString()} reports</p>
                    </div>
                  </div>
                </div>

                {/* Performance Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <p className="text-2xl font-bold text-emerald-600">
                          {Math.round((selectedItem.goodCount / selectedItem.usageCount) * 100)}%
                        </p>
                        <p className="text-sm text-emerald-600">Good</p>
                        <p className="text-xs text-gray-500">{selectedItem.goodCount.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">
                          {Math.round((selectedItem.badCount / selectedItem.usageCount) * 100)}%
                        </p>
                        <p className="text-sm text-amber-600">Bad</p>
                        <p className="text-xs text-gray-500">{selectedItem.badCount.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-rose-50 rounded-lg">
                        <p className="text-2xl font-bold text-rose-600">
                          {Math.round((selectedItem.flaggedCount / selectedItem.usageCount) * 100)}%
                        </p>
                        <p className="text-sm text-rose-600">Flagged</p>
                        <p className="text-xs text-gray-500">{selectedItem.flaggedCount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Trend (Placeholder for future implementation) */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Usage trends and analytics coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Item</h2>
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
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Fire Extinguisher"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="Describe what to check for this item..."
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
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Item
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

export default ItemsPage;