export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  
  // Problems
  PROBLEMS: '/problems',
  PROBLEM_DETAIL: (id) => `/problems/${id}`,
  PROBLEM_TESTCASES: (id) => `/problems/${id}/testcases`,
  PROBLEM_CUSTOM_TESTCASES: (id) => `/problems/${id}/testcases/custom`,
  
  // Submissions
  SUBMISSIONS: '/submissions',
  SUBMISSIONS_RUN: '/submissions/run',  // Run against sample test cases only
  SUBMISSION_DETAIL: (id) => `/submissions/${id}`,
  SUBMISSION_STATS: '/submissions/stats',
  
  // Test Cases
  TESTCASE_UPDATE: (id) => `/testcases/${id}`,
  TESTCASE_DELETE: (id) => `/testcases/${id}`,
};
