import PropTypes from 'prop-types';

/**
 * DifficultyBadge component for problem difficulty
 * Displays difficulty level with color coding (Easy/Medium/Hard)
 */
function DifficultyBadge({ difficulty, className = '' }) {
  const baseStyles = 'px-2 py-1 rounded text-xs font-medium inline-block';
  
  // Map difficulty to color schemes
  const difficultyStyles = {
    'Easy': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'Medium': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'Hard': 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  // Normalize difficulty (case-insensitive)
  const normalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  
  // Default style for unknown difficulties
  const style = difficultyStyles[normalizedDifficulty] || 'bg-slate-500/20 text-slate-400 border border-slate-500/30';

  return (
    <span className={`${baseStyles} ${style} ${className}`}>
      {normalizedDifficulty}
    </span>
  );
}

DifficultyBadge.propTypes = {
  difficulty: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default DifficultyBadge;
