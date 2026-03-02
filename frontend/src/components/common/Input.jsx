import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="group">
      {label && (
        <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-gray-100 border-2 border-transparent focus:border-[#8C52FF] focus:bg-white h-12 px-4 rounded-xl transition-all outline-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;