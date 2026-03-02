import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ImagePreview from '../common/ImagePreview';

const CompleteWorkForm = ({ onSubmit, loading = false, complaintTitle }) => {
  const [comment, setComment] = useState('');
  const [completionPhoto, setCompletionPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompletionPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCompletionPhoto(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!completionPhoto) {
      alert('Please upload a completion photo');
      return;
    }

    const formData = new FormData();
    formData.append('comment', comment);
    formData.append('completionPhoto', completionPhoto);

    onSubmit(formData);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#8C52FF] max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#8C52FF] mb-6">
        Complete Work: {complaintTitle || 'Selected Complaint'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-2">
            Comment / Work Summary (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Describe what was done to resolve the issue..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:border-[#8C52FF] outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-600 block mb-2">
            Upload Completion Photo <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
            required
          />
          {preview && (
            <div className="mt-4">
              <ImagePreview 
                src={preview} 
                alt="Completion proof" 
                onRemove={removePhoto}
                className="max-h-64"
              />
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            size="large"
            disabled={loading || !completionPhoto}
          >
            {loading ? 'Submitting...' : 'Mark as Completed'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompleteWorkForm;