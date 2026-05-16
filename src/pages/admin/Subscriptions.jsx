import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  ChevronDown,
  CreditCard,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription, cancelSubscription } from '../../services/adminService';
import FormModal from '../../components/admin/FormModal';
import FormInput from '../../components/admin/FormInput';
import FormTextarea from '../../components/admin/FormTextarea';
import FormSelect from '../../components/admin/FormSelect';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be at least 0'),
  billingCycle: z.enum(['monthly', 'yearly', 'lifetime']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  maxTests: z.number().min(0, 'Max tests must be at least 0'),
  maxQuestions: z.number().min(0, 'Max questions must be at least 0'),
  isActive: z.boolean(),
});

const billingCycleOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'lifetime', label: 'Lifetime' },
];

const SubscriptionsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['admin-subscriptions', { search: searchTerm, status: selectedStatus, billingCycle: selectedBillingCycle }],
    queryFn: () => getSubscriptions({ search: searchTerm, status: selectedStatus, billingCycle: selectedBillingCycle }),
  });

  const createMutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      setIsModalOpen(false);
      setEditingSubscription(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(subscriptionSchema),
  });

  const features = watch('features') || [];

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      price: parseFloat(data.price),
      maxTests: parseInt(data.maxTests),
      maxQuestions: parseInt(data.maxQuestions),
    };

    if (editingSubscription) {
      updateMutation.mutate({ id: editingSubscription.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    reset({
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      billingCycle: subscription.billingCycle,
      features: subscription.features || [],
      maxTests: subscription.maxTests,
      maxQuestions: subscription.maxQuestions,
      isActive: subscription.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (subscriptionId) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      deleteMutation.mutate(subscriptionId);
    }
  };

  const handleCancel = (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      cancelMutation.mutate(subscriptionId);
    }
  };

  const openModal = () => {
    setEditingSubscription(null);
    reset({
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      features: [],
      maxTests: 0,
      maxQuestions: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setValue('features', [...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setValue('features', features.filter((_, i) => i !== index));
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || 
      (selectedStatus === 'active' && subscription.isActive) ||
      (selectedStatus === 'inactive' && !subscription.isActive);
    const matchesBillingCycle = !selectedBillingCycle || subscription.billingCycle === selectedBillingCycle;
    return matchesSearch && matchesStatus && matchesBillingCycle;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions Management</h1>
        <button
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Plan
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search subscription plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} className="mr-2" />
            Filters
            <ChevronDown size={16} className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={selectedBillingCycle}
              onChange={(e) => setSelectedBillingCycle(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Billing Cycles</option>
              {billingCycleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No subscription plans found</p>
          </div>
        ) : (
          filteredSubscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{subscription.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">${subscription.price}</span>
                    <span className="text-gray-500 ml-1">
                      {subscription.billingCycle === 'lifetime' ? 'one-time' : `/${subscription.billingCycle}`}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{subscription.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-2" />
                    {subscription.userCount || 0} subscribers
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    Created {formatDate(subscription.createdAt)}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {subscription.features?.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <TrendingUp size={12} className="mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                    {subscription.features?.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{subscription.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(subscription)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Plan"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(subscription.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubscription ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Plan Name"
            register={register}
            error={errors.name}
            required
          />
          
          <FormTextarea
            name="description"
            label="Description"
            register={register}
            error={errors.description}
            required
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="price"
              label="Price ($)"
              type="number"
              step="0.01"
              register={register}
              error={errors.price}
              required
            />
            
            <FormSelect
              name="billingCycle"
              label="Billing Cycle"
              options={billingCycleOptions}
              register={register}
              error={errors.billingCycle}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="maxTests"
              label="Max Tests (0 = unlimited)"
              type="number"
              register={register}
              error={errors.maxTests}
            />
            
            <FormInput
              name="maxQuestions"
              label="Max Questions (0 = unlimited)"
              type="number"
              register={register}
              error={errors.maxQuestions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Active Plan</label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {editingSubscription ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default SubscriptionsManagement;
