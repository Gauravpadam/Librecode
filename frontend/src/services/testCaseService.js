import apiClient from './api';

/**
 * Test Case Service
 * Handles custom test case management API calls
 */

/**
 * Add a custom test case to a problem
 * @param {number} problemId - Problem ID
 * @param {Object} testCaseData - Test case data
 * @param {string} testCaseData.input - Test case input
 * @param {string} testCaseData.expectedOutput - Expected output
 * @returns {Promise<Object>} Created test case
 */
export const addCustomTestCase = async (problemId, testCaseData) => {
  try {
    const response = await apiClient.post(
      `/problems/${problemId}/testcases`,
      testCaseData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get custom test cases for a problem
 * @param {number} problemId - Problem ID
 * @returns {Promise<Array>} List of custom test cases
 */
export const getCustomTestCases = async (problemId) => {
  try {
    const response = await apiClient.get(
      `/problems/${problemId}/testcases/custom`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a custom test case
 * @param {number} testCaseId - Test case ID
 * @param {Object} testCaseData - Updated test case data
 * @param {string} testCaseData.input - Test case input
 * @param {string} testCaseData.expectedOutput - Expected output
 * @returns {Promise<Object>} Updated test case
 */
export const updateTestCase = async (testCaseId, testCaseData) => {
  try {
    const response = await apiClient.put(
      `/testcases/${testCaseId}`,
      testCaseData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a custom test case
 * @param {number} testCaseId - Test case ID
 * @returns {Promise<void>}
 */
export const deleteTestCase = async (testCaseId) => {
  try {
    await apiClient.delete(`/testcases/${testCaseId}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all test cases (default + custom) for a problem
 * @param {number} problemId - Problem ID
 * @returns {Promise<Object>} Object with default and custom test cases
 */
export const getAllTestCases = async (problemId) => {
  try {
    const [defaultTestCases, customTestCases] = await Promise.all([
      apiClient.get(`/problems/${problemId}/testcases`),
      apiClient.get(`/problems/${problemId}/testcases/custom`).catch(() => ({ data: [] }))
    ]);
    
    return {
      default: defaultTestCases.data,
      custom: customTestCases.data,
    };
  } catch (error) {
    throw error;
  }
};
