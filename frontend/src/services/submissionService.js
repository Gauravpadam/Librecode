import apiClient from './api';

/**
 * Submission Service
 * Handles submission-related API calls
 */

/**
 * Submit a solution for evaluation
 * @param {Object} submissionData - Submission data
 * @param {number} submissionData.problemId - Problem ID
 * @param {string} submissionData.code - Solution code
 * @param {string} submissionData.language - Programming language (java, python, javascript)
 * @returns {Promise<Object>} Submission result with evaluation
 */
export const submitSolution = async (submissionData) => {
  try {
    const response = await apiClient.post('/submissions', submissionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user submissions with optional filtering
 * @param {Object} filters - Optional filters
 * @param {number} filters.problemId - Filter by problem ID
 * @param {string} filters.status - Filter by status (ACCEPTED, WRONG_ANSWER, TLE, MLE, etc.)
 * @param {string} filters.language - Filter by language
 * @param {number} filters.page - Page number for pagination
 * @param {number} filters.size - Page size for pagination
 * @returns {Promise<Array>} List of submissions
 */
export const getSubmissions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.problemId) {
      params.append('problemId', filters.problemId);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.language) {
      params.append('language', filters.language);
    }
    if (filters.page !== undefined) {
      params.append('page', filters.page);
    }
    if (filters.size !== undefined) {
      params.append('size', filters.size);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/submissions?${queryString}` : '/submissions';
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get submission details by ID
 * @param {number} submissionId - Submission ID
 * @returns {Promise<Object>} Submission details with test results
 */
export const getSubmissionById = async (submissionId) => {
  try {
    const response = await apiClient.get(`/submissions/${submissionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics (solved, attempted, total problems, accuracy, recent submissions)
 */
export const getStats = async () => {
  try {
    const response = await apiClient.get('/users/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get submissions for a specific problem
 * @param {number} problemId - Problem ID
 * @returns {Promise<Array>} List of submissions for the problem
 */
export const getProblemSubmissions = async (problemId) => {
  try {
    const response = await apiClient.get(`/submissions?problemId=${problemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
