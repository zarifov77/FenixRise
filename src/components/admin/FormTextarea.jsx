import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormTextarea = ({ 
  name, 
  label, 
  placeholder = '', 
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  const { register, formState: { errors } } = useFormContext();

  const error = errors[name];

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;
