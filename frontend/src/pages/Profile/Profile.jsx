import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import ComplaintCard from '../../components/complaint/ComplaintCard';
import { getProfile, updateProfile } from '../../api/userapi';
import { getMyComplaints } from '../../api/complaintsapi';
import { USER_ROLES } from '../../utils/constants';

const Profile = () => {
  const { user, logout, token, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // ✅ Check if user is department
  const isDepartment = user?.role === USER_ROLES.DEPARTMENT;
  
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    city: '',
    town: '',
    departmentName: '',
    specialization: '',
    profileImage: ''
  });

  useEffect(() => {
    if (token) {
      fetchProfile();
      // ✅ Only fetch complaints if not department
      if (!isDepartment) {
        fetchUserComplaints();
      }
    } else {
      setLoading(false);
      setError('Please login to view profile');
    }
  }, [token, isDepartment]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      console.log('Profile data:', data);
      
      setProfile(data);
      
      setFormData({
        name: data.name || user?.name || '',
        contactNumber: data.contactNumber || '',
        city: data.city || '',
        town: data.town || '',
        departmentName: data.departmentName || user?.departmentName || '',
        specialization: data.specialization || '',
        profileImage: data.profileImage || ''
      });
      
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Could not load profile. Please try again later.');
      
      if (user) {
        setProfile(user);
        setFormData({
          name: user.name || '',
          contactNumber: user.contactNumber || '',
          city: '',
          town: '',
          departmentName: user.departmentName || '',
          specialization: '',
          profileImage: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserComplaints = async () => {
    try {
      setComplaintsLoading(true);
      const data = await getMyComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setComplaintsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData = {
        name: formData.name,
        contactNumber: formData.contactNumber,
        city: formData.city,
        town: formData.town,
        ...(user?.role === USER_ROLES.SOLVER && { specialization: formData.specialization }),
        ...(formData.profileImage && { profileImage: formData.profileImage })
      };

      const updated = await updateProfile(updateData);
      console.log('Profile updated:', updated);

      updateUser({
        name: formData.name,
        contactNumber: formData.contactNumber,
        profileImage: formData.profileImage
      });
      
      setSuccess(true);
      setEditMode(false);
      await fetchProfile();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleDisplay = () => {
    const role = profile?.role || user?.role;
    switch (role) {
      case USER_ROLES.CITIZEN:
        return 'Citizen';
      case USER_ROLES.DEPARTMENT:
        return 'Department Official';
      case USER_ROLES.SOLVER:
        return 'Solver (Field Worker)';
      default:
        return role || 'User';
    }
  };

  const getAvatarImage = () => {
    if (profile?.profileImage) return profile.profileImage;
    if (formData.profileImage) return formData.profileImage;
    return `https://ui-avatars.com/api/?name=${profile?.name || user?.name || 'User'}&background=#8C52FF&color=000&size=128`;
  };

  // https://ui-avatars.com/api/?name=Guest&background=#8C52FF&color=000

  const handleViewComplaint = (id) => {
    window.location.href = `/complaint/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#DDCCFF] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DDCCFF] py-6 sm:py-8 md:py-10 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 px-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#8C52FF] tracking-tight">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage your personal information
          </p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl sm:rounded-2xl text-sm sm:text-base mx-2"
          >
            ✅ Profile updated successfully!
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl sm:rounded-2xl text-sm sm:text-base mx-2"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Tabs - Responsive */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 px-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base transition ${
              activeTab === 'profile'
                ? 'bg-[#8C52FF] text-white shadow-lg'
                : 'bg-white text-[#8C52FF] hover:bg-[#FFF4D9]'
            }`}
          >
            Profile Info
          </button>
          
          {/* ✅ Only show complaints tab for non-department users */}
          {(user?.role === 'citizen') && (
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base transition ${
                activeTab === 'complaints'
                  ? 'bg-[#8C52FF] text-white shadow-lg'
                  : 'bg-white text-[#8C52FF] hover:bg-[#FFF4D9]'
              }`}
            >
              My Complaints {complaints.length > 0 && `(${complaints.length})`}
            </button>
          )}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#DDCCFF] rounded-[20px] sm:rounded-[30px] md:rounded-[40px] p-1 mx-2"
        >
          <div className="bg-white rounded-[18px] sm:rounded-[28px] md:rounded-[35px] overflow-hidden border border-[#DDCCFF]">
            
            {activeTab === 'profile' ? (
              /* Profile Info Tab */
              <>
                {/* Profile Header with Avatar */}
                <div className=" bg-[#8C52FF]  p-4 sm:p-6 md:p-8 text-white">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="">
                      <img
                        src={getAvatarImage()}
                        alt="Profile"
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                      {/* {editMode && (
                        <label className="absolute bottom-0 right-0 bg-[#E67E22] rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-[#d35400] transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                      )} */}
                    </div>
                    
                    <div className="text-center items-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{profile?.name || user?.name}</h2>
                      <p className="text-[#FFF] font-medium mt-1 text-sm sm:text-base">{getRoleDisplay()}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Body */}
                <div className="p-4 sm:p-6 md:p-8">
                  {!editMode ? (
                    /* View Mode */
                    <div>
                      <div className="flex justify-end mb-4 sm:mb-6">
                        <Button 
                          variant="primary" 
                          onClick={() => setEditMode(true)}
                          className="text-sm border border-[8c52ff] bg-[#8c52ff] hover:bg-white hover:text-[#8c52ff] sm:text-base px-4 sm:px-6 py-2 sm:py-2.5"
                        >
                          Edit Profile
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 font-semibold gap-4 sm:gap-6">
                        {/* Personal Information */}
                        <div className="space-y-3 sm:space-y-4 ">
                          <h3 className="text-base sm:text-lg font-semibold text-[#8C52FF] border-b border-[#8C52FF] pb-2">
                            Personal Information
                          </h3>
                          
                          <InfoRow  label="Full Name" value={profile?.name || user?.name} />
                          <InfoRow  label="Contact Number" value={profile?.contactNumber || 'Not provided'} />
                          <InfoRow  label="City" value={profile?.city || 'Not provided'} />
                          <InfoRow  label="Town/Locality" value={profile?.town || 'Not provided'} />
                          <InfoRow  label="Aadhaar Number" value={profile?.aadhaar || user?.aadhaar} />
                        </div>

                        {/* Role-based Information */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-[#8C52FF] border-b border-[#8C52FF] pb-2">
                            {profile?.role === USER_ROLES.CITIZEN ? 'Residence' : 
                             profile?.role === USER_ROLES.DEPARTMENT ? 'Department Details' : 
                             'Work Details'}
                          </h3>

                          {(profile?.role === USER_ROLES.DEPARTMENT || profile?.role === USER_ROLES.SOLVER) && (
                            <InfoRow label="Department" value={profile?.departmentName || user?.departmentName || 'Not assigned'} />
                          )}

                          {profile?.role === USER_ROLES.SOLVER && (
                            <InfoRow label="Specialization" value={profile?.specialization || 'General'} />
                          )}

                          {/* Account Statistics - Only show for non-department users */}
                          {!isDepartment && (
                            <div className="mt-4 sm:mt-6 pt-4 border-t border-[#8C52FF]">
                              <h4 className="font-semibold text-[#8C52FF] mb-3 text-sm sm:text-base">Account Statistics</h4>
                              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <StatCard 
                                  value={complaints.length}
                                  label="Total"
                                  color="text-[#8C52FF]"
                                />
                                <StatCard 
                                  value={complaints.filter(c => c.status === 'resolved' || c.status === 'completed').length}
                                  label="Resolved"
                                  color="text-green-600"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Account Actions */}
                      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#8C52FF] flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                          Member since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={logout}
                          className="text-sm sm:text-base px-6 py-2 order-1 sm:order-2 w-full sm:w-auto"
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode */
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditMode(false);
                            setError(null);
                            if (profile) {
                              setFormData({
                                name: profile.name || user?.name || '',
                                contactNumber: profile.contactNumber || '',
                                city: profile.city || '',
                                town: profile.town || '',
                                departmentName: profile.departmentName || user?.departmentName || '',
                                specialization: profile.specialization || '',
                                profileImage: profile.profileImage || ''
                              });
                            }
                          }}
                          className="text-sm sm:text-base px-4 py-2 w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={updating}
                          className="text-sm sm:text-base px-4 py-2 w-full sm:w-auto"
                        >
                          {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <Input 
                          label="Full Name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          required 
                          className="text-sm sm:text-base"
                        />
                        <Input 
                          label="Contact Number" 
                          name="contactNumber" 
                          value={formData.contactNumber} 
                          onChange={handleChange} 
                          placeholder="+91..."
                          className="text-sm sm:text-base"
                        />
                        <Input 
                          label="City" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleChange} 
                          placeholder="e.g., Jaipur"
                          className="text-sm sm:text-base"
                        />
                        <Input 
                          label="Town/Locality" 
                          name="town" 
                          value={formData.town} 
                          onChange={handleChange} 
                          placeholder="e.g., Malviya Nagar"
                          className="text-sm sm:text-base"
                        />

                        {profile?.role === USER_ROLES.SOLVER && (
                          <Input 
                            label="Specialization" 
                            name="specialization" 
                            value={formData.specialization} 
                            onChange={handleChange} 
                            placeholder="e.g., Electrical, Plumbing" 
                            className="md:col-span-2 text-sm sm:text-base"
                          />
                        )}

                        {profile?.role === USER_ROLES.DEPARTMENT && (
                          <div className="md:col-span-2">
                            <p className="text-xs sm:text-sm text-gray-600 bg-yellow-50 p-3 sm:p-4 rounded-xl border border-yellow-200">
                              <span className="font-bold">ℹ️ Note:</span> Department details can only be updated by administrator.
                            </p>
                          </div>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </>
            ) : (
              /* My Complaints Tab - Only shown for non-department users */
              <div className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#8C52FF] mb-4 sm:mb-6">My Complaints</h2>
                
                {complaintsLoading ? (
                  <div className="py-8 sm:py-12 flex justify-center">
                    <Loader size="medium" />
                  </div>
                ) : complaints.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 sm:py-12 bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1"
                  >
                    <div className="bg-white rounded-[18px] sm:rounded-[28px] p-6 sm:p-8 md:p-12">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg sm:text-xl text-gray-600 mb-4">You haven't filed any complaints yet</p>
                      {user?.role === USER_ROLES.CITIZEN && (
                        <Button 
                          variant="primary" 
                          onClick={() => window.location.href = '/file-complaint'}
                          className="text-sm sm:text-base px-6 py-2"
                        >
                          + File Your First Complaint
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {complaints.map((complaint, index) => (
                      <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ComplaintCard
                          data={complaint}
                          onClick={() => handleViewComplaint(complaint.id)}
                          isMyComplaint={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper Components
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-[#8C52FF] last:border-0">
    <p className="text-xs sm:text-sm text-gray-500 w-full sm:w-32">{label}</p>
    <p className="font-medium text-sm sm:text-base wrap-break-word flex-1">{value || '—'}</p>
  </div>
);

const StatCard = ({ value, label, color }) => (
  <div className="">
    <div className="bg-white border-2 border-[#8C52FF] rounded-full sm:rounded-full p-4 sm:p-2 text-center">
      <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  </div>
);

export default Profile;