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
      <div className="p-4 text-center text-gray-600">
        Loading test cases...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Cases</h3>
        <button
          onClick={startAdd}
          className="btn-primary text-sm"
          disabled={showAddForm || editingTestCase}
        >
          + Add Custom Test Case
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingTestCase) && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h4 className="font-semibold mb-3">
            {editingTestCase ? 'Edit Custom Test Case' : 'Add Custom Test Case'}
          </h4>
          <form onSubmit={editingTestCase ? handleEditTestCase : handleAddTestCase}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
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
          <h4 className="font-medium text-gray-700 mb-2">Default Test Cases</h4>
          <div className="space-y-2">
            {defaultTestCases.map((testCase, index) => {
              const result = getTestCaseResult(testCase.id, false);
              return (
                <div
                  key={testCase.id}
                  className={`border rounded p-3 ${
                    result
                      ? result.passed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      Test Case {index + 1}
                      {testCase.isSample && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Sample
                        </span>
                      )}
                    </span>
                    {result && (
                      <span className={result.passed ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                        {result.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Input:</span>
                      <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-gray-200">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expected Output:</span>
                      <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-gray-200">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                    {result && !result.passed && result.actualOutput && (
                      <div>
                        <span className="font-medium text-red-700">Actual Output:</span>
                        <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-red-300">
                          {result.actualOutput}
                        </pre>
                      </div>
                    )}
                    {result && result.errorMessage && (
                      <div>
                        <span className="font-medium text-red-700">Error:</span>
                        <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-red-300 text-red-600">
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
          <h4 className="font-medium text-gray-700 mb-2">Custom Test Cases</h4>
          <div className="space-y-2">
            {customTestCases.map((testCase, index) => {
              const result = getTestCaseResult(testCase.id, true);
              return (
                <div
                  key={testCase.id}
                  className={`border rounded p-3 ${
                    result
                      ? result.passed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                      : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      Custom Test Case {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {result && (
                        <span className={result.passed ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                          {result.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      )}
                      <button
                        onClick={() => startEdit(testCase)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        disabled={showAddForm || editingTestCase}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(testCase.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={showAddForm || editingTestCase}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Input:</span>
                      <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-gray-200">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expected Output:</span>
                      <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-gray-200">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                    {result && !result.passed && result.actualOutput && (
                      <div>
                        <span className="font-medium text-red-700">Actual Output:</span>
                        <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-red-300">
                          {result.actualOutput}
                        </pre>
                      </div>
                    )}
                    {result && result.errorMessage && (
                      <div>
                        <span className="font-medium text-red-700">Error:</span>
                        <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto border border-red-300 text-red-600">
                          {result.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === testCase.id && (
                    <div className="mt-3 p-3 bg-white border border-red-300 rounded">
                      <p className="text-sm text-gray-700 mb-2">
                        Are you sure you want to delete this test case?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteTestCase(testCase.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
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
        <div className="text-center py-4 text-gray-500 text-sm">
          No custom test cases yet. Add one to test your solution with custom inputs.
        </div>
      )}
    </div>
  );
}

export default TestCaseManager;
