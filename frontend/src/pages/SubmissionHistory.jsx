import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

function SubmissionHistory() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [submissions, statusFilter, sortBy, sortOrder]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(API_ENDPOINTS.SUBMISSIONS);
      setSubmissions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...submissions];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.submittedAt) - new Date(b.submittedAt);
          break;
        case 'runtime':
          comparison = (a.runtimeMs || 0) - (b.runtimeMs || 0);
          break;
        case 'problem':
          comparison = (a.problemTitle || '').localeCompare(b.problemTitle || '');
          break;
        case 'memory':
          comparison = (a.memoryKb || 0) - (b.memoryKb || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredSubmissions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'wrong_answer':
        return 'bg-red-100 text-red-800';
      case 'time_limit_exceeded':
        return 'bg-yellow-100 text-yellow-800';
      case 'memory_limit_exceeded':
        return 'bg-orange-100 text-orange-800';
      case 'runtime_error':
        return 'bg-red-100 text-red-800';
      case 'compilation_error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSortOrder = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-slate-300">Loading submissions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
          <button onClick={fetchSubmissions} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl text-slate-300 font-bold mb-6">Submission History</h1>

      {/* Filters and Sort Controls */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-300 font-medium">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:outline-none text-slate-300 focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="accepted">Accepted</option>
              <option value="wrong_answer">Wrong Answer</option>
              <option value="time_limit_exceeded">Time Limit Exceeded</option>
              <option value="memory_limit_exceeded">Memory Limit Exceeded</option>
              <option value="runtime_error">Runtime Error</option>
              <option value="compilation_error">Compilation Error</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Date</option>
              <option value="runtime">Runtime</option>
              <option value="memory">Memory</option>
              <option value="problem">Problem</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          Showing {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Submissions Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-300 mb-4">
            {statusFilter === 'all' 
              ? 'No submissions yet' 
              : `No submissions with status: ${formatStatus(statusFilter)}`}
          </p>
          {statusFilter === 'all' && (
            <button onClick={() => navigate('/problems')} className="btn-primary">
              Start Solving Problems
            </button>
          )}
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')} className="btn-secondary">
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                      onClick={() => toggleSortOrder('problem')}
                    >
                      <div className="flex items-center gap-1">
                        Problem
                        {sortBy === 'problem' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                      onClick={() => toggleSortOrder('runtime')}
                    >
                      <div className="flex items-center gap-1">
                        Runtime
                        {sortBy === 'runtime' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                      onClick={() => toggleSortOrder('memory')}
                    >
                      <div className="flex items-center gap-1">
                        Memory
                        {sortBy === 'memory' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                      onClick={() => toggleSortOrder('date')}
                    >
                      <div className="flex items-center gap-1">
                        Submitted
                        {sortBy === 'date' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {currentSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      onClick={() => navigate(`/submissions/${submission.id}`)}
                      className="hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">
                          {submission.problemTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-400 capitalize">{submission.language}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                          {formatStatus(submission.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-400">
                          {submission.runtimeMs !== null && submission.runtimeMs !== undefined 
                            ? `${submission.runtimeMs}ms` 
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-400">
                          {submission.memoryKb !== null && submission.memoryKb !== undefined 
                            ? `${(submission.memoryKb / 1024).toFixed(2)}MB` 
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-400">{formatDate(submission.submittedAt)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubmissionHistory;
