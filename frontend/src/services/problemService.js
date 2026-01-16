import apiClient from './api';

/**
 * Problem Service
 * Handles problem-related API calls
 */

/**
 * Get all problems with optional filtering
 * @param {Object} filters - Optional filters
 * @param {string} filters.difficulty - Filter by difficulty (EASY, MEDIUM, HARD)
 * @param {Array<string>} filters.tags - Filter by tags (OR logic)
 * @param {string} filters.search - Search by title
 * @returns {Promise<Array>} List of problems
 */
export const getProblems = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.difficulty) {
      params.append('difficulty', filters.difficulty);
    }
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/problems?${queryString}` : '/problems';
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get problem details by ID
 * @param {number} problemId - Problem ID
 * @returns {Promise<Object>} Problem details
 */
export const getProblemById = async (problemId) => {
  try {
    const response = await apiClient.get(`/problems/${problemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get test cases for a problem
 * @param {number} problemId - Problem ID
 * @returns {Promise<Array>} List of test cases
 */
export const getTestCases = async (problemId) => {
  try {
    const response = await apiClient.get(`/problems/${problemId}/testcases`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new problem (admin only)
 * @param {Object} problemData - Problem data
 * @param {string} problemData.title - Problem title
 * @param {string} problemData.description - Problem description
 * @param {string} problemData.constraints - Problem constraints
 * @param {string} problemData.difficulty - Difficulty level
 * @param {number} problemData.timeLimitMs - Time limit in milliseconds
 * @param {number} problemData.memoryLimitMb - Memory limit in MB
 * @param {string} problemData.starterCodeJava - Java starter code
 * @param {string} problemData.starterCodePython - Python starter code
 * @param {string} problemData.starterCodeJavascript - JavaScript starter code
 * @param {Array} problemData.testCases - Test cases
 * @returns {Promise<Object>} Created problem
 */
export const createProblem = async (problemData) => {
  try {
    const response = await apiClient.post('/problems', problemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
