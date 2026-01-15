import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ProblemDescription - Tabbed interface for problem details
 * 
 * Features:
 * - Three tabs: Description, Solutions, Submissions
 * - Renders problem description with proper formatting
 * - Monospace font for code blocks
 * - New color scheme applied
 */
function ProblemDescription({ problem, testCases, solutionsTab, submissionsTab }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'submissions', label: 'Submissions' },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tab Headers */}
      <div className="flex border-b border-slate-700 bg-slate-850">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'description' && (
          <DescriptionTab problem={problem} testCases={testCases} />
        )}
        {activeTab === 'solutions' && (
          <div className="p-6">
            {solutionsTab || (
              <div className="text-slate-400 text-center py-8">
                Solutions tab content will be implemented in task 12-13
              </div>
            )}
          </div>
        )}
        {activeTab === 'submissions' && (
          <div className="p-6">
            {submissionsTab || (
              <div className="text-slate-400 text-center py-8">
                Submissions tab content will be implemented in task 12-13
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DescriptionTab - Displays problem description, constraints, and examples
 */
function DescriptionTab({ problem, testCases }) {
  if (!problem) {
    return (
      <div className="p-6 text-slate-400">
        Loading problem details...
      </div>
    );
  }

  const sampleTestCases = testCases?.filter(tc => tc.isSample) || [];

  return (
    <div className="p-6 text-textLight">
      {/* Problem Title */}
      <h2 className="text-3xl font-bold mb-6 text-slate-50">{problem.title}</h2>
      
      {/* Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-slate-100">Description</h3>
        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
          {problem.description}
        </div>
      </div>

      {/* Constraints */}
      {problem.constraints && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-slate-100">Constraints</h3>
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-sm bg-slate-850 p-4 rounded-lg border border-slate-700">
            {problem.constraints}
          </div>
        </div>
      )}

      {/* Time and Memory Limits */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-slate-100">Limits</h3>
        <div className="text-slate-300 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">Time Limit:</span>
            <span className="font-mono text-primary">{problem.timeLimitMs}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">Memory Limit:</span>
            <span className="font-mono text-primary">{problem.memoryLimitMb}MB</span>
          </div>
        </div>
      </div>

      {/* Example Test Cases */}
      {sampleTestCases.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-slate-100">Examples</h3>
          <div className="space-y-4">
            {sampleTestCases.map((testCase, index) => (
              <div 
                key={testCase.id} 
                className="bg-slate-850 p-5 rounded-lg border border-slate-700"
              >
                <p className="font-semibold mb-3 text-slate-200">
                  Example {index + 1}
                </p>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm text-slate-400 block mb-1">
                      Input:
                    </span>
                    <pre className="bg-slate-900 p-3 rounded border border-slate-700 text-sm overflow-x-auto font-mono text-slate-200">
                      {testCase.input}
                    </pre>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-slate-400 block mb-1">
                      Expected Output:
                    </span>
                    <pre className="bg-slate-900 p-3 rounded border border-slate-700 text-sm overflow-x-auto font-mono text-slate-200">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                  {testCase.explanation && (
                    <div>
                      <span className="font-medium text-sm text-slate-400 block mb-1">
                        Explanation:
                      </span>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {testCase.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags (if available) */}
      {problem.tags && problem.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-slate-100">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700 hover:border-primary transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ProblemDescription.propTypes = {
  problem: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    constraints: PropTypes.string,
    timeLimitMs: PropTypes.number,
    memoryLimitMb: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  testCases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      input: PropTypes.string,
      expectedOutput: PropTypes.string,
      explanation: PropTypes.string,
      isSample: PropTypes.bool,
    })
  ),
  solutionsTab: PropTypes.node,
  submissionsTab: PropTypes.node,
};

DescriptionTab.propTypes = {
  problem: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    constraints: PropTypes.string,
    timeLimitMs: PropTypes.number,
    memoryLimitMb: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  testCases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      input: PropTypes.string,
      expectedOutput: PropTypes.string,
      explanation: PropTypes.string,
      isSample: PropTypes.bool,
    })
  ),
};

export default ProblemDescription;
