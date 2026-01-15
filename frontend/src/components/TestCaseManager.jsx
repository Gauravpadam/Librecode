import { useState, useEffect } from 'react';
import { api } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

function TestCaseManager({ problemId, submissionResult }) {
  const [defaultTestCases, setDefaultTestCases] = useState([]);
  const [customTestCases, setCustomTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    input: '',
    expectedOutput: ''
  });

  useEffect(() => {
    fetchTestCases();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch default test cases
      const defaultResponse = await api.get(API_ENDPOINTS.PROBLEM_TESTCASES(problemId));
      setDefaultTestCases(defaultResponse.data);
      
      // Fetch custom test cases
      const customResponse = await api.get(API_ENDPOINTS.PROBLEM_CUSTOM_TESTCASES(problemId));
      setCustomTestCases(customResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load test cases');
      console.error('Error fetching test cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    
    if (!formData.input.trim() || !formData.expectedOutput.trim()) {
      alert('Please provide both input and expected output');
      return;
    }

    try {
      await api.post(API_ENDPOINTS.PROBLEM_CUSTOM_TESTCASES(problemId), formData);
      
      // Reset form and refresh test cases
      setFormData({ input: '', expectedOutput: '' });
      setShowAddForm(false);
      fetchTestCases();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add test case');
      console.error('Error adding test case:', err);
    }
  };

  const handleEditTestCase = async (e) => {
    e.preventDefault();
    
    if (!formData.input.trim() || !formData.expectedOutput.trim()) {
      alert('Please provide both input and expected output');
      return;
    }

    try {
      await api.put(API_ENDPOINTS.TESTCASE_UPDATE(editingTestCase.id), formData);
      
      // Reset form and refresh test cases
      setFormData({ input: '', expectedOutput: '' });
      setEditingTestCase(null);
      fetchTestCases();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update test case');
      console.error('Error updating test case:', err);
    }
  };

  const handleDeleteTestCase = async (testCaseId) => {
    try {
      await api.delete(API_ENDPOINTS.TESTCASE_DELETE(testCaseId));
      setDeleteConfirm(null);
      fetchTestCases();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete test case');
      console.error('Error deleting test case:', err);
    }
  };

  const startEdit = (testCase) => {
    setEditingTestCase(testCase);
    setFormData({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingTestCase(null);
    setFormData({ input: '', expectedOutput: '' });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingTestCase(null);
    setFormData({ input: '', expectedOutput: '' });
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({ input: '', expectedOutput: '' });
  };

  const getTestCaseResult = (testCaseId, isCustomTestCase) => {
    if (!submissionResult || !submissionResult.testResults) return null;
    
    // Find the result for this test case
    return submissionResult.testResults.find(result => {
      return result.testCaseId === testCaseId && result.isCustom === isCustomTestCase;
    });
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-slate-400">
        Loading test cases...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Test Cases</h3>
        <button
          onClick={startAdd}
          className="btn-primary text-sm"
          disabled={showAddForm || editingTestCase}
        >
          + Add Custom Test Case
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingTestCase) && (
        <div className="bg-slate-850 border border-slate-700 rounded p-4">
          <h4 className="font-semibold mb-3 text-slate-100">
            {editingTestCase ? 'Edit Custom Test Case' : 'Add Custom Test Case'}
          </h4>
          <form onSubmit={editingTestCase ? handleEditTestCase : handleAddTestCase}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Input
                </label>
                <textarea
                  value={formData.input}
                  onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                  className="input-field w-full font-mono text-sm"
                  rows="3"
                  placeholder="Enter test case input..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Expected Output
                </label>
                <textarea
                  value={formData.expectedOutput}
                  onChange={(e) => setFormData({ ...formData, expectedOutput: e.target.value })}
                  className="input-field w-full font-mono text-sm"
                  rows="3"
                  placeholder="Enter expected output..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm">
                  {editingTestCase ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={editingTestCase ? cancelEdit : cancelAdd}
                  className="px-3 py-1.5 text-sm border border-slate-700 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Default Test Cases */}
      {defaultTestCases.length > 0 && (
        <div>
          <h4 className="font-medium text-slate-300 mb-2">Default Test Cases</h4>
          <div className="space-y-2">
            {defaultTestCases.map((testCase, index) => {
              const result = getTestCaseResult(testCase.id, false);
              return (
                <div
                  key={testCase.id}
                  className={`border rounded p-3 ${
                    result
                      ? result.passed
                        ? 'bg-emerald-900/20 border-emerald-700'
                        : 'bg-red-900/20 border-red-700'
                      : 'bg-slate-850 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-slate-200">
                      Test Case {index + 1}
                      {testCase.isSample && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">
                          Sample
                        </span>
                      )}
                    </span>
                    {result && (
                      <span className={result.passed ? 'text-emerald-400 text-sm' : 'text-red-400 text-sm'}>
                        {result.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-slate-400">Input:</span>
                      <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-slate-700 font-mono text-slate-200">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium text-slate-400">Expected Output:</span>
                      <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-slate-700 font-mono text-slate-200">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                    {result && !result.passed && result.actualOutput && (
                      <div>
                        <span className="font-medium text-red-400">Actual Output:</span>
                        <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-red-700 font-mono text-slate-200">
                          {result.actualOutput}
                        </pre>
                      </div>
                    )}
                    {result && result.errorMessage && (
                      <div>
                        <span className="font-medium text-red-400">Error:</span>
                        <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-red-700 font-mono text-red-400">
                          {result.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Test Cases */}
      {customTestCases.length > 0 && (
        <div>
          <h4 className="font-medium text-slate-300 mb-2">Custom Test Cases</h4>
          <div className="space-y-2">
            {customTestCases.map((testCase, index) => {
              const result = getTestCaseResult(testCase.id, true);
              return (
                <div
                  key={testCase.id}
                  className={`border rounded p-3 ${
                    result
                      ? result.passed
                        ? 'bg-emerald-900/20 border-emerald-700'
                        : 'bg-red-900/20 border-red-700'
                      : 'bg-purple-900/20 border-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-slate-200">
                      Custom Test Case {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {result && (
                        <span className={result.passed ? 'text-emerald-400 text-sm' : 'text-red-400 text-sm'}>
                          {result.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      )}
                      <button
                        onClick={() => startEdit(testCase)}
                        className="text-primary hover:text-primary/80 text-sm transition-colors"
                        disabled={showAddForm || editingTestCase}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(testCase.id)}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                        disabled={showAddForm || editingTestCase}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-slate-400">Input:</span>
                      <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-slate-700 font-mono text-slate-200">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium text-slate-400">Expected Output:</span>
                      <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-slate-700 font-mono text-slate-200">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                    {result && !result.passed && result.actualOutput && (
                      <div>
                        <span className="font-medium text-red-400">Actual Output:</span>
                        <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-red-700 font-mono text-slate-200">
                          {result.actualOutput}
                        </pre>
                      </div>
                    )}
                    {result && result.errorMessage && (
                      <div>
                        <span className="font-medium text-red-400">Error:</span>
                        <pre className="bg-slate-900 p-2 rounded mt-1 text-xs overflow-x-auto border border-red-700 font-mono text-red-400">
                          {result.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === testCase.id && (
                    <div className="mt-3 p-3 bg-slate-900 border border-red-700 rounded">
                      <p className="text-sm text-slate-300 mb-2">
                        Are you sure you want to delete this test case?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteTestCase(testCase.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 text-sm border border-slate-700 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {customTestCases.length === 0 && !showAddForm && (
        <div className="text-center py-4 text-slate-500 text-sm">
          No custom test cases yet. Add one to test your solution with custom inputs.
        </div>
      )}
    </div>
  );
}

export default TestCaseManager;
