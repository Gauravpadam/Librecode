import PropTypes from 'prop-types';

/**
 * ProblemFilters component for filtering problems
 * Provides filters for difficulty, tags, and status with amber active states
 */
function ProblemFilters({ 
  difficulty, 
  onDifficultyChange, 
  status, 
  onStatusChange,
  tags,
  onTagsChange,
  availableTags = [],
  className = '' 
}) {
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'solved', label: 'Solved' },
    { value: 'attempted', label: 'Attempted' },
    { value: 'not_attempted', label: 'Unsolved' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Difficulty
        </label>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => {
            const isActive = difficulty === diff.toLowerCase();
            return (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff.toLowerCase())}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
                aria-pressed={isActive}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Status
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((stat) => {
            const isActive = status === stat.value;
            return (
              <button
                key={stat.value}
                onClick={() => onStatusChange(stat.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
                aria-pressed={isActive}
              >
                {stat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags Filter (if available tags provided) */}
      {availableTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isActive = tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => {
                    if (isActive) {
                      onTagsChange(tags.filter((t) => t !== tag));
                    } else {
                      onTagsChange([...tags, tag]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                  aria-pressed={isActive}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(difficulty !== 'all' || status !== 'all' || tags.length > 0) && (
        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {[
                difficulty !== 'all' && `Difficulty: ${difficulty}`,
                status !== 'all' && `Status: ${status}`,
                tags.length > 0 && `Tags: ${tags.length}`,
              ]
                .filter(Boolean)
                .join(' • ')}
            </span>
            <button
              onClick={() => {
                onDifficultyChange('all');
                onStatusChange('all');
                onTagsChange([]);
              }}
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ProblemFilters.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onDifficultyChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  onTagsChange: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default ProblemFilters;
