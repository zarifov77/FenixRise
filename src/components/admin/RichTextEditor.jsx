import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

const RichTextEditor = ({ 
  name, 
  label, 
  placeholder = 'Start typing...',
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const editorRef = useRef(null);
  const content = watch(name) || '';

  const error = errors[name];

  useEffect(() => {
    // Simple rich text editor implementation
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      setValue(name, editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  const createLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  if (disabled) {
    return (
      <div className={`form-group ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[100px]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }

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
        value={content}
        {...props}
      />

      {/* Toolbar */}
      <div className="border border-gray-300 border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={createLink}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Insert Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-b-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : ''
        }`}
        style={{ minHeight: '150px' }}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;
