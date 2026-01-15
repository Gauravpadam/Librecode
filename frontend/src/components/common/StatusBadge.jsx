import PropTypes from 'prop-types';

/**
 * StatusBadge component for submission status
 * Displays status with appropriate color coding
 */
function StatusBadge({ status, className = '' }) {
  const baseStyles = 'px-2 py-1 rounded text-xs font-medium inline-block';
  
  // Map status to color schemes
  const statusStyles = {
    'Accepted': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'Wrong Answer': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Time Limit Exceeded': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'Memory Limit Exceeded': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'Runtime Error': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Compilation Error': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Pending': 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
    'Running': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'Judging': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  };

  // Default style for unknown statuses
  const style = statusStyles[status] || 'bg-slate-500/20 text-slate-400 border border-slate-500/30';

  return (
    <span className={`${baseStyles} ${style} ${className}`}>
      {status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default StatusBadge;
