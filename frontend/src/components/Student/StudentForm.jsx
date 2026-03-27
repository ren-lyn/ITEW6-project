import React, { useState } from 'react';
import api from '../../api/axios';

const StudentForm = ({ onSave, onCancel, student = null }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState(student ? {
        ...student,
        course: student.academic_records?.[0]?.course || 'BSIT',
        year_level: student.academic_records?.[0]?.year_level || '1',
        overall_gwa: student.academic_records?.[0]?.gwa || '',
        academic_standing: student.academic_records?.[0]?.academic_standing || 'Regular',
        skills_json: student.skills?.map(s => s.skill_name) || [],
        affiliations: student.organizations?.map(o => ({ org_name: o.org_name, position: o.pivot?.position })) || []
    } : {
        first_name: '',
        last_name: '',
        nickname: '',
        student_id: '',
        gender: 'Male',
        birthdate: '',
        civil_status: 'Single',
        nationality: 'Filipino',
        religion: '',
        present_address: '',
        permanent_address: '',
        contact_number: '',
        email: '',

        // Family Info
        father_name: '',
        mother_name: '',
        guardian_contact: '',

        // Academic
        course: 'BSIT',
        year_level: '1',
        overall_gwa: '',
        academic_standing: 'Regular',

        // JSON Lists
        skills_json: [],
        affiliations: [], // { org_name, position }
    });

    const [skillInput, setSkillInput] = useState('');
    const [affOrgInput, setAffOrgInput] = useState('');
    const [affPosInput, setAffPosInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const addSkill = () => {
        if (skillInput && !formData.skills_json.includes(skillInput)) {
            setFormData({ ...formData, skills_json: [...formData.skills_json, skillInput] });
            setSkillInput('');
        }
    };

    const addAffiliation = () => {
        if (affOrgInput && affPosInput) {
            setFormData({ 
                ...formData, 
                affiliations: [...formData.affiliations, { org_name: affOrgInput, position: affPosInput }] 
            });
            setAffOrgInput('');
            setAffPosInput('');
        }
    };

    const removeListItem = (field, index) => {
        const newList = [...formData[field]];
        newList.splice(index, 1);
        setFormData({ ...formData, [field]: newList });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Validation to prevent null email/ID errors
        if (!formData.email || !formData.first_name || !formData.last_name || !formData.student_id) {
            alert('Required Information Missing: Please ensure First Name, Last Name, Student ID, and Email Address are filled in the Personal tab.');
            setActiveTab('personal');
            return;
        }

        try {
            if (student) {
                await api.put(`/students/${student.student_id}`, formData);
            } else {
                await api.post('/students', formData);
            }
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving student:', error);
            const errorMessage = error.response?.data?.message || 'Error saving student profile.';
            alert(errorMessage);
        }
    };

    const tabs = [
        { id: 'personal', label: '1. Personal' },
        { id: 'academic', label: '2. Academic' },
        { id: 'skills', label: '3. Skills' },
        { id: 'affiliations', label: '4. Affiliations' }
    ];

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate-slide-up">
            <div className="bg-dark p-4 text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #f37021 0%, #212121 100%)' }}>
                <div>
                    <h4 className="fw-bold mb-0 text-white">{student ? 'Update Intel Profile' : 'New Student Registration'}</h4>
                    <p className="small mb-0 opacity-75 text-white">Comprehensive Student Profiling - CCS Intelligence System</p>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
            </div>

            <div className="card-header bg-white border-bottom border-light pt-3 pb-3">
                <ul className="nav nav-pills border-0 px-3 gap-2">
                    {tabs.map(tab => (
                        <li className="nav-item" key={tab.id}>
                            <button
                                className={`nav-link rounded-pill fw-bold small py-2 px-4 border-0 transition-all ${activeTab === tab.id ? 'active shadow icon-glow' : 'text-secondary'}`}
                                style={activeTab === tab.id ? { backgroundColor: '#f37021', color: '#ffffff' } : { backgroundColor: '#f0f2f5', color: '#4a5568' }}
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
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Student ID</label><input type="text" name="student_id" className="form-control rounded-3 bg-light border-0" placeholder="CCS-20XX-XXXX" value={formData.student_id} onChange={handleInputChange} required /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Email Address</label><input type="email" name="email" className="form-control rounded-3 bg-light border-0" value={formData.email} onChange={handleInputChange} required /></div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold text-dark">Gender</label>
                            <select name="gender" className="form-select rounded-3 bg-light border-0" value={formData.gender} onChange={handleInputChange}>
                                <option value="Male">Male</option><option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-4"><label className="form-label small fw-bold text-dark">Birthdate</label><input type="date" name="birthdate" className="form-control rounded-3 bg-light border-0" value={formData.birthdate} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold text-dark">Contact Number</label><input type="text" name="contact_number" className="form-control rounded-3 bg-light border-0" value={formData.contact_number} onChange={handleInputChange} required /></div>
                        <div className="col-12"><label className="form-label small fw-bold text-dark">Present Address</label><textarea name="present_address" className="form-control rounded-3 bg-light border-0" rows="2" value={formData.present_address} onChange={handleInputChange} required></textarea></div>
                    </div>
                )}

                {activeTab === 'academic' && (
                    <div className="row g-3">
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Course / Program</label><select name="course" className="form-select rounded-3 bg-light border-0" value={formData.course} onChange={handleInputChange}><option value="BSCS">BSCS</option><option value="BSIT">BSIT</option><option value="BSIS">BSIS</option></select></div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Year Level</label><select name="year_level" className="form-select rounded-3 bg-light border-0" value={formData.year_level} onChange={handleInputChange}><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option></select></div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Current GWA</label><input type="number" step="0.01" name="overall_gwa" className="form-control rounded-3 bg-light border-0" value={formData.overall_gwa} onChange={handleInputChange} /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Academic Standing</label><select name="academic_standing" className="form-select rounded-3 bg-light border-0" value={formData.academic_standing} onChange={handleInputChange}><option value="Regular">Regular</option><option value="Irregular">Irregular</option></select></div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="row g-4">
                        <div className="col-12">
                            <label className="form-label fw-bold small text-dark">Technical Skills & Talents</label>
                            <div className="input-group mb-3 shadow-sm rounded-3 overflow-hidden">
                                <input type="text" className="form-control border-0 px-3" placeholder="e.g. Basketball, Java, Photoshop" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
                                <button className="btn btn-dark" type="button" onClick={addSkill}>Add Skill</button>
                            </div>
                            <div className="d-flex flex-wrap gap-2 min-vh-10 p-3 bg-light rounded-4 border-dashed">
                                {formData.skills_json.length > 0 ? formData.skills_json.map((s, i) => (
                                    <span key={i} className="badge bg-white text-primary border px-3 py-2 rounded-pill shadow-sm">
                                        {s} <i className="bi bi-x-circle ms-1 cursor-pointer text-danger" onClick={() => removeListItem('skills_json', i)}></i>
                                    </span>
                                )) : <span className="text-muted small italic">No skills added yet.</span>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'affiliations' && (
                    <div className="row g-3">
                        <div className="col-md-6"><label className="form-label small fw-bold text-dark">Organization / Sport Name</label><input type="text" className="form-control rounded-3 bg-light border-0" placeholder="e.g. CCS Council, Varsity" value={affOrgInput} onChange={e => setAffOrgInput(e.target.value)} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold text-dark">Position / Role</label><input type="text" className="form-control rounded-3 bg-light border-0" placeholder="e.g. Member, Captain" value={affPosInput} onChange={e => setAffPosInput(e.target.value)} /></div>
                        <div className="col-md-2 d-flex align-items-end"><button className="btn btn-primary w-100 rounded-3 shadow-none fw-bold" type="button" onClick={addAffiliation}>Add</button></div>
                        
                        <div className="col-12 mt-4">
                            <h6 className="fw-bold small text-muted text-uppercase mb-3">Current Affiliations</h6>
                            <div className="table-responsive bg-light rounded-4 border overflow-hidden">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-white"><tr><th className="small text-dark">Organization</th><th className="small text-dark">Role</th><th className="text-end px-3 small text-dark">Action</th></tr></thead>
                                    <tbody>
                                        {formData.affiliations.map((aff, i) => (
                                            <tr key={i}>
                                                <td className="fw-bold small">{aff.org_name}</td>
                                                <td className="small">{aff.position}</td>
                                                <td className="text-end px-3"><i className="bi bi-trash text-danger cursor-pointer" onClick={() => removeListItem('affiliations', i)}></i></td>
                                            </tr>
                                        ))}
                                        {formData.affiliations.length === 0 && <tr><td colSpan="3" className="text-center py-4 text-muted small">No affiliations added.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end mt-5 pt-4 border-top gap-3">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-5 fw-bold" style={{ backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#cbd5e0' }} onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm text-white" style={{ backgroundColor: '#f37021', borderColor: '#f37021' }}>{student ? 'Update Profile' : 'Save New Student'}</button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
