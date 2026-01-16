import PropTypes from 'prop-types';

/**
 * TestResults component for displaying test case results
 * Shows pass/fail status with color coding (emerald for pass, red for fail)
 * Applies monospace font to code display
 */
function TestResults({ results = [], isLoading = false, className = '' }) {
  if (isLoading) {
    return (
      <div className={`bg-slate-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-slate-300">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Running tests...</span>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className={`bg-slate-800 rounded-lg p-4 ${className}`}>
        <p className="text-slate-400 text-sm">
          No test results yet. Click &quot;Run&quot; to execute your code.
        </p>
      </div>
    );
  }

  // Calculate pass/fail statistics
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className={`bg-slate-800 rounded-lg ${className}`}>
      {/* Header with summary */}
      <div className={`px-4 py-3 border-b border-slate-700 flex items-center justify-between ${
        allPassed ? 'bg-emerald-500/10' : 'bg-red-500/10'
      }`}>
        <h3 className="font-semibold text-slate-100">
          Test Results
        </h3>
        <div className={`text-sm font-medium ${
          allPassed ? 'text-emerald-500' : 'text-red-500'
        }`}>
          {passedCount} / {totalCount} Passed
        </div>
      </div>

      {/* Test case results */}
      <div className="divide-y divide-slate-700">
        {results.map((result, index) => (
          <div key={index} className="p-4">
            <div className="flex items-start gap-3">
              {/* Status icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                result.passed 
                  ? 'bg-emerald-500/20 text-emerald-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {result.passed ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Test case details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-200">
                    Test Case {index + 1}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    result.passed 
                      ? 'bg-emerald-500/20 text-emerald-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                {/* Input */}
                {result.input !== undefined && (
                  <div className="mb-2">
                    <span className="text-xs text-slate-400">Input:</span>
                    <pre className="mt-1 text-sm font-mono text-slate-300 bg-slate-900 rounded px-2 py-1 overflow-x-auto">
                      {typeof result.input === 'string' ? result.input : JSON.stringify(result.input)}
                    </pre>
                  </div>
                )}

                {/* Expected output */}
                {result.expected !== undefined && (
                  <div className="mb-2">
                    <span className="text-xs text-slate-400">Expected:</span>
                    <pre className="mt-1 text-sm font-mono text-emerald-500 bg-slate-900 rounded px-2 py-1 overflow-x-auto">
                      {typeof result.expected === 'string' ? result.expected : JSON.stringify(result.expected)}
                    </pre>
                  </div>
                )}

                {/* Actual output */}
                {result.actual !== undefined && (
                  <div className="mb-2">
                    <span className="text-xs text-slate-400">Actual:</span>
                    <pre className={`mt-1 text-sm font-mono rounded px-2 py-1 overflow-x-auto ${
                      result.passed 
                        ? 'text-emerald-500 bg-slate-900' 
                        : 'text-red-500 bg-slate-900'
                    }`}>
                      {typeof result.actual === 'string' ? result.actual : JSON.stringify(result.actual)}
                    </pre>
                  </div>
                )}

                {/* Error message */}
                {result.error && (
                  <div className="mt-2">
                    <span className="text-xs text-red-400">Error:</span>
                    <pre className="mt-1 text-sm font-mono text-red-400 bg-slate-900 rounded px-2 py-1 overflow-x-auto">
                      {result.error}
                    </pre>
                  </div>
                )}

                {/* Runtime info */}
                {(result.runtime || result.memory) && (
                  <div className="mt-2 flex gap-4 text-xs text-slate-400">
                    {result.runtime && (
                      <span>Runtime: {result.runtime}ms</span>
                    )}
                    {result.memory && (
                      <span>Memory: {result.memory}MB</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TestResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      passed: PropTypes.bool.isRequired,
      input: PropTypes.any,
      expected: PropTypes.any,
      actual: PropTypes.any,
      error: PropTypes.string,
      runtime: PropTypes.number,
      memory: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default TestResults;
