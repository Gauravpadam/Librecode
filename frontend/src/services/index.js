/**
 * API Services Index
 * Central export point for all API services
 */

// Export API client
export { default as apiClient } from './api';

// Export authentication services
export * as authService from './authService';

// Export problem services
export * as problemService from './problemService';

// Export submission services
export * as submissionService from './submissionService';

// Export test case services
export * as testCaseService from './testCaseService';

// Named exports for convenience
export {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getStoredUser,
} from './authService';

export {
  getProblems,
  getProblemById,
  getTestCases,
  createProblem,
} from './problemService';

export {
  submitSolution,
  getSubmissions,
  getSubmissionById,
  getStats,
  getProblemSubmissions,
} from './submissionService';

export {
  addCustomTestCase,
  getCustomTestCases,
  updateTestCase,
  deleteTestCase,
  getAllTestCases,
} from './testCaseService';
