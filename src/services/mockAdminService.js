// Mock admin service for development when backend is not available
// This provides sample data for all admin endpoints

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockDashboardStats = {
  totalUsers: 1248,
  totalTests: 45,
  totalQuestions: 1250,
  activeSubscriptions: 324,
  userGrowth: 12.5,
  testGrowth: 8.3,
  questionGrowth: 15.2,
  subscriptionGrowth: 6.7,
  recentActivity: [
    {
      type: 'user',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '2 hours ago'
    },
    {
      type: 'test',
      title: 'Test completed',
      description: 'Mathematics Basics test finished',
      time: '3 hours ago'
    },
    {
      type: 'subscription',
      title: 'New subscription',
      description: 'Premium plan purchased',
      time: '5 hours ago'
    }
  ],
  revenueData: {
    total: 15678,
    growth: 18.2
  }
};

const mockTests = [
  {
    id: 1,
    title: 'Mathematics Basics',
    description: 'Fundamental mathematics concepts and problem-solving',
    subject: 'mathematics',
    difficulty: 'easy',
    duration: 60,
    maxAttempts: 3,
    passingScore: 70,
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Advanced Physics',
    description: 'Complex physics problems and theories',
    subject: 'science',
    difficulty: 'hard',
    duration: 90,
    maxAttempts: 2,
    passingScore: 80,
    isActive: true,
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    title: 'English Grammar',
    description: 'Comprehensive grammar and writing skills',
    subject: 'english',
    difficulty: 'medium',
    duration: 45,
    maxAttempts: 5,
    passingScore: 75,
    isActive: false,
    createdAt: '2024-01-05'
  }
];

const mockQuestions = [
  {
    id: 1,
    questionText: 'What is 2 + 2?',
    explanation: 'Basic addition: 2 + 2 = 4',
    subject: 'mathematics',
    difficulty: 'easy',
    type: 'multiple-choice',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    points: 1,
    tags: ['basic', 'addition']
  },
  {
    id: 2,
    questionText: 'What is the capital of France?',
    explanation: 'Paris is the capital city of France',
    subject: 'geography',
    difficulty: 'easy',
    type: 'multiple-choice',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris',
    points: 1,
    tags: ['geography', 'capitals']
  }
];

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    subscription: 'premium',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'teacher',
    subscription: 'basic',
    isActive: true,
    createdAt: '2024-01-02'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    subscription: 'enterprise',
    isActive: true,
    createdAt: '2024-01-01'
  }
];

const mockSubscriptions = [
  {
    id: 1,
    name: 'Free Plan',
    description: 'Basic access with limited features',
    price: 0,
    billingCycle: 'monthly',
    features: ['Access to free tests', 'Basic analytics'],
    maxTests: 5,
    maxQuestions: 50,
    isActive: true,
    userCount: 456
  },
  {
    id: 2,
    name: 'Premium Plan',
    description: 'Full access to all features',
    price: 29.99,
    billingCycle: 'monthly',
    features: ['Unlimited tests', 'Advanced analytics', 'Priority support'],
    maxTests: 0,
    maxQuestions: 0,
    isActive: true,
    userCount: 234
  }
];

const mockAnalytics = {
  overview: {
    totalUsers: 1248,
    activeUsers: 856,
    newUsers: 127,
    totalRevenue: 15678,
    totalTests: 45,
    completedTests: 1234,
    averageScore: 78.5,
    conversionRate: 12.3
  },
  userGrowth: [
    { date: '2024-01-01', users: 1000, newUsers: 20 },
    { date: '2024-01-02', users: 1020, newUsers: 25 },
    { date: '2024-01-03', users: 1045, newUsers: 18 },
    { date: '2024-01-04', users: 1063, newUsers: 30 },
    { date: '2024-01-05', users: 1093, newUsers: 22 },
    { date: '2024-01-06', users: 1115, newUsers: 28 },
    { date: '2024-01-07', users: 1143, newUsers: 35 },
  ],
  testPerformance: [
    { subject: 'Mathematics', averageScore: 82, totalAttempts: 342 },
    { subject: 'Science', averageScore: 76, totalAttempts: 289 },
    { subject: 'English', averageScore: 79, totalAttempts: 198 },
    { subject: 'History', averageScore: 71, totalAttempts: 156 },
    { subject: 'Geography', averageScore: 85, totalAttempts: 134 },
  ]
};

// Mock API functions
export const getDashboardStats = async () => {
  await delay(500);
  return mockDashboardStats;
};

export const getTests = async (params = {}) => {
  await delay(300);
  let filtered = [...mockTests];
  
  if (params.search) {
    filtered = filtered.filter(test => 
      test.title.toLowerCase().includes(params.search.toLowerCase()) ||
      test.description.toLowerCase().includes(params.search.toLowerCase())
    );
  }
  
  if (params.subject) {
    filtered = filtered.filter(test => test.subject === params.subject);
  }
  
  if (params.difficulty) {
    filtered = filtered.filter(test => test.difficulty === params.difficulty);
  }
  
  return filtered;
};

export const createTest = async (testData) => {
  await delay(300);
  const newTest = {
    id: mockTests.length + 1,
    ...testData,
    createdAt: new Date().toISOString().split('T')[0]
  };
  mockTests.push(newTest);
  return newTest;
};

export const updateTest = async (id, testData) => {
  await delay(300);
  const index = mockTests.findIndex(test => test.id === parseInt(id));
  if (index !== -1) {
    mockTests[index] = { ...mockTests[index], ...testData };
    return mockTests[index];
  }
  throw new Error('Test not found');
};

export const deleteTest = async (id) => {
  await delay(300);
  const index = mockTests.findIndex(test => test.id === parseInt(id));
  if (index !== -1) {
    mockTests.splice(index, 1);
    return { success: true };
  }
  throw new Error('Test not found');
};

export const getQuestions = async (params = {}) => {
  await delay(300);
  let filtered = [...mockQuestions];
  
  if (params.search) {
    filtered = filtered.filter(question => 
      question.questionText.toLowerCase().includes(params.search.toLowerCase()) ||
      (question.tags && question.tags.some(tag => tag.toLowerCase().includes(params.search.toLowerCase())))
    );
  }
  
  if (params.subject) {
    filtered = filtered.filter(question => question.subject === params.subject);
  }
  
  if (params.difficulty) {
    filtered = filtered.filter(question => question.difficulty === params.difficulty);
  }
  
  if (params.type) {
    filtered = filtered.filter(question => question.type === params.type);
  }
  
  return filtered;
};

export const createQuestion = async (questionData) => {
  await delay(300);
  const newQuestion = {
    id: mockQuestions.length + 1,
    ...questionData
  };
  mockQuestions.push(newQuestion);
  return newQuestion;
};

export const updateQuestion = async (id, questionData) => {
  await delay(300);
  const index = mockQuestions.findIndex(question => question.id === parseInt(id));
  if (index !== -1) {
    mockQuestions[index] = { ...mockQuestions[index], ...questionData };
    return mockQuestions[index];
  }
  throw new Error('Question not found');
};

export const deleteQuestion = async (id) => {
  await delay(300);
  const index = mockQuestions.findIndex(question => question.id === parseInt(id));
  if (index !== -1) {
    mockQuestions.splice(index, 1);
    return { success: true };
  }
  throw new Error('Question not found');
};

export const getUsers = async (params = {}) => {
  await delay(300);
  let filtered = [...mockUsers];
  
  if (params.search) {
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(params.search.toLowerCase()) ||
      user.email.toLowerCase().includes(params.search.toLowerCase())
    );
  }
  
  if (params.role) {
    filtered = filtered.filter(user => user.role === params.role);
  }
  
  if (params.status) {
    filtered = filtered.filter(user => 
      (params.status === 'active' && user.isActive) ||
      (params.status === 'inactive' && !user.isActive)
    );
  }
  
  if (params.subscription) {
    filtered = filtered.filter(user => user.subscription === params.subscription);
  }
  
  return filtered;
};

export const updateUser = async (id, userData) => {
  await delay(300);
  const index = mockUsers.findIndex(user => user.id === parseInt(id));
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return mockUsers[index];
  }
  throw new Error('User not found');
};

export const toggleUserStatus = async (id) => {
  await delay(300);
  const index = mockUsers.findIndex(user => user.id === parseInt(id));
  if (index !== -1) {
    mockUsers[index].isActive = !mockUsers[index].isActive;
    return mockUsers[index];
  }
  throw new Error('User not found');
};

export const getSubscriptions = async (params = {}) => {
  await delay(300);
  let filtered = [...mockSubscriptions];
  
  if (params.search) {
    filtered = filtered.filter(sub => 
      sub.name.toLowerCase().includes(params.search.toLowerCase()) ||
      sub.description.toLowerCase().includes(params.search.toLowerCase())
    );
  }
  
  if (params.status) {
    filtered = filtered.filter(sub => 
      (params.status === 'active' && sub.isActive) ||
      (params.status === 'inactive' && !sub.isActive)
    );
  }
  
  if (params.billingCycle) {
    filtered = filtered.filter(sub => sub.billingCycle === params.billingCycle);
  }
  
  return filtered;
};

export const getAnalytics = async (params = {}) => {
  await delay(500);
  return mockAnalytics;
};

export const getSubjects = async () => {
  await delay(200);
  return [
    { _id: 'mathematics', name: 'Mathematics' },
    { _id: 'science', name: 'Science' },
    { _id: 'english', name: 'English' },
    { _id: 'history', name: 'History' },
    { _id: 'geography', name: 'Geography' },
    { _id: 'computer-science', name: 'Computer Science' }
  ];
};

export const getDifficulties = async () => {
  await delay(200);
  return [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];
};

// Additional mock functions for completeness
export const getTest = async (id) => {
  await delay(200);
  const test = mockTests.find(t => t.id === parseInt(id));
  if (!test) throw new Error('Test not found');
  return test;
};

export const getQuestion = async (id) => {
  await delay(200);
  const question = mockQuestions.find(q => q.id === parseInt(id));
  if (!question) throw new Error('Question not found');
  return question;
};

export const getUser = async (id) => {
  await delay(200);
  const user = mockUsers.find(u => u.id === parseInt(id));
  if (!user) throw new Error('User not found');
  return user;
};

export const getSubscription = async (id) => {
  await delay(200);
  const subscription = mockSubscriptions.find(s => s.id === parseInt(id));
  if (!subscription) throw new Error('Subscription not found');
  return subscription;
};

export const createSubscription = async (subscriptionData) => {
  await delay(300);
  const newSubscription = {
    id: mockSubscriptions.length + 1,
    ...subscriptionData,
    userCount: 0
  };
  mockSubscriptions.push(newSubscription);
  return newSubscription;
};

export const updateSubscription = async (id, subscriptionData) => {
  await delay(300);
  const index = mockSubscriptions.findIndex(sub => sub.id === parseInt(id));
  if (index !== -1) {
    mockSubscriptions[index] = { ...mockSubscriptions[index], ...subscriptionData };
    return mockSubscriptions[index];
  }
  throw new Error('Subscription not found');
};

export const deleteSubscription = async (id) => {
  await delay(300);
  const index = mockSubscriptions.findIndex(sub => sub.id === parseInt(id));
  if (index !== -1) {
    mockSubscriptions.splice(index, 1);
    return { success: true };
  }
  throw new Error('Subscription not found');
};

export const getUserAnalytics = async (params = {}) => {
  await delay(400);
  return mockAnalytics.userGrowth;
};

export const getTestAnalytics = async (params = {}) => {
  await delay(400);
  return mockAnalytics.testPerformance;
};

export const getRevenueAnalytics = async (params = {}) => {
  await delay(400);
  return {
    revenueBreakdown: mockAnalytics.revenueData,
    monthlyRevenue: [
      { month: 'Jan', revenue: 12000 },
      { month: 'Feb', revenue: 14500 },
      { month: 'Mar', revenue: 15678 }
    ]
  };
};

export const deleteUser = async (id) => {
  await delay(300);
  const index = mockUsers.findIndex(user => user.id === parseInt(id));
  if (index !== -1) {
    mockUsers.splice(index, 1);
    return { success: true };
  }
  throw new Error('User not found');
};

export const getQuestionsByTest = async (testId) => {
  await delay(300);
  return mockQuestions.filter(q => q.testId === parseInt(testId));
};

export const cancelSubscription = async (id) => {
  await delay(300);
  const index = mockSubscriptions.findIndex(sub => sub.id === parseInt(id));
  if (index !== -1) {
    mockSubscriptions[index].isActive = false;
    return mockSubscriptions[index];
  }
  throw new Error('Subscription not found');
};
