import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form fields editable based on role
    const [formData, setFormData] = useState({
        contact_number: '',
        address: '',
        nickname: '',
        gender: '',
        nationality: 'Filipino',
        civil_status: 'Single',
        religion: '',
        father_name: '',
        mother_name: '',
        guardian_contact: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/profile');
            const data = response.data;
            // The API might return asset URLs using the app url, so using it is safe
            setUser(data);
            
            // Extract info based on role
            if (data.role === 'student' && data.student) {
                // If the student has guardian data via the array or single object:
                const guardian = Array.isArray(data.student.guardians) && data.student.guardians.length > 0
                                 ? data.student.guardians[0]
                                 : (data.student.guardians || {});

                setFormData({
                    contact_number: data.student.contact_number || '',
                    address: data.student.present_address || '',
                    nickname: data.student.nickname || '',
                    gender: data.student.gender || '',
                    nationality: data.student.nationality || 'Filipino',
                    civil_status: data.student.civil_status || 'Single',
                    religion: data.student.religion || '',
                    father_name: guardian.father_name || '',
                    mother_name: guardian.mother_name || '',
                    guardian_contact: guardian.guardian_contact || ''
                });
            } else if (data.role === 'faculty' && data.faculty) {
                setFormData({
                    contact_number: data.faculty.contact_number || '',
                    address: data.faculty.address || ''
                    // Defaults for form fields not needed by faculty will just remain empty
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('profile_picture', file);

        setUploadingImage(true);
        setMessage('');
        try {
            const response = await api.post('/profile/picture', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const updatedUser = { ...user, profile_picture: response.data.profile_picture };
            setUser(updatedUser);
            // Update localStorage to sync sidebar
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMessage('Profile picture updated successfully!');
        } catch (error) {
            console.error('Update image failed', error);
            setMessage('Failed to upload profile picture.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage('');
        setSaving(true);
        try {
            await api.put('/profile', formData);
            setMessage('Profile updated successfully!');
            fetchProfile(); // refresh data
        } catch (error) {
            console.error('Update failed', error);
            setMessage('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    // Determine specific role data
    const roleData = user?.role === 'student' ? user?.student : (user?.role === 'faculty' ? user?.faculty : null);
    
    // For student, extract academic records safely
    const academicRecord = user?.role === 'student' && user?.student?.academic_records?.length > 0
        ? user.student.academic_records[0]
        : null;

    // Helper to format proper image url if it comes without full origin
    const getProfileImageUrl = () => {
        if (!user?.profile_picture) return null;
        if (user.profile_picture.startsWith('http')) return user.profile_picture;
        return `${api.defaults.baseURL.replace('/api', '')}/storage/${user.profile_picture}`;
    };

    return (
        <div>
            {/* Top Blue Banner Section */}
            <div className="card border-0 rounded-start-4 rounded-end-4 mb-4 text-white overflow-hidden shadow-sm" style={{
                backgroundColor: 'var(--ccs-primary-blue)',
                borderBottomLeftRadius: '0 !important',
                borderBottomRightRadius: '0 !important'
            }}>
                <div className="p-4 d-flex align-items-center">
                    <div className="position-relative me-4" style={{ width: '90px', height: '90px' }}>
                        {getProfileImageUrl() ? (
                            <img src={getProfileImageUrl()} alt="Profile" className="rounded-circle shadow object-fit-cover w-100 h-100 bg-white" />
                        ) : (
                            <div className="bg-white bg-opacity-25 text-white fw-bold rounded-circle d-flex align-items-center justify-content-center shadow w-100 h-100 fs-1">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                        
                        {/* Custom File Upload Overlay Button */}
                        <label 
                            className="position-absolute bottom-0 end-0 bg-white text-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                            style={{ width: '32px', height: '32px', cursor: 'pointer', zIndex: 2 }}
                            title="Upload Profile Picture"
                        >
                            <i className={uploadingImage ? "spinner-border spinner-border-sm" : "bi bi-camera-fill small"}></i>
                            <input type="file" className="d-none" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                    </div>
                    <div>
                        <h3 className="fw-bold mb-1">{user?.name}</h3>
                        <div className="text-white text-opacity-75 mb-2">{user?.email}</div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-1 fw-normal text-capitalize">
                                {user?.role || 'Role'} • <span className="text-warning fw-bold">Pending</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form Content */}
            <form onSubmit={handleSave} className="card shadow-sm border-0 rounded-4 bg-white px-4 py-5" style={{ marginTop: '-20px', position: 'relative', zIndex: 1 }}>
                
                {message && (
                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} py-2 mb-4`}>
                        {message}
                    </div>
                )}

                {/* Personal Information */}
                <h6 className="fw-bold mb-4 text-dark"><i className="bi bi-person me-2"></i>Personal Information</h6>
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Full Name</label>
                        <input type="text" className="form-control rounded-3 py-2 border-opacity-50" value={user?.name || ''} readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Email</label>
                        <input type="email" className="form-control rounded-3 py-2 border-opacity-50" value={user?.email || ''} readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Contact Number</label>
                        <input type="text" name="contact_number" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="Enter contact number" value={formData.contact_number} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Address</label>
                        <input type="text" name="address" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="Enter your address" value={formData.address} onChange={handleInputChange} />
                    </div>
                    {user?.role === 'student' && (
                        <>
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Nickname</label>
                                <input type="text" name="nickname" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="Enter nickname" value={formData.nickname} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Gender</label>
                                <select name="gender" className="form-select rounded-3 py-2 border-opacity-50 border-primary" value={formData.gender} onChange={handleInputChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small text-muted mb-1">Nationality</label>
                                <input type="text" name="nationality" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="e.g. Filipino" value={formData.nationality} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small text-muted mb-1">Civil Status</label>
                                <select name="civil_status" className="form-select rounded-3 py-2 border-opacity-50 border-primary" value={formData.civil_status} onChange={handleInputChange}>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Divorced">Divorced</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small text-muted mb-1">Religion</label>
                                <input type="text" name="religion" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="e.g. Roman Catholic" value={formData.religion} onChange={handleInputChange} />
                            </div>
                        </>
                    )}
                </div>

                {/* Family & Guardian Information */}
                {user?.role === 'student' && (
                    <>
                        <h6 className="fw-bold mb-4 text-dark mt-5 border-top pt-4"><i className="bi bi-people me-2"></i>Family & Guardian Info</h6>
                        <div className="row g-4 mb-5">
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Father's Name</label>
                                <input type="text" name="father_name" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="Enter father's name" value={formData.father_name} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Mother's Name</label>
                                <input type="text" name="mother_name" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="Enter mother's name" value={formData.mother_name} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Guardian Contact</label>
                                <input type="text" name="guardian_contact" className="form-control rounded-3 py-2 border-opacity-50 border-primary" placeholder="Enter guardian contact" value={formData.guardian_contact} onChange={handleInputChange} />
                            </div>
                        </div>
                    </>
                )}

                {/* Academic/Professional Information */}
                {user?.role === 'student' && (
                    <>
                        <h6 className="fw-bold mb-4 text-dark mt-5 border-top pt-4"><i className="bi bi-book me-2"></i>Academic Information</h6>
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Student ID</label>
                                <input type="text" className="form-control rounded-3 py-2 border-opacity-50" value={roleData?.id_number || ''} readOnly />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Course</label>
                                <input type="text" className="form-control rounded-3 py-2 border-opacity-50" value={academicRecord?.course || 'No Course Set'} readOnly />
                            </div>
                        </div>
                    </>
                )}

                <div className="d-flex justify-content-end mt-5 pt-3 border-top">
                    <button type="submit" className="btn btn-primary px-5 py-2 fw-bold" disabled={saving}>
                        {saving ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
