import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import { getAnalytics, getUserAnalytics, getTestAnalytics, getRevenueAnalytics } from '../../services/adminService';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [showFilters, setShowFilters] = useState(false);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', { dateRange }],
    queryFn: () => getAnalytics({ dateRange }),
  });

  const { data: userAnalytics } = useQuery({
    queryKey: ['admin-user-analytics', { dateRange }],
    queryFn: () => getUserAnalytics({ dateRange }),
  });

  const { data: testAnalytics } = useQuery({
    queryKey: ['admin-test-analytics', { dateRange }],
    queryFn: () => getTestAnalytics({ dateRange }),
  });

  const { data: revenueAnalytics } = useQuery({
    queryKey: ['admin-revenue-analytics', { dateRange }],
    queryFn: () => getRevenueAnalytics({ dateRange }),
  });

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: '1year', label: 'Last year' },
  ];

  // Mock data for demonstration
  const mockAnalytics = analytics || {
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
    ],
    revenueBreakdown: [
      { source: 'Monthly Subscriptions', amount: 8234, percentage: 52.5 },
      { source: 'Yearly Subscriptions', amount: 5234, percentage: 33.4 },
      { source: 'Lifetime Plans', amount: 2210, percentage: 14.1 },
    ],
    topTests: [
      { title: 'Mathematics Basics', attempts: 456, averageScore: 78 },
      { title: 'Science Fundamentals', attempts: 389, averageScore: 82 },
      { title: 'English Grammar', attempts: 234, averageScore: 75 },
      { title: 'History Quiz', attempts: 198, averageScore: 71 },
      { title: 'Geography Test', attempts: 156, averageScore: 85 },
    ]
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={16} className="mr-1" />
                {trend.value}% from last period
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  const SimpleBarChart = ({ data, title, valueKey, labelKey }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]));
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm text-gray-600 truncate">
                {item[labelKey]}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                  >
                    {item[valueKey]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={20} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={mockAnalytics.overview.totalUsers.toLocaleString()}
          subtitle={`${mockAnalytics.overview.activeUsers} active`}
          icon={Users}
          color="blue"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`$${mockAnalytics.overview.totalRevenue.toLocaleString()}`}
          subtitle="This period"
          icon={DollarSign}
          color="green"
          trend={{ value: 18.2, isPositive: true }}
        />
        <StatCard
          title="Completed Tests"
          value={mockAnalytics.overview.completedTests.toLocaleString()}
          subtitle={`From ${mockAnalytics.overview.totalTests} tests`}
          icon={BarChart3}
          color="purple"
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Average Score"
          value={`${mockAnalytics.overview.averageScore}%`}
          subtitle="Across all tests"
          icon={TrendingUp}
          color="orange"
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleBarChart
          data={mockAnalytics.testPerformance}
          title="Test Performance by Subject"
          valueKey="averageScore"
          labelKey="subject"
        />
        
        <SimpleBarChart
          data={mockAnalytics.topTests}
          title="Most Popular Tests"
          valueKey="attempts"
          labelKey="title"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            {mockAnalytics.revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.source}</p>
                  <p className="text-xs text-gray-500">{item.percentage}% of total</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${item.amount.toLocaleString()}</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="space-y-3">
            {mockAnalytics.userGrowth.slice(-7).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-900">
                    Total: {item.users}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    +{item.newUsers}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mockAnalytics.overview.conversionRate}%
            </div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-xs text-gray-500 mt-1">Free to paid users</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockAnalytics.overview.newUsers}
            </div>
            <p className="text-sm text-gray-600">New Users</p>
            <p className="text-xs text-gray-500 mt-1">This period</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {mockAnalytics.overview.averageScore}%
            </div>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-xs text-gray-500 mt-1">Across all tests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
