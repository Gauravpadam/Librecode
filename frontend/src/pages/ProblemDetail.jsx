import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Editor from '@monaco-editor/react';
import TestCaseManager from '../components/TestCaseManager';

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
  const [theme, setTheme] = useState('vs-dark');
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
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'text-green-600';
      case 'wrong_answer':
        return 'text-red-600';
      case 'time_limit_exceeded':
        return 'text-orange-600';
      case 'memory_limit_exceeded':
        return 'text-purple-600';
      case 'compilation_error':
      case 'runtime_error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading problem...</div>
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
          <button onClick={() => navigate('/problems')} className="btn-primary mt-4">
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/problems')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">{problem?.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem?.difficulty)}`}>
              {problem?.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="input-field py-1.5"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <button
              onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              {theme === 'vs-dark' ? '☀️ Light' : '🌙 Dark'}
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
          className="flex flex-col overflow-hidden bg-white border-r border-gray-200"
          style={{ width: `${splitPosition}%` }}
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'testcases'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Test Cases
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'description' ? (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{problem?.title}</h2>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{problem?.description}</div>
                </div>

                {/* Constraints */}
                {problem?.constraints && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Constraints</h3>
                    <div className="text-gray-700 whitespace-pre-wrap">{problem?.constraints}</div>
                  </div>
                )}

                {/* Time and Memory Limits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Limits</h3>
                  <div className="text-gray-700">
                    <p>Time Limit: {problem?.timeLimitMs}ms</p>
                    <p>Memory Limit: {problem?.memoryLimitMb}MB</p>
                  </div>
                </div>

                {/* Example Test Cases */}
                {testCases.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Example Test Cases</h3>
                    <div className="space-y-4">
                      {testCases.filter(tc => tc.isSample).map((testCase, index) => (
                        <div key={testCase.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                          <p className="font-medium mb-2">Example {index + 1}</p>
                          <div className="mb-2">
                            <span className="font-medium text-sm">Input:</span>
                            <pre className="bg-white p-2 rounded mt-1 text-sm overflow-x-auto">{testCase.input}</pre>
                          </div>
                          <div>
                            <span className="font-medium text-sm">Expected Output:</span>
                            <pre className="bg-white p-2 rounded mt-1 text-sm overflow-x-auto">{testCase.expectedOutput}</pre>
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
          className="w-1 bg-gray-300 hover:bg-primary-500 cursor-col-resize"
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel - Code Editor and Results */}
        <div
          className="flex flex-col overflow-hidden"
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
            <div className="border-t border-gray-200 bg-white p-4 overflow-y-auto max-h-64">
              <div className="mb-3">
                <h3 className="text-lg font-semibold mb-2">Submission Results</h3>
                <div className="flex items-center gap-4">
                  <span className={`font-semibold ${getStatusColor(submissionResult.status)}`}>
                    {formatStatus(submissionResult.status)}
                  </span>
                  {submissionResult.runtimeMs !== null && (
                    <span className="text-sm text-gray-600">
                      Runtime: {submissionResult.runtimeMs}ms
                    </span>
                  )}
                  {submissionResult.memoryKb !== null && (
                    <span className="text-sm text-gray-600">
                      Memory: {(submissionResult.memoryKb / 1024).toFixed(2)}MB
                    </span>
                  )}
                </div>
              </div>

              {/* Test Results */}
              {submissionResult.testResults && submissionResult.testResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Passed: {submissionResult.testResults.filter(tr => tr.passed).length} / {submissionResult.testResults.length}
                  </p>
                  {submissionResult.testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        result.passed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          Test Case {index + 1}
                        </span>
                        <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                          {result.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </div>
                      {!result.passed && (
                        <div className="text-sm mt-2 space-y-1">
                          {result.input && (
                            <div>
                              <span className="font-medium">Input:</span>
                              <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">{result.input}</pre>
                            </div>
                          )}
                          {result.expectedOutput && (
                            <div>
                              <span className="font-medium">Expected:</span>
                              <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">{result.expectedOutput}</pre>
                            </div>
                          )}
                          {result.actualOutput && (
                            <div>
                              <span className="font-medium">Actual:</span>
                              <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">{result.actualOutput}</pre>
                            </div>
                          )}
                          {result.errorMessage && (
                            <div>
                              <span className="font-medium text-red-600">Error:</span>
                              <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto text-red-600">{result.errorMessage}</pre>
                            </div>
                          )}
                        </div>
                      )}
                      {result.runtimeMs !== null && (
                        <div className="text-xs text-gray-600 mt-1">
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
