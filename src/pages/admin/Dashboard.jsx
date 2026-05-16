import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign
} from 'lucide-react';
import { getDashboardStats } from '../../services/adminService';

const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const isPositive = changeType === 'increase';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {change} from last month
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

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  const dashboardStats = stats || {
    totalUsers: 1248,
    totalTests: 45,
    totalQuestions: 1250,
    activeSubscriptions: 324,
    userGrowth: 12.5,
    testGrowth: 8.3,
    questionGrowth: 15.2,
    subscriptionGrowth: 6.7,
    recentActivity: [],
    revenueData: {
      total: 15678,
      growth: 18.2
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel. Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={dashboardStats.totalUsers.toLocaleString()}
          change={`${dashboardStats.userGrowth}%`}
          changeType={dashboardStats.userGrowth > 0 ? 'increase' : 'decrease'}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Tests"
          value={dashboardStats.totalTests}
          change={`${dashboardStats.testGrowth}%`}
          changeType={dashboardStats.testGrowth > 0 ? 'increase' : 'decrease'}
          icon={BookOpen}
          color="green"
        />
        <StatCard
          title="Total Questions"
          value={dashboardStats.totalQuestions.toLocaleString()}
          change={`${dashboardStats.questionGrowth}%`}
          changeType={dashboardStats.questionGrowth > 0 ? 'increase' : 'decrease'}
          icon={HelpCircle}
          color="purple"
        />
        <StatCard
          title="Active Subscriptions"
          value={dashboardStats.activeSubscriptions}
          change={`${dashboardStats.subscriptionGrowth}%`}
          changeType={dashboardStats.subscriptionGrowth > 0 ? 'increase' : 'decrease'}
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${dashboardStats.revenueData.total.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp size={16} className="mr-1" />
                {dashboardStats.revenueData.growth}% from last month
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-full">
              <DollarSign size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              Create New Test
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              Add Questions
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Activity className="text-gray-400" size={20} />
        </div>
        
        {dashboardStats.recentActivity?.length > 0 ? (
          <div className="space-y-4">
            {dashboardStats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'test' ? 'bg-green-500' :
                    activity.type === 'subscription' ? 'bg-orange-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
