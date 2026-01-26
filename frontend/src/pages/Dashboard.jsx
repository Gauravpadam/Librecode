import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const FAKE_STATS = {
  totalSolved: 42,
  totalAttempted: 65,
  totalProblems: 120,
};

const FAKE_RECENT_SUBMISSIONS = [
  {
    id: 1,
    problemTitle: 'Two Sum',
    language: 'javascript',
    status: 'accepted',
    runtimeMs: 12,
    submittedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 2,
    problemTitle: 'Reverse Linked List',
    language: 'cpp',
    status: 'wrong_answer',
    runtimeMs: 48,
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 3,
    problemTitle: 'Binary Tree Inorder Traversal',
    language: 'python',
    status: 'time_limit_exceeded',
    runtimeMs: null,
    submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];


function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

       if (import.meta.env.VITE_USE_FAKE_DASHBOARD === 'true') {
      // simulate network delay
      await new Promise((r) => setTimeout(r, 300));

      setStats(FAKE_STATS);
      setRecentSubmissions(FAKE_RECENT_SUBMISSIONS);
      return;
    }
      
      // Fetch user statistics
      const statsResponse = await api.get(API_ENDPOINTS.SUBMISSION_STATS);
      setStats(statsResponse.data);
      
      // Fetch recent submissions (limit to 5)
      const submissionsResponse = await api.get(API_ENDPOINTS.SUBMISSIONS);
      setRecentSubmissions(submissionsResponse.data.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'text-green-600';
      case 'wrong_answer':
        return 'text-red-600';
      case 'time_limit_exceeded':
        return 'text-yellow-600';
      case 'memory_limit_exceeded':
        return 'text-orange-600';
      case 'runtime_error':
        return 'text-red-600';
      case 'compilation_error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl text-slate-300 font-bold mb-6">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg text-slate-300 font-semibold text-gray-700 mb-2">Total Solved</h3>
          <p className="text-3xl font-bold text-success">{stats?.totalSolved || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-lg text-slate-300 font-semibold text-gray-700 mb-2">Attempted</h3>
          <p className="text-3xl font-bold text-warning">{stats?.totalAttempted || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-lg text-slate-300 font-semibold text-gray-700 mb-2">Total Problems</h3>
          <p className="text-3xl font-bold text-primary-600">{stats?.totalProblems || 0}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card mb-8">
        <h2 className="text-xl text-slate-300 font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <div>
              <h3 className="font-semibold text-green-800">Easy Problems</h3>
              <p className="text-sm text-green-600">Start with basics</p>
            </div>
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/problems')}
            className="flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
          >
            <div>
              <h3 className="font-semibold text-yellow-800">Medium Problems</h3>
              <p className="text-sm text-yellow-600">Challenge yourself</p>
            </div>
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/problems')}
            className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <div>
              <h3 className="font-semibold text-red-800">Hard Problems</h3>
              <p className="text-sm text-red-600">Expert level</p>
            </div>
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-slate-300 font-semibold">Recent Submissions</h2>
          <button
            onClick={() => navigate('/submissions')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No submissions yet</p>
            <button onClick={() => navigate('/problems')} className="btn-primary">
              Start Solving Problems
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    onClick={() => navigate(`/submissions/${submission.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.problemTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{submission.language}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(submission.status)}`}>
                        {formatStatus(submission.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {submission.runtimeMs ? `${submission.runtimeMs}ms` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
