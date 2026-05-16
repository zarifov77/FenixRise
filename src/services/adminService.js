import axios from 'axios';
import api from '../lib/api';

// Import mock service for development
import * as mockService from './mockAdminService';

// Flag to use mock service (set to false when backend is ready)
const USE_MOCK_SERVICE = true;

// Dashboard
export const getDashboardStats = async () => {
  if (USE_MOCK_SERVICE) {
    return mockService.getDashboardStats();
  }
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

// Tests Management
export const getTests = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getTests(params);
  }
  const response = await api.get('/admin/tests', { params });
  return response.data;
};

export const getTest = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getTest(id);
  }
  const response = await api.get(`/admin/tests/${id}`);
  return response.data;
};

export const createTest = async (testData) => {
  if (USE_MOCK_SERVICE) {
    return mockService.createTest(testData);
  }
  const response = await api.post('/admin/tests', testData);
  return response.data;
};

export const updateTest = async (id, testData) => {
  if (USE_MOCK_SERVICE) {
    return mockService.updateTest(id, testData);
  }
  const response = await api.put(`/admin/tests/${id}`, testData);
  return response.data;
};

export const deleteTest = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.deleteTest(id);
  }
  const response = await api.delete(`/admin/tests/${id}`);
  return response.data;
};

// Questions Management
export const getQuestions = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getQuestions(params);
  }
  const response = await api.get('/admin/questions', { params });
  return response.data;
};

export const getQuestion = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getQuestion(id);
  }
  const response = await api.get(`/admin/questions/${id}`);
  return response.data;
};

export const createQuestion = async (questionData) => {
  if (USE_MOCK_SERVICE) {
    return mockService.createQuestion(questionData);
  }
  const response = await api.post('/admin/questions', questionData);
  return response.data;
};

export const updateQuestion = async (id, questionData) => {
  if (USE_MOCK_SERVICE) {
    return mockService.updateQuestion(id, questionData);
  }
  const response = await api.put(`/admin/questions/${id}`, questionData);
  return response.data;
};

export const deleteQuestion = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.deleteQuestion(id);
  }
  const response = await api.delete(`/admin/questions/${id}`);
  return response.data;
};

export const getQuestionsByTest = async (testId) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getQuestionsByTest(testId);
  }
  const response = await api.get(`/admin/tests/${testId}/questions`);
  return response.data;
};

// Users Management
export const getUsers = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getUsers(params);
  }
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getUser = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getUser(id);
  }
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  if (USE_MOCK_SERVICE) {
    return mockService.updateUser(id, userData);
  }
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.deleteUser(id);
  }
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const toggleUserStatus = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.toggleUserStatus(id);
  }
  const response = await api.patch(`/admin/users/${id}/toggle-status`);
  return response.data;
};

// Subscriptions Management
export const getSubscriptions = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getSubscriptions(params);
  }
  const response = await api.get('/admin/subscriptions', { params });
  return response.data;
};

export const getSubscription = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getSubscription(id);
  }
  const response = await api.get(`/admin/subscriptions/${id}`);
  return response.data;
};

export const createSubscription = async (subscriptionData) => {
  if (USE_MOCK_SERVICE) {
    return mockService.createSubscription(subscriptionData);
  }
  const response = await api.post('/admin/subscriptions', subscriptionData);
  return response.data;
};

export const updateSubscription = async (id, subscriptionData) => {
  if (USE_MOCK_SERVICE) {
    return mockService.updateSubscription(id, subscriptionData);
  }
  const response = await api.put(`/admin/subscriptions/${id}`, subscriptionData);
  return response.data;
};

export const deleteSubscription = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.deleteSubscription(id);
  }
  const response = await api.delete(`/admin/subscriptions/${id}`);
  return response.data;
};

export const cancelSubscription = async (id) => {
  if (USE_MOCK_SERVICE) {
    return mockService.cancelSubscription(id);
  }
  const response = await api.patch(`/admin/subscriptions/${id}/cancel`);
  return response.data;
};

// Analytics
export const getAnalytics = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getAnalytics(params);
  }
  const response = await api.get('/admin/analytics', { params });
  return response.data;
};

export const getUserAnalytics = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getUserAnalytics(params);
  }
  const response = await api.get('/admin/analytics/users', { params });
  return response.data;
};

export const getTestAnalytics = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getTestAnalytics(params);
  }
  const response = await api.get('/admin/analytics/tests', { params });
  return response.data;
};

export const getRevenueAnalytics = async (params = {}) => {
  if (USE_MOCK_SERVICE) {
    return mockService.getRevenueAnalytics(params);
  }
  const response = await api.get('/admin/analytics/revenue', { params });
  return response.data;
};

// Subjects and Difficulties (for dropdowns)
export const getSubjects = async () => {
  if (USE_MOCK_SERVICE) {
    return mockService.getSubjects();
  }
  const response = await api.get('/admin/subjects');
  return response.data;
};

export const getDifficulties = async () => {
  if (USE_MOCK_SERVICE) {
    return mockService.getDifficulties();
  }
  const response = await api.get('/admin/difficulties');
  return response.data;
};

export default api;
