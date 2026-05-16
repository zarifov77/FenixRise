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
  Clock,
  Users,
  BookOpen
} from 'lucide-react';
import { getTests, createTest, updateTest, deleteTest } from '../../services/adminService';
import FormModal from '../../components/admin/FormModal';
import FormInput from '../../components/admin/FormInput';
import FormTextarea from '../../components/admin/FormTextarea';
import FormSelect from '../../components/admin/FormSelect';

const testSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subject: z.string().min(1, 'Subject is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  maxAttempts: z.number().min(1, 'Max attempts must be at least 1'),
  passingScore: z.number().min(0).max(100),
  isActive: z.boolean(),
});

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const subjectOptions = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'english', label: 'English' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'computer-science', label: 'Computer Science' },
];

const TestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const queryClient = useQueryClient();

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['admin-tests', { search: searchTerm, subject: selectedSubject, difficulty: selectedDifficulty }],
    queryFn: () => getTests({ search: searchTerm, subject: selectedSubject, difficulty: selectedDifficulty }),
  });

  const createMutation = useMutation({
    mutationFn: createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      setIsModalOpen(false);
      setEditingTest(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(testSchema),
  });

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      duration: parseInt(data.duration),
      maxAttempts: parseInt(data.maxAttempts),
      passingScore: parseInt(data.passingScore),
    };

    if (editingTest) {
      updateMutation.mutate({ id: editingTest.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    reset({
      title: test.title,
      description: test.description,
      subject: test.subject,
      difficulty: test.difficulty,
      duration: test.duration,
      maxAttempts: test.maxAttempts,
      passingScore: test.passingScore,
      isActive: test.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      deleteMutation.mutate(testId);
    }
  };

  const openModal = () => {
    setEditingTest(null);
    reset({
      title: '',
      description: '',
      subject: '',
      difficulty: 'medium',
      duration: 60,
      maxAttempts: 3,
      passingScore: 70,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || test.subject === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || test.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Tests Management</h1>
        <button
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Test
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
                placeholder="Search tests..."
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
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {subjectOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              {difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filteredTests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No tests found</p>
          </div>
        ) : (
          filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {test.difficulty}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      test.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{test.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{test.subject}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{test.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{test.maxAttempts} attempts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Passing: {test.passingScore}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Questions"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(test)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Test"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Test"
                  >
                    <Trash2 size={18} />
                  </button>
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
        title={editingTest ? 'Edit Test' : 'Create Test'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="title"
            label="Test Title"
            register={register}
            error={errors.title}
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
            <FormSelect
              name="subject"
              label="Subject"
              options={subjectOptions}
              register={register}
              error={errors.subject}
              required
            />
            
            <FormSelect
              name="difficulty"
              label="Difficulty"
              options={difficultyOptions}
              register={register}
              error={errors.difficulty}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              name="duration"
              label="Duration (minutes)"
              type="number"
              register={register}
              error={errors.duration}
              required
            />
            
            <FormInput
              name="maxAttempts"
              label="Max Attempts"
              type="number"
              register={register}
              error={errors.maxAttempts}
              required
            />
            
            <FormInput
              name="passingScore"
              label="Passing Score (%)"
              type="number"
              register={register}
              error={errors.passingScore}
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Active Test</label>
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
              {editingTest ? 'Update Test' : 'Create Test'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default TestsManagement;
