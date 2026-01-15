import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Editor from '@monaco-editor/react';
import TestCaseManager from '../components/TestCaseManager';
import { defineLocalcodeTheme } from '../styles/editor-theme';

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [splitPosition, setSplitPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [theme, setTheme] = useState('localcode-dark');
  const [activeTab, setActiveTab] = useState('description'); // 'description' or 'testcases'

  // Language configurations
  const languages = [
    { value: 'java', label: 'Java', monacoLang: 'java' },
    { value: 'python', label: 'Python', monacoLang: 'python' },
    { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' }
  ];

  useEffect(() => {
    fetchProblemDetails();
    fetchTestCases();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem(`problem_${id}_${selectedLanguage}`);
    if (savedCode) {
      setCode(savedCode);
    } else if (problem) {
      loadStarterCode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, problem, id]);

  useEffect(() => {
    // Auto-save code to localStorage
    if (code && problem) {
      localStorage.setItem(`problem_${id}_${selectedLanguage}`, code);
    }
  }, [code, id, selectedLanguage, problem]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(API_ENDPOINTS.PROBLEM_DETAIL(id));
      setProblem(response.data);
      loadStarterCodeFromProblem(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load problem details');
      console.error('Error fetching problem:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestCases = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PROBLEM_TESTCASES(id));
      setTestCases(response.data);
    } catch (err) {
      console.error('Error fetching test cases:', err);
    }
  };

  const loadStarterCodeFromProblem = (problemData) => {
    const savedCode = localStorage.getItem(`problem_${id}_${selectedLanguage}`);
    if (!savedCode) {
      const starterCode = getStarterCode(problemData, selectedLanguage);
      setCode(starterCode);
    }
  };

  const loadStarterCode = () => {
    if (problem) {
      const starterCode = getStarterCode(problem, selectedLanguage);
      setCode(starterCode);
    }
  };

  const getStarterCode = (problemData, language) => {
    switch (language) {
      case 'java':
        return problemData.starterCodeJava || '// Write your Java code here\n';
      case 'python':
        return problemData.starterCodePython || '# Write your Python code here\n';
      case 'javascript':
        return problemData.starterCodeJavascript || '// Write your JavaScript code here\n';
      default:
        return '';
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setSubmissionResult(null);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    try {
      setSubmitting(true);
      setSubmissionResult(null);
      
      const response = await api.post(API_ENDPOINTS.SUBMISSIONS, {
        problemId: parseInt(id),
        code: code,
        language: selectedLanguage
      });

      setSubmissionResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit solution');
      console.error('Error submitting solution:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const container = document.getElementById('split-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
        setSplitPosition(Math.max(20, Math.min(80, newPosition)));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-900/30 text-emerald-400 border border-emerald-700';
      case 'medium':
        return 'bg-amber-900/30 text-amber-400 border border-amber-700';
      case 'hard':
        return 'bg-red-900/30 text-red-400 border border-red-700';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'text-emerald-400';
      case 'wrong_answer':
        return 'text-red-400';
      case 'time_limit_exceeded':
        return 'text-amber-400';
      case 'memory_limit_exceeded':
        return 'text-purple-400';
      case 'compilation_error':
      case 'runtime_error':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-slate-400">Loading problem...</div>
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <p className="text-red-400">{error}</p>
            <button onClick={() => navigate('/problems')} className="btn-primary mt-4">
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-slate-850 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/problems')}
              className="text-slate-400 hover:text-primary transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-slate-50">{problem?.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem?.difficulty)}`}>
              {problem?.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <button
              onClick={() => setTheme(theme === 'localcode-dark' ? 'vs-dark' : 'localcode-dark')}
              className="px-3 py-1.5 text-sm border border-slate-700 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              {theme === 'localcode-dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* Split Pane Container */}
      <div
        id="split-container"
        className="flex-1 flex overflow-hidden"
        style={{ cursor: isDragging ? 'col-resize' : 'default' }}
      >
        {/* Left Panel - Problem Description and Test Cases */}
        <div
          className="flex flex-col overflow-hidden bg-background border-r border-slate-700"
          style={{ width: `${splitPosition}%` }}
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-850">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'testcases'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Cases
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-background">
            {activeTab === 'description' ? (
              <div className="p-6 text-textLight">
                <h2 className="text-3xl font-bold mb-6 text-slate-50">{problem?.title}</h2>
                
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-slate-100">Description</h3>
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{problem?.description}</div>
                </div>

                {/* Constraints */}
                {problem?.constraints && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3 text-slate-100">Constraints</h3>
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-sm bg-slate-850 p-4 rounded-lg border border-slate-700">{problem?.constraints}</div>
                  </div>
                )}

                {/* Time and Memory Limits */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-slate-100">Limits</h3>
                  <div className="text-slate-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">Time Limit:</span>
                      <span className="font-mono text-primary">{problem?.timeLimitMs}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">Memory Limit:</span>
                      <span className="font-mono text-primary">{problem?.memoryLimitMb}MB</span>
                    </div>
                  </div>
                </div>

                {/* Example Test Cases */}
                {testCases.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3 text-slate-100">Examples</h3>
                    <div className="space-y-4">
                      {testCases.filter(tc => tc.isSample).map((testCase, index) => (
                        <div key={testCase.id} className="bg-slate-850 p-5 rounded-lg border border-slate-700">
                          <p className="font-semibold mb-3 text-slate-200">Example {index + 1}</p>
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium text-sm text-slate-400 block mb-1">Input:</span>
                              <pre className="bg-slate-900 p-3 rounded border border-slate-700 text-sm overflow-x-auto font-mono text-slate-200">{testCase.input}</pre>
                            </div>
                            <div>
                              <span className="font-medium text-sm text-slate-400 block mb-1">Expected Output:</span>
                              <pre className="bg-slate-900 p-3 rounded border border-slate-700 text-sm overflow-x-auto font-mono text-slate-200">{testCase.expectedOutput}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <TestCaseManager problemId={id} submissionResult={submissionResult} />
            )}
          </div>
        </div>

        {/* Resizer */}
        <div
          className="w-1 bg-slate-700 hover:bg-primary cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel - Code Editor and Results */}
        <div
          className="flex flex-col overflow-hidden bg-slate-850"
          style={{ width: `${100 - splitPosition}%` }}
        >
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={languages.find(l => l.value === selectedLanguage)?.monacoLang}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme}
              onMount={(editor, monaco) => {
                defineLocalcodeTheme(monaco);
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Submission Results */}
          {submissionResult && (
            <div className="border-t border-slate-700 bg-slate-850 p-4 overflow-y-auto max-h-64">
              <div className="mb-3">
                <h3 className="text-lg font-semibold mb-2 text-slate-100">Submission Results</h3>
                <div className="flex items-center gap-4">
                  <span className={`font-semibold ${getStatusColor(submissionResult.status)}`}>
                    {formatStatus(submissionResult.status)}
                  </span>
                  {submissionResult.runtimeMs !== null && (
                    <span className="text-sm text-slate-400">
                      Runtime: {submissionResult.runtimeMs}ms
                    </span>
                  )}
                  {submissionResult.memoryKb !== null && (
                    <span className="text-sm text-slate-400">
                      Memory: {(submissionResult.memoryKb / 1024).toFixed(2)}MB
                    </span>
                  )}
                </div>
              </div>

              {/* Test Results */}
              {submissionResult.testResults && submissionResult.testResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">
                    Passed: {submissionResult.testResults.filter(tr => tr.passed).length} / {submissionResult.testResults.length}
                  </p>
                  {submissionResult.testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        result.passed
                          ? 'bg-emerald-900/20 border-emerald-700'
                          : 'bg-red-900/20 border-red-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-slate-200">
                          Test Case {index + 1}
                        </span>
                        <span className={result.passed ? 'text-emerald-400' : 'text-red-400'}>
                          {result.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </div>
                      {!result.passed && (
                        <div className="text-sm mt-2 space-y-1">
                          {result.input && (
                            <div>
                              <span className="font-medium text-slate-300">Input:</span>
                              <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto font-mono text-slate-200 border border-slate-700">{result.input}</pre>
                            </div>
                          )}
                          {result.expectedOutput && (
                            <div>
                              <span className="font-medium text-slate-300">Expected:</span>
                              <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto font-mono text-slate-200 border border-slate-700">{result.expectedOutput}</pre>
                            </div>
                          )}
                          {result.actualOutput && (
                            <div>
                              <span className="font-medium text-slate-300">Actual:</span>
                              <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto font-mono text-slate-200 border border-slate-700">{result.actualOutput}</pre>
                            </div>
                          )}
                          {result.errorMessage && (
                            <div>
                              <span className="font-medium text-red-400">Error:</span>
                              <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto font-mono text-red-400 border border-slate-700">{result.errorMessage}</pre>
                            </div>
                          )}
                        </div>
                      )}
                      {result.runtimeMs !== null && (
                        <div className="text-xs text-slate-400 mt-1">
                          Runtime: {result.runtimeMs}ms
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
