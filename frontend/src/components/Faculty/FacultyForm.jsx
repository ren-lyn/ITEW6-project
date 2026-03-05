import React, { useState } from 'react';
import api from '../../api/axios';

const FacultyForm = ({ onSave, onCancel }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        employee_id: '',
        gender: 'Male',
        birthdate: '',
        contact_number: '',
        institutional_email: '',
        address: '',

        // Employment
        employment_status: 'Full-time',
        date_hired: '',
        academic_rank: 'Instructor',
        department: 'CS Department',
        years_of_service: '0',

        // JSON Lists
        academic_qualifications_json: [],
        certifications_json: [],
        teaching_info_json: { courses: '', subjects: '', units: '', room: '' },
        research_publications_json: [],
        faculty_achievements_json: [],
    });

    const [qualInput, setQualInput] = useState('');
    const [certInput, setCertInput] = useState('');
    const [researchInput, setResearchInput] = useState({ title: '', year: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTeachingChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            teaching_info_json: { ...formData.teaching_info_json, [name]: value }
        });
    };

    const addListItem = (field, value, setInput) => {
        if (value && !formData[field].includes(value)) {
            setFormData({ ...formData, [field]: [...formData[field], value] });
            setInput('');
        }
    };

    const addResearch = () => {
        if (researchInput.title) {
            setFormData({
                ...formData,
                research_publications_json: [...formData.research_publications_json, researchInput]
            });
            setResearchInput({ title: '', year: '' });
        }
    };

    const removeListItem = (field, index) => {
        const newList = [...formData[field]];
        newList.splice(index, 1);
        setFormData({ ...formData, [field]: newList });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/faculties', { ...formData, user_id: 1 }); // Placeholder user_id
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving faculty:', error);
            alert('Failed to save faculty profile.');
        }
    };

    const tabs = [
        { id: 'personal', label: '1. Personal Info' },
        { id: 'employment', label: '2. Employment' },
        { id: 'qualifications', label: '3. Credentials' },
        { id: 'teaching', label: '4. Academic & Research' }
    ];

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-success p-4 text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #198754 0%, #104e31 100%)' }}>
                <div>
                    <h4 className="fw-bold mb-0 text-white">Institutional Faculty Registry</h4>
                    <p className="small mb-0 opacity-75 text-white">College of Computing Studies Professional Profile Management</p>
                </div>
            </div>

            <div className="card-header bg-white border-bottom border-light pt-3">
                <ul className="nav nav-tabs border-0 px-3">
                    {tabs.map(tab => (
                        <li className="nav-item" key={tab.id}>
                            <button
                                className={`nav-link border-0 fw-bold small py-3 px-4 ${activeTab === tab.id ? 'active text-success border-bottom border-success border-3' : 'text-muted'}`}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#fafffa' }}>
                {activeTab === 'personal' && (
                    <div className="row g-3">
                        <div className="col-md-4"><label className="form-label small fw-bold">First Name</label><input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Last Name</label><input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Employee ID</label><input type="text" name="employee_id" className="form-control" placeholder="CCS-FAC-XXXX" value={formData.employee_id} onChange={handleInputChange} required /></div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Gender</label>
                            <select name="gender" className="form-select" value={formData.gender} onChange={handleInputChange}>
                                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-3"><label className="form-label small fw-bold">Birthdate</label><input type="date" name="birthdate" className="form-control" value={formData.birthdate} onChange={handleInputChange} /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Institutional Email</label><input type="email" name="institutional_email" className="form-control" value={formData.institutional_email} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Contact Number</label><input type="text" name="contact_number" className="form-control" value={formData.contact_number} onChange={handleInputChange} /></div>
                        <div className="col-md-8"><label className="form-label small fw-bold">Home Address</label><input type="text" name="address" className="form-control" value={formData.address} onChange={handleInputChange} /></div>
                    </div>
                )}

                {activeTab === 'employment' && (
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Employment Status</label>
                            <select name="employment_status" className="form-select" value={formData.employment_status} onChange={handleInputChange}>
                                <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contractual">Contractual</option>
                            </select>
                        </div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Date Hired</label><input type="date" name="date_hired" className="form-control" value={formData.date_hired} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Years of Service</label><input type="number" name="years_of_service" className="form-control" value={formData.years_of_service} onChange={handleInputChange} /></div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Academic Rank</label>
                            <select name="academic_rank" className="form-select" value={formData.academic_rank} onChange={handleInputChange}>
                                <option value="Instructor">Instructor</option><option value="Assistant Professor">Assistant Professor</option><option value="Associate Professor">Associate Professor</option><option value="Professor">Professor</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Department</label>
                            <select name="department" className="form-select" value={formData.department} onChange={handleInputChange}>
                                <option value="CS Department">CS Department</option><option value="IT Department">IT Department</option><option value="IS Department">IS Department</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'qualifications' && (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Academic Degrees (Bachelors, Masters, etc.)</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="Add Degree" value={qualInput} onChange={e => setQualInput(e.target.value)} />
                                <button className="btn btn-success" type="button" onClick={() => addListItem('academic_qualifications_json', qualInput, setQualInput)}>Add</button>
                            </div>
                            <ul className="list-group list-group-flush border rounded-3 bg-white p-2">
                                {formData.academic_qualifications_json.map((q, i) => <li key={i} className="list-group-item d-flex justify-content-between align-items-center small py-1">{q} <span className="ms-auto text-danger pointer" onClick={() => removeListItem('academic_qualifications_json', i)}>×</span></li>)}
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Professional Licenses / Certs</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="Add Certificate" value={certInput} onChange={e => setCertInput(e.target.value)} />
                                <button className="btn btn-success" type="button" onClick={() => addListItem('certifications_json', certInput, setCertInput)}>Add</button>
                            </div>
                            <ul className="list-group list-group-flush border rounded-3 bg-white p-2">
                                {formData.certifications_json.map((c, i) => <li key={i} className="list-group-item d-flex justify-content-between align-items-center small py-1">{c} <span className="ms-auto text-danger pointer" onClick={() => removeListItem('certifications_json', i)}>×</span></li>)}
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'teaching' && (
                    <div className="row g-4">
                        <div className="col-12"><h6 className="fw-bold text-success">Teaching Assignments</h6></div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Subjects Carrying</label><input type="text" name="subjects" className="form-control" placeholder="e.g. CS101, IT202" value={formData.teaching_info_json.subjects} onChange={handleTeachingChange} /></div>
                        <div className="col-md-3"><label className="form-label small fw-bold">Credit Units</label><input type="number" name="units" className="form-control" value={formData.teaching_info_json.units} onChange={handleTeachingChange} /></div>
                        <div className="col-md-3"><label className="form-label small fw-bold">Assigned Room</label><input type="text" name="room" className="form-control" value={formData.teaching_info_json.room} onChange={handleTeachingChange} /></div>

                        <div className="col-12 mt-4"><h6 className="fw-bold text-success">Research & Publications</h6></div>
                        <div className="col-md-8"><input type="text" className="form-control" placeholder="Publication/Research Title" value={researchInput.title} onChange={e => setResearchInput({ ...researchInput, title: e.target.value })} /></div>
                        <div className="col-md-2"><input type="number" className="form-control" placeholder="Year" value={researchInput.year} onChange={e => setResearchInput({ ...researchInput, year: e.target.value })} /></div>
                        <div className="col-md-2"><button type="button" className="btn btn-success w-100" onClick={addResearch}>Add Record</button></div>
                        <div className="col-12">
                            <ul className="list-group list-group-flush border rounded-3 p-2 bg-white">
                                {formData.research_publications_json.map((r, i) => <li key={i} className="list-group-item small">{r.title} ({r.year}) <span className="float-end text-danger pointer" onClick={() => removeListItem('research_publications_json', i)}>×</span></li>)}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end mt-5 pt-4 border-top">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-5 me-2" onClick={onCancel}>Cancel Registration</button>
                    <button type="submit" className="btn btn-success rounded-pill px-5 fw-bold shadow-sm">Save Faculty Profile</button>
                </div>
            </form>
        </div>
    );
};

export default FacultyForm;
