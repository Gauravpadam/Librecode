import PropTypes from 'prop-types';
import ProblemRow from './ProblemRow';

/**
 * ProblemsTable component for displaying problems in a table format
 * Features sortable columns and responsive design
 */
function ProblemsTable({ 
  problems, 
  sortBy, 
  onSortChange, 
  loading = false,
  className = '' 
}) {
  const columns = [
    { key: 'status', label: 'Status', sortable: false, width: 'w-16' },
    { key: 'title', label: 'Title', sortable: true, width: 'flex-1' },
    { key: 'difficulty', label: 'Difficulty', sortable: true, width: 'w-32' },
    { key: 'tags', label: 'Tags', sortable: false, width: 'w-48' },
  ];

  const handleSort = (columnKey) => {
    if (columnKey === sortBy) {
      // Toggle sort direction or reset
      onSortChange(null);
    } else {
      onSortChange(columnKey);
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortBy !== columnKey) {
      return (
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-slate-400">Loading problems...</div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="bg-slate-850 rounded-lg border border-slate-700 p-8 text-center">
        <p className="text-slate-400">No problems found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="bg-slate-850 rounded-lg border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-slate-300 ${column.width}`}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-amber-500 transition-colors focus:outline-none focus:text-amber-500"
                      aria-label={`Sort by ${column.label}`}
                    >
                      {column.label}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <ProblemRow key={problem.id} problem={problem} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <div className="mt-4 text-center text-sm text-slate-400">
        Showing {problems.length} {problems.length === 1 ? 'problem' : 'problems'}
      </div>
    </div>
  );
}

ProblemsTable.propTypes = {
  problems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      difficulty: PropTypes.string.isRequired,
      userStatus: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  sortBy: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default ProblemsTable;
