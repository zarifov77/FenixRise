import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormCheckbox = ({ 
  name, 
  label, 
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const { register, formState: { errors } } = useFormContext();

  const error = errors[name];

  return (
    <div className={`form-group ${className}`}>
      <div className="flex items-center">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          disabled={disabled}
          className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          {...props}
        />
        {label && (
          <label htmlFor={name} className="ml-2 text-sm text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormCheckbox;
