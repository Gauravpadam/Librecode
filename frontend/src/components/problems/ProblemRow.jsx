import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DifficultyBadge from '../common/DifficultyBadge';

/**
 * ProblemRow component for displaying a single problem in the table
 * Shows problem title, difficulty, status, and tags with click navigation
 */
function ProblemRow({ problem }) {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'solved':
        return (
          <span className="text-emerald-500" title="Solved">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        );
      case 'attempted':
        return (
          <span className="text-amber-500" title="Attempted">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        );
      default:
        return (
          <span className="text-slate-600" title="Not Attempted">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        );
    }
  };

  const handleClick = () => {
    navigate(`/problems/${problem.id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <tr
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      className="border-b border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus:bg-slate-800"
      role="button"
      aria-label={`View problem: ${problem.title}`}
    >
      {/* Status Column */}
      <td className="px-4 py-3 text-center">
        {getStatusIcon(problem.userStatus)}
      </td>

      {/* Title Column */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-100 font-medium hover:text-amber-500 transition-colors">
            {problem.title}
          </span>
        </div>
      </td>

      {/* Difficulty Column */}
      <td className="px-4 py-3">
        <DifficultyBadge difficulty={problem.difficulty} />
      </td>

      {/* Tags Column */}
      <td className="px-4 py-3">
        {problem.tags && problem.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {problem.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="px-2 py-0.5 text-slate-400 text-xs">
                +{problem.tags.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-500 text-sm">—</span>
        )}
      </td>

      {/* Acceptance Rate Column (optional) */}
      {problem.acceptanceRate !== undefined && (
        <td className="px-4 py-3 text-slate-300 text-sm">
          {problem.acceptanceRate}%
        </td>
      )}
    </tr>
  );
}

ProblemRow.propTypes = {
  problem: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    userStatus: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    acceptanceRate: PropTypes.number,
  }).isRequired,
};

export default ProblemRow;
