import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import StatusBadge from '../common/StatusBadge';
import { getSubmissionById } from '../../services/submissionService';

/**
 * SubmissionItem component for displaying individual submission in the Solutions tab
 * 
 * Features:
 * - Displays submission metadata (timestamp, language, status, runtime, memory)
 * - Expandable/collapsible code view
 * - Fetches full submission details (including code) on expand
 * - Syntax highlighting using react-syntax-highlighter
 * - Color-coded status badges
 * - Monospace font for code (JetBrains Mono)
 */
function SubmissionItem({ submission }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullSubmission, setFullSubmission] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [codeError, setCodeError] = useState(null);

  // Fetch full submission details when expanding
  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      if (isExpanded && !fullSubmission && !loadingCode) {
        try {
          setLoadingCode(true);
          setCodeError(null);
          const details = await getSubmissionById(submission.id);
          setFullSubmission(details);
        } catch (err) {
          console.error('Failed to fetch submission details:', err);
          setCodeError('Failed to load code. Please try again.');
        } finally {
          setLoadingCode(false);
        }
      }
    };

    fetchSubmissionDetails();
  }, [isExpanded, submission.id, fullSubmission, loadingCode]);

  // Format timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  // Map language to syntax highlighter language
  const getLanguageForHighlighter = (lang) => {
    const langMap = {
      'java': 'java',
      'python': 'python',
      'javascript': 'javascript',
      'cpp': 'cpp',
      'c': 'c',
    };
    return langMap[lang?.toLowerCase()] || 'text';
  };

  // Convert memory from KB to MB
  const formatMemory = (memoryKb) => {
    if (memoryKb === null || memoryKb === undefined) return null;
    return (memoryKb / 1024).toFixed(2);
  };

  // Custom syntax highlighter style based on our theme
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#22223b',
      margin: 0,
      padding: '1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontFamily: '"JetBrains Mono", "Fira Code", Monaco, monospace',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      fontFamily: '"JetBrains Mono", "Fira Code", Monaco, monospace',
    },
  };

  return (
    <div className="bg-slate-850 rounded-lg border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-slate-800 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left side - Status and metadata */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={submission.status} />
              <span className="text-slate-400 text-sm">
                {formatDate(submission.submittedAt)}
              </span>
            </div>
            
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="font-mono text-primary capitalize">
                {submission.language}
              </span>
              {submission.runtimeMs !== null && submission.runtimeMs !== undefined && (
                <>
                  <span>•</span>
                  <span>
                    Runtime: <span className="font-mono text-slate-300">{submission.runtimeMs}ms</span>
                  </span>
                </>
              )}
              {submission.memoryKb !== null && submission.memoryKb !== undefined && (
                <>
                  <span>•</span>
                  <span>
                    Memory: <span className="font-mono text-slate-300">{formatMemory(submission.memoryKb)}MB</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right side - Expand/collapse indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">
              {isExpanded ? 'Hide code' : 'View code'}
            </span>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable code section */}
      {isExpanded && (
        <div className="border-t border-slate-700 bg-background">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-300">Submitted Code</h4>
              {fullSubmission && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(fullSubmission.code);
                  }}
                  className="text-xs text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                  title="Copy code"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </button>
              )}
            </div>
            
            {/* Loading state */}
            {loadingCode && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-3 text-slate-400">Loading code...</span>
              </div>
            )}

            {/* Error state */}
            {codeError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400 text-sm">{codeError}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCodeError(null);
                    setFullSubmission(null);
                    setIsExpanded(false);
                    setTimeout(() => setIsExpanded(true), 100);
                  }}
                  className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Code display with syntax highlighting */}
            {fullSubmission && !loadingCode && !codeError && (
              <>
                <div className="rounded-lg overflow-hidden border border-slate-700">
                  <SyntaxHighlighter
                    language={getLanguageForHighlighter(submission.language)}
                    style={customStyle}
                    showLineNumbers
                    wrapLines
                    customStyle={{
                      margin: 0,
                      background: '#22223b',
                    }}
                  >
                    {fullSubmission.code || '// No code available'}
                  </SyntaxHighlighter>
                </div>

                {/* Additional details if available */}
                {fullSubmission.errorMessage && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h5 className="text-sm font-medium text-red-400 mb-2">Error Message</h5>
                    <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                      {fullSubmission.errorMessage}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

SubmissionItem.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    language: PropTypes.string.isRequired,
    submittedAt: PropTypes.string.isRequired,
    runtimeMs: PropTypes.number,
    memoryKb: PropTypes.number,
  }).isRequired,
};

export default SubmissionItem;
