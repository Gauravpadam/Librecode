import PropTypes from 'prop-types';

/**
 * StatusBadge component for submission status
 * Displays status with appropriate color coding
 */
function StatusBadge({ status, className = '' }) {
  const baseStyles = 'px-2 py-1 rounded text-xs font-medium inline-block';
  
  // Convert enum status to display string
  const getDisplayStatus = (status) => {
    if (!status) return 'Unknown';
    
    // Handle enum object or string enum value
    const statusStr = typeof status === 'object' ? status.toString() : status;
    
    // Convert SNAKE_CASE to Title Case
    return statusStr
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayStatus = getDisplayStatus(status);
  const statusKey = typeof status === 'object' ? status.toString() : status;
  
  // Map status to color schemes (using both formats for compatibility)
  const statusStyles = {
    'Accepted': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'ACCEPTED': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'Wrong Answer': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'WRONG_ANSWER': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Time Limit Exceeded': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'TIME_LIMIT_EXCEEDED': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'Memory Limit Exceeded': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'MEMORY_LIMIT_EXCEEDED': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'Runtime Error': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'RUNTIME_ERROR': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Compilation Error': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'COMPILATION_ERROR': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Pending': 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
    'PENDING': 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
    'Running': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'RUNNING': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'Judging': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'JUDGING': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  };

  // Default style for unknown statuses
  const style = statusStyles[statusKey] || statusStyles[displayStatus] || 'bg-slate-500/20 text-slate-400 border border-slate-500/30';

  return (
    <span className={`${baseStyles} ${style} ${className}`}>
      {displayStatus}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  className: PropTypes.string,
};

export default StatusBadge;
