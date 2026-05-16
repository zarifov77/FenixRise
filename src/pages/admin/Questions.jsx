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
  HelpCircle,
  Tag,
  BookOpen,
  Star
} from 'lucide-react';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, getSubjects, getDifficulties } from '../../services/adminService';
import FormModal from '../../components/admin/FormModal';
import FormInput from '../../components/admin/FormInput';
import FormTextarea from '../../components/admin/FormTextarea';
import FormSelect from '../../components/admin/FormSelect';
import FormTags from '../../components/admin/FormTags';
import RichTextEditor from '../../components/admin/RichTextEditor';

const questionSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  explanation: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  points: z.number().min(1, 'Points must be at least 1'),
  tags: z.array(z.string()).optional(),
});

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const typeOptions = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
  { value: 'short-answer', label: 'Short Answer' },
];

const QuestionsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['admin-questions', { search: searchTerm, subject: selectedSubject, difficulty: selectedDifficulty, type: selectedType }],
    queryFn: () => getQuestions({ search: searchTerm, subject: selectedSubject, difficulty: selectedDifficulty, type: selectedType }),
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const { data: difficulties = [] } = useQuery({
    queryKey: ['difficulties'],
    queryFn: getDifficulties,
  });

  const createMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      setIsModalOpen(false);
      setEditingQuestion(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(questionSchema),
  });

  const questionType = watch('type');

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      points: parseInt(data.points),
      options: data.type === 'multiple-choice' ? data.options : undefined,
    };

    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    reset({
      questionText: question.questionText,
      explanation: question.explanation || '',
      subject: question.subject,
      difficulty: question.difficulty,
      type: question.type,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer,
      points: question.points,
      tags: question.tags || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(questionId);
    }
  };

  const openModal = () => {
    setEditingQuestion(null);
    reset({
      questionText: '',
      explanation: '',
      subject: '',
      difficulty: 'medium',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
      tags: [],
    });
    setIsModalOpen(true);
  };

  const subjectOptions = subjects.map(subject => ({ value: subject._id, label: subject.name }));
  const difficultyOptionsFromApi = difficulties.map(diff => ({ value: diff.value, label: diff.label }));

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (question.tags && question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesSubject = !selectedSubject || question.subject === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    const matchesType = !selectedType || question.type === selectedType;
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
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
        <h1 className="text-3xl font-bold text-gray-900">Questions Management</h1>
        <button
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Question
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
                placeholder="Search questions..."
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {(difficultyOptionsFromApi.length > 0 ? difficultyOptionsFromApi : difficultyOptions).map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <HelpCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No questions found</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{question.questionText}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {question.type}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star size={14} />
                      <span>{question.points} pts</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{question.subject}</span>
                    </div>
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag size={16} />
                        <span>{question.tags.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Question"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(question)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Question"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Question"
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
        title={editingQuestion ? 'Edit Question' : 'Create Question'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RichTextEditor
            name="questionText"
            label="Question Text"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              name="subject"
              label="Subject"
              options={subjectOptions}
              required
            />
            
            <FormSelect
              name="difficulty"
              label="Difficulty"
              options={difficultyOptionsFromApi.length > 0 ? difficultyOptionsFromApi : difficultyOptions}
              required
            />
            
            <FormSelect
              name="type"
              label="Question Type"
              options={typeOptions}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="points"
              label="Points"
              type="number"
              required
            />
            
            <FormInput
              name="correctAnswer"
              label="Correct Answer"
              required
            />
          </div>
          
          {questionType === 'multiple-choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-2">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    {...register(`options.${index}`)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>
          )}
          
          <RichTextEditor
            name="explanation"
            label="Explanation (Optional)"
          />
          
          <FormTags
            name="tags"
            label="Tags"
            placeholder="Add tags..."
          />
          
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
              {editingQuestion ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default QuestionsManagement;
