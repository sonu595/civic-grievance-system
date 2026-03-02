import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import MediaSwiper from './MediaSwiper';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';
import imageCompression from 'browser-image-compression';

const FileComplaintForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    address: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false); // Loading state for compression
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const uploadVideoRef = useRef(null);

  // Detect if mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iPad|iPhone|iPod/i.test(userAgent);
    };
    setIsMobile(checkMobile());
    
    autoGetLocation();
    return () => stopCamera();
  }, []);

  const autoGetLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          setFormData(prev => ({ ...prev, location: coords }));

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': 'en',
                  'User-Agent': 'CivicGrievanceApp/1.0'
                }
              }
            );
            
            if (res.ok) {
              const data = await res.json();
              if (data.display_name) {
                setFormData(prev => ({ ...prev, address: data.display_name }));
              }
            }
          } catch (err) { 
            console.log("Address fetch failed:", err); 
            setFormData(prev => ({ 
              ...prev, 
              address: `Location: ${latitude}, ${longitude}` 
            }));
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
          let errorMsg = "Location access denied";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Please enable location access in your browser settings";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location unavailable. Please enter manually";
              break;
            case error.TIMEOUT:
              errorMsg = "Location request timed out";
              break;
          }
          alert(errorMsg);
        },
        options
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  // ✅ Image Compression Function
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 5,           // 5MB max
      maxWidthOrHeight: 1920,  // Max dimension
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8      // 80% quality
    };
    
    try {
      setIsCompressing(true);
      setCameraError('Compressing image...'); // Show compression status
      
      const compressedFile = await imageCompression(file, options);
      console.log(`📊 Original: ${(file.size / 1024 / 1024).toFixed(2)}MB → Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      
      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      alert('Image compression failed. Using original file.');
      return file; // Fallback to original file
    } finally {
      setIsCompressing(false);
      setCameraError(null);
    }
  };

  // 📸 Camera functions
  const startCamera = async () => {
    setCameraError(null);
    
    if (isMobile) {
      fileInputRef.current?.click();
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera access");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setIsCameraActive(true);
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            console.log('Play error:', e);
            setCameraError("Failed to play video stream");
          });
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(err.message || "Camera access denied");
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert("Camera access denied. Please use the file upload option instead.");
      } else {
        fileInputRef.current?.click();
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setImageFile(file);
          setImagePreview(URL.createObjectURL(blob));
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  // ✅ Updated handleImageCapture with compression
  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        
        // Double-check size after compression
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (compressedFile.size > maxSize) {
          alert(`Image is still too large after compression! Maximum allowed is 10MB. Current: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`);
          return;
        }
        
        setImageFile(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try again.');
      }
    }
    e.target.value = '';
  };

  const handleVideoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      } else {
        alert('Please select a valid video file');
      }
    }
    e.target.value = '';
  };

  // ✅ Updated handleVideoUpload with size check
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      
      // Check file size (max 50MB for videos)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        alert(`⚠️ Video too large! Maximum 50MB allowed.\nYour video: ${(file.size / (1024 * 1024)).toFixed(2)}MB\nPlease compress video before uploading.`);
        return;
      }
      
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('description', formData.description);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }
    
    if (videoFile) {
      formDataToSend.append('video', videoFile);
    }
    
    onSubmit(formDataToSend);
  };

  // ✅ Media upload visibility logic
  const canUploadImage = !imagePreview && !videoPreview;
  const canUploadVideo = !videoPreview && !imagePreview;
  const showImageAfterVideo = videoPreview && !imagePreview;
  const showVideoAfterImage = imagePreview && !videoPreview;
  const showBothUploaded = imagePreview && videoPreview;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select 
                name="category" 
                className="w-full px-3 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
                onChange={handleChange}
                value={formData.category}
                required
              >
                <option value="">Select Department</option>
                {COMPLAINT_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Input 
              label="Title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Brief title of your complaint"
              required
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input 
                label="Location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="Lat, Long"
                required
              />
              <div className="flex items-end">
                <button 
                  type="button" 
                  onClick={autoGetLocation} 
                  className="w-full h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  Get Location
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="description"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-lg h-32 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
                onChange={handleChange}
                value={formData.description}
                placeholder="Describe your complaint in detail..."
                required
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Media */}
          <div className="space-y-6">
            <div>
              
              {/* Hidden file inputs */}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
              />
              
              <input 
                type="file" 
                accept="video/*" 
                capture="environment" 
                onChange={handleVideoCapture}
                ref={videoInputRef}
                className="hidden" 
              />
              
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleVideoUpload}
                ref={uploadVideoRef}
                className="hidden" 
              />
              
              {/* ===== MEDIA UPLOAD UI - SMART LOGIC ===== */}
              
              {/* CASE 1: Jab kuch bhi upload nahi hua - Dono options dikhao */}
              {canUploadImage && canUploadVideo && !isCameraActive && !isCompressing && (
                <div className="space-y-3">
                  <button 
                    type="button" 
                    onClick={startCamera} 
                    className="w-full aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-600 hover:bg-gray-200 transition"
                  >
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {isMobile ? 'Tap to take photo' : 'Tap to open camera'}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-100 hover:bg-gray-200 rounded-lg py-2.5 px-3 text-sm font-medium"
                    >
                      Upload Photo
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => uploadVideoRef.current?.click()}
                      className="bg-gray-100 hover:bg-gray-200 rounded-lg py-2.5 px-3 text-sm font-medium"
                    >
                      Upload Video
                    </button>
                  </div>
                </div>
              )}
              
              {/* Compression Loading State */}
              {isCompressing && (
                <div className="w-full aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 border-4 border-[#8C52FF] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-gray-600">Compressing image...</span>
                </div>
              )}
              
              {/* CASE 2: Sirf image upload hua hai - Sirf video ka option dikhao */}
              {showVideoAfterImage && !isCameraActive && !isCompressing && (
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 mb-2">
                    Photo uploaded. You can now add a video.
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => uploadVideoRef.current?.click()}
                      className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg py-3 px-4 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      Add Video Evidence (Optional)
                    </button>
                  </div>
                </div>
              )}
              
              {/* CASE 3: Sirf video upload hua hai - Sirf image ka option dikhao */}
              {showImageAfterVideo && !isCameraActive && !isCompressing && (
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 mb-2">
                    Video uploaded. You can now add a photo.
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-gray-100 hover:bg-gray-200 rounded-lg py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 col-span-2"
                    >
                      Take Photo
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-100 hover:bg-gray-200 rounded-lg py-2.5 px-3 text-sm font-medium col-span-2"
                    >
                      Upload from Gallery
                    </button>
                  </div>
                </div>
              )}
              
              {/* CASE 4: Dono upload ho chuke hain - Koi option nahi dikhao */}
              {showBothUploaded && !isCameraActive && !isCompressing && (
                <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700 text-center">
                  You have uploaded both photo and video. Maximum limit reached.
                </div>
              )}
              
              {/* Camera Active UI */}
              {isCameraActive && !isMobile && (
                <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 border-2 border-white/30">
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50"></div>
                    <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/50"></div>
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50"></div>
                    <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/50"></div>
                  </div>
                  
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                  
                  <button 
                    type="button" 
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg font-medium text-sm hover:scale-105 transition z-10"
                  >
                    Capture Photo
                  </button>
                  
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-red-600 z-10"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Camera Error */}
              {cameraError && !isCameraActive && !isCompressing && (
                <div className="p-4 bg-red-50 rounded-xl text-red-600 text-sm text-center">
                  {cameraError}
                </div>
              )}

              {/* Media Swiper - Jab image ya video ho */}
              {(imagePreview || videoPreview) && !isCameraActive && (
                <MediaSwiper
                  imagePreview={imagePreview}
                  imageFile={imageFile}
                  videoPreview={videoPreview}
                  videoFile={videoFile}
                  onImageRemove={removeImage}
                  onVideoRemove={removeVideo}
                />
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center pt-6">
          <button 
            type="submit"
            disabled={loading || isCompressing}
            className="w-full sm:w-auto bg-[#8C52FF] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SUBMITTING...
              </span>
            ) : 'SUBMIT COMPLAINT'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, name, value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
    />
  </div>
);

export default FileComplaintForm;