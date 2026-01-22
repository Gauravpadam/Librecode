import { useState } from 'react';
import PropTypes from 'prop-types';
import TestResults from './TestResults';

/**
 * TestCasePanel - Shows sample test cases below the code editor
 * Displays input/expected output for each sample case
 * Shows actual results after running code
 */
function TestCasePanel({ 
  sampleTestCases = [], 
  testResults = [],
  isRunning = false,
  isSubmitting = false,
  onRun,
  onSubmit,
  toggleViewAllResults
}) {

    const [activeCase, setActiveCase] = useState(0);


    const resultsById = Object.fromEntries(testResults.map(r => [r.testCaseId, r]));

  
    const displayCases = sampleTestCases.slice(0, 3).map(tc => ({
    ...tc,
    result: resultsById[tc.id]
    }));


  
  // Find result for active case
    const activeTestCase = displayCases[activeCase];
    const activeResult = activeTestCase?.result;
  return (
    <div className="flex flex-col h-full bg-slate-850 border-t border-slate-700">
      {/* Tab bar with test case tabs and action buttons */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-1">
          {displayCases.map((tc, index) => {
            const result = tc.result;
            const hasResult = !!result;
            const passed = result?.passed;

            return (
              <button
                key={tc.id || index}
                onClick={() => setActiveCase(index)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeCase === index
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                } ${hasResult ? (passed ? 'border-l-2 border-emerald-500' : 'border-l-2 border-red-500') : ''}`}
              >
                Case {index + 1}
                {hasResult && (
                  <span className={`ml-1.5 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {passed ? '✓' : '✗'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 text-sm font-medium border border-slate-600 rounded-md 
                     bg-slate-700 text-slate-200 hover:bg-slate-600 hover:border-primary 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full"></span>
                Running...
              </span>
            ) : 'Run'}
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || isRunning}
            className="px-4 py-1.5 text-sm font-medium rounded-md 
                     bg-primary text-background hover:bg-primary/90 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-3 w-3 border-2 border-background border-t-transparent rounded-full"></span>
                Submitting...
              </span>
            ) : 'Submit'}
          </button>
        </div>
      </div>

      {/* Test case content */}
      { testResults.length > 0 && toggleViewAllResults ? (
        <TestResults results={testResults} showFailed={true}/>
      ) : (
         <div className="flex-1 overflow-auto p-4">
        {displayCases.length === 0 ? (
          <div className="text-slate-400 text-sm text-center py-8">
            No sample test cases available
          </div>
        ) : activeTestCase ? (
          <div className="space-y-4">
            {/* Input */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Input
              </label>
              <pre className="bg-slate-900 border border-slate-700 rounded-md p-3 text-sm font-mono text-slate-200 overflow-x-auto">
                {activeTestCase.input || '(empty)'}
              </pre>
            </div>

            {/* Expected Output */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Expected Output
              </label>
              <pre className="bg-slate-900 border border-slate-700 rounded-md p-3 text-sm font-mono text-slate-200 overflow-x-auto">
                {activeTestCase.expectedOutput || '(empty)'}
              </pre>
            </div>

            {/* Actual Output (shown after running) */}
            {activeResult && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Actual Output
                  <span className={`ml-2 ${activeResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {activeResult.passed ? '✓ Passed' : '✗ Failed'}
                  </span>
                </label>
                <pre className={`border rounded-md p-3 text-sm font-mono overflow-x-auto ${
                  activeResult.passed 
                    ? 'bg-emerald-900/20 border-emerald-700 text-emerald-200' 
                    : 'bg-red-900/20 border-red-700 text-red-200'
                }`}>
                  {activeResult.actual || activeResult.actualOutput || '(empty)'}
                </pre>
                
                {/* Error message if any */}
                {activeResult.error && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-red-400 mb-1.5">
                      Error
                    </label>
                    <pre className="bg-red-900/20 border border-red-700 rounded-md p-3 text-sm font-mono text-red-300 overflow-x-auto whitespace-pre-wrap">
                      {activeResult.error}
                    </pre>
                  </div>
                )}

                {/* Runtime info */}
                {(activeResult.runtime || activeResult.runtimeMs) && (
                  <div className="mt-2 text-xs text-slate-400">
                    Runtime: {activeResult.runtime || activeResult.runtimeMs}ms
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
      ) }

      {/* Summary bar (shown after running) */}
      {testResults.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Sample Tests: 
              <span className={`ml-2 font-medium ${
                testResults.every(r => r.passed) ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testResults.filter(r => r.passed).length} / {testResults.length} passed
              </span>
            </span>
            {testResults.every(r => r.passed) && (
              <span className="text-emerald-400 text-xs">
                ✓ All sample tests passed! Ready to submit.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

TestCasePanel.propTypes = {
  sampleTestCases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      input: PropTypes.string,
      expectedOutput: PropTypes.string,
    })
  ),
  testResults: PropTypes.arrayOf(
    PropTypes.shape({
      passed: PropTypes.bool,
      actual: PropTypes.string,
      actualOutput: PropTypes.string,
      error: PropTypes.string,
      runtime: PropTypes.number,
      runtimeMs: PropTypes.number,
      testCaseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  isRunning: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  onRun: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default TestCasePanel;
