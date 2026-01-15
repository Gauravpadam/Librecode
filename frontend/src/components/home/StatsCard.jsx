import PropTypes from 'prop-types';
import Card from '../common/Card';

/**
 * StatsCard component
 * Displays a single user statistic with title and value
 */
function StatsCard({ title, value, icon, className = '' }) {
  return (
    <Card className={`text-center ${className}`}>
      {icon && (
        <div className="flex justify-center mb-3">
          <div className="text-amber-400 text-3xl">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-slate-400 text-sm font-sans uppercase tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-4xl font-bold text-slate-50 font-sans">
        {value !== undefined && value !== null ? value : '—'}
      </p>
    </Card>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default StatsCard;
