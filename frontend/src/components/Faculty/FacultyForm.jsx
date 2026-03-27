import React, { useState } from 'react';
import api from '../../api/axios';

const FacultyForm = ({ onSave, onCancel, faculty = null }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState(faculty ? {
        ...faculty,
    } : {
        first_name: '',
        last_name: '',
        id_number: '',
        gender: 'Male',
        birthdate: '',
        email: '',
        contact_number: '',
        address: '',
        employment_status: 'Full-time',
        date_hired: '',
        rank: 'Instructor',
        department: 'CS Department',
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (faculty) {
                await api.put(`/faculties/${faculty.faculty_id}`, formData);
            } else {
                await api.post('/faculties', formData);
            }
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving faculty:', error);
            alert(error.response?.data?.message || 'Failed to save faculty profile.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'personal', label: '1. Personal Info' },
        { id: 'employment', label: '2. Employment' }
    ];

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate-slide-up">
            <div className="bg-dark p-4 text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #198754 0%, #104e31 100%)' }}>
                <div>
                    <h4 className="fw-bold mb-0 text-white">{faculty ? 'Update Faculty Profile' : 'Professional Faculty Registration'}</h4>
                    <p className="small mb-0 opacity-75 text-white">CCS Academic & Professional Profiling System</p>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
            </div>

            <div className="card-header bg-white border-bottom border-light pt-3 pb-3">
                <ul className="nav nav-pills border-0 px-3 gap-2">
                    {tabs.map(tab => (
                        <li className="nav-item" key={tab.id}>
                            <button
                                className={`nav-link rounded-pill fw-bold small py-2 px-4 border-0 transition-all ${activeTab === tab.id ? 'active shadow bg-success text-white' : 'text-secondary'}`}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white">
                {activeTab === 'personal' && (
                    <div className="row g-3">
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">First Name</label><input type="text" name="first_name" className="form-control rounded-3 bg-light border-0" value={formData.first_name} onChange={handleInputChange} required /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Last Name</label><input type="text" name="last_name" className="form-control rounded-3 bg-light border-0" value={formData.last_name} onChange={handleInputChange} required /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Employee ID</label><input type="text" name="id_number" className="form-control rounded-3 bg-light border-0" placeholder="CCS-FAC-XXXX" value={formData.id_number} onChange={handleInputChange} required /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Email Address</label><input type="email" name="email" className="form-control rounded-3 bg-light border-0" value={formData.email} onChange={handleInputChange} required /></div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold text-dark">Gender</label>
                            <select name="gender" className="form-select rounded-3 bg-light border-0" value={formData.gender} onChange={handleInputChange}>
                                <option value="Male">Male</option><option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-4"><label className="form-label small fw-bold text-dark">Birthdate</label><input type="date" name="birthdate" className="form-control rounded-3 bg-light border-0" value={formData.birthdate} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold text-dark">Contact Number</label><input type="text" name="contact_number" className="form-control rounded-3 bg-light border-0" value={formData.contact_number} onChange={handleInputChange} required /></div>
                        <div className="col-12"><label className="form-label small fw-bold text-dark">Home Address</label><textarea name="address" className="form-control rounded-3 bg-light border-0" rows="2" value={formData.address} onChange={handleInputChange} required></textarea></div>
                    </div>
                )}

                {activeTab === 'employment' && (
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-dark">Employment Status</label>
                            <select name="employment_status" className="form-select rounded-3 bg-light border-0" value={formData.employment_status} onChange={handleInputChange}>
                                <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contractual">Contractual</option>
                            </select>
                        </div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Date Hired</label><input type="date" name="date_hired" className="form-control rounded-3 bg-light border-0" value={formData.date_hired} onChange={handleInputChange} required /></div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-dark">Academic Rank</label>
                            <select name="rank" className="form-select rounded-3 bg-light border-0" value={formData.rank} onChange={handleInputChange}>
                                <option value="Instructor">Instructor</option><option value="Assistant Professor">Assistant Professor</option><option value="Associate Professor">Associate Professor</option><option value="Professor">Professor</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-dark">Department</label>
                            <select name="department" className="form-select rounded-3 bg-light border-0" value={formData.department} onChange={handleInputChange}>
                                <option value="CS Department">CS Department</option><option value="IT Department">IT Department</option><option value="IS Department">IS Department</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end mt-5 pt-4 border-top gap-3">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-5 fw-bold" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-success rounded-pill px-5 fw-bold shadow-sm text-white" disabled={loading}>
                        {loading ? 'Saving...' : (faculty ? 'Update Profile' : 'Register Faculty')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FacultyForm;
