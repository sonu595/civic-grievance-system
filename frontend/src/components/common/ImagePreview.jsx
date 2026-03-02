import React from 'react';

const ImagePreview = ({ src, alt = 'Preview', onRemove, className = '' }) => {
  if (!src) return null;

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className="max-h-48 object-contain rounded-xl border border-gray-300 shadow-sm"
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md hover:bg-red-600"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ImagePreview;