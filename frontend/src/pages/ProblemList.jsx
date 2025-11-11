import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

function ProblemList() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(API_ENDPOINTS.PROBLEMS);
      setProblems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load problems');
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'solved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Solved
          </span>
        );
      case 'attempted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⚡ Attempted
          </span>
        );
      case 'not_attempted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            ○ Not Attempted
          </span>
        );
      default:
        return null;
    }
  };

  const filteredAndSortedProblems = problems
    .filter((problem) => {
      const matchesSearch = problem.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty?.toLowerCase() === difficultyFilter;
      const matchesStatus = statusFilter === 'all' || problem.userStatus?.toLowerCase() === statusFilter;
      return matchesSearch && matchesDifficulty && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'difficulty': {
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (difficultyOrder[a.difficulty?.toLowerCase()] || 0) - (difficultyOrder[b.difficulty?.toLowerCase()] || 0);
        }
        case 'status': {
          const statusOrder = { solved: 1, attempted: 2, not_attempted: 3 };
          return (statusOrder[a.userStatus?.toLowerCase()] || 0) - (statusOrder[b.userStatus?.toLowerCase()] || 0);
        }
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading problems...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
          <button onClick={fetchProblems} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="not_attempted">Not Attempted</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('title')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'title'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Title
            </button>
            <button
              onClick={() => setSortBy('difficulty')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'difficulty'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Difficulty
            </button>
            <button
              onClick={() => setSortBy('status')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'status'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Status
            </button>
          </div>
        </div>
      </div>

      {/* Problems List */}
      {filteredAndSortedProblems.length === 0 ? (
        <div className="card">
          <p className="text-gray-600 text-center">No problems found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => navigate(`/problems/${problem.id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {getStatusBadge(problem.userStatus)}
                    {problem.attemptCount > 0 && (
                      <span>
                        {problem.attemptCount} {problem.attemptCount === 1 ? 'attempt' : 'attempts'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Showing {filteredAndSortedProblems.length} of {problems.length} problems
      </div>
    </div>
  );
}

export default ProblemList;
