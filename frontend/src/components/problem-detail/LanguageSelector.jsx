import PropTypes from 'prop-types';

/**
 * LanguageSelector dropdown component
 * Allows users to select programming language (Java, Python, JavaScript)
 * Uses slate styling with primary accent for active state
 */
function LanguageSelector({ 
  selectedLanguage = 'javascript', 
  onLanguageChange,
  className = ''
}) {
  const languages = [
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'javascript', label: 'JavaScript', icon: '⚡' },
  ];

  const handleChange = (event) => {
    if (onLanguageChange) {
      onLanguageChange(event.target.value);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label 
        htmlFor="language-selector" 
        className="text-sm font-medium text-slate-300"
      >
        Language:
      </label>
      <select
        id="language-selector"
        value={selectedLanguage}
        onChange={handleChange}
        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                   hover:border-primary transition-colors cursor-pointer font-mono text-sm"
        aria-label="Select programming language"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.icon} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

LanguageSelector.propTypes = {
  selectedLanguage: PropTypes.oneOf(['java', 'python', 'javascript']),
  onLanguageChange: PropTypes.func,
  className: PropTypes.string,
};

export default LanguageSelector;
