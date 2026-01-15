import PropTypes from 'prop-types';

/**
 * Card component with slate styling
 * Provides a consistent elevated surface for content
 */
function Card({ children, className = '', hover = false, ...props }) {
  const baseStyles = 'bg-slate-850 rounded-lg border border-slate-700 p-6';
  const hoverStyles = hover ? 'hover:border-slate-600 transition-colors cursor-pointer' : '';

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};

export default Card;
