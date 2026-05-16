import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { X, Plus } from 'lucide-react';

const FormTags = ({ 
  name, 
  label, 
  placeholder = 'Add a tag...',
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const { register, setValue, formState: { errors } } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const tags = useWatch({ name }) || [];

  const error = errors[name];

  const addTag = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setValue(name, [...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    setValue(name, tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(e);
    }
  };

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Hidden field for form validation */}
      <input
        type="hidden"
        {...register(name)}
        value={tags}
        {...props}
      />

      {/* Tags display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Tag input */}
      {!disabled && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormTags;
