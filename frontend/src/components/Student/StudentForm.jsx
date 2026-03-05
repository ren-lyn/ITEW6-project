import React, { useState } from 'react';
import api from '../../api/axios';

const StudentForm = ({ onSave, onCancel }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
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

        // Family Info
        father_name: '',
        father_occupation: '',
        father_contact: '',
        mother_name: '',
        mother_occupation: '',
        mother_contact: '',
        guardian_name: '',
        guardian_contact: '',
        emergency_contact_person: '',
        family_income_bracket: '',
        guardian_consent_events: false,
        living_situation: 'Living with parents',

        // Academic
        course: 'BSIT',
        year_level: '1',
        section: '',
        semester_gpa: '',
        overall_gwa: '',
        academic_standing: 'Regular',
        deans_list: false,
        scholarship: 'None',
        failed_subjects: '',
        retention_status: 'Good Standing',
        academic_adviser: '',

        // Physical
        height: '',
        weight: '',
        body_measurements: '',
        dress_size: '',
        shoe_size: '',
        stage_presence: false,
        willing_to_represent_ccs: false,

        // JSON Lists
        skills_json: [],
        soft_skills_json: [],
        talents_json: [],
        classifications_json: [],
        risk_indicators_json: [],
        digital_profile_json: { portfolio: '', github: '', linkedin: '', facebook: '' },
    });

    const [skillInput, setSkillInput] = useState('');
    const [softSkillInput, setSoftSkillInput] = useState('');
    const [talentInput, setTalentInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleDigitalChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            digital_profile_json: { ...formData.digital_profile_json, [name]: value }
        });
    };

    const addListItem = (field, value, setInput) => {
        if (value && !formData[field].includes(value)) {
            setFormData({ ...formData, [field]: [...formData[field], value] });
            setInput('');
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
            const dataToSubmit = { ...formData, user_id: 1 }; // Placeholder user_id
            await api.post('/students', dataToSubmit);
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Error saving student profile. Check console for details.');
        }
    };

    const tabs = [
        { id: 'personal', label: 'Personal & Demographic' },
        { id: 'family', label: 'Family & Living' },
        { id: 'academic', label: 'Academic Records' },
        { id: 'skills', label: 'Skills & Talents' },
        { id: 'representation', label: 'Physical & Representation' }
    ];

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-primary p-4 text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #f37021 0%, #212121 100%)' }}>
                <div>
                    <h4 className="fw-bold mb-0 text-white">CCS System Registration</h4>
                    <p className="small mb-0 opacity-75 text-white">Intel-driven profiling for students of Pamantasan ng Cabuyao.</p>
                </div>
                <div className="bg-white rounded-circle p-1" style={{ width: '50px', height: '50px' }}>
                    <div className="w-100 h-100 bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold small">CCS</div>
                </div>
            </div>

            <div className="card-header bg-white border-bottom border-light pt-3">
                <ul className="nav nav-tabs border-0 px-3">
                    {tabs.map(tab => (
                        <li className="nav-item" key={tab.id}>
                            <button
                                className={`nav-link border-0 fw-bold small py-3 px-4 ${activeTab === tab.id ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#fffaf5' }}>
                {activeTab === 'personal' && (
                    <div className="row g-3">
                        <div className="col-md-4"><label className="form-label small fw-bold">First Name</label><input type="text" name="first_name" className="form-control rounded-3" value={formData.first_name} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Last Name</label><input type="text" name="last_name" className="form-control rounded-3" value={formData.last_name} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Nickname</label><input type="text" name="nickname" className="form-control rounded-3" value={formData.nickname} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Student ID</label><input type="text" name="student_id" className="form-control rounded-3" placeholder="CCS-20XX-XXXX" value={formData.student_id} onChange={handleInputChange} required /></div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Gender</label>
                            <select name="gender" className="form-select" value={formData.gender} onChange={handleInputChange}>
                                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Birthdate</label><input type="date" name="birthdate" className="form-control" value={formData.birthdate} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Contact Number</label><input type="text" name="contact_number" className="form-control" value={formData.contact_number} onChange={handleInputChange} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Nationality</label><input type="text" name="nationality" className="form-control" value={formData.nationality} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Civil Status</label><select name="civil_status" className="form-select" value={formData.civil_status} onChange={handleInputChange}><option value="Single">Single</option><option value="Married">Married</option></select></div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Present Address</label><textarea name="present_address" className="form-control" rows="2" value={formData.present_address} onChange={handleInputChange} required></textarea></div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Permanent Address</label><textarea name="permanent_address" className="form-control" rows="2" value={formData.permanent_address} onChange={handleInputChange}></textarea></div>
                    </div>
                )}

                {activeTab === 'family' && (
                    <div className="row g-3">
                        <div className="col-md-4"><label className="form-label small fw-bold">Father's Name</label><input type="text" name="father_name" className="form-control" value={formData.father_name} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Occupation</label><input type="text" name="father_occupation" className="form-control" value={formData.father_occupation} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Contact No.</label><input type="text" name="father_contact" className="form-control" value={formData.father_contact} onChange={handleInputChange} /></div>

                        <div className="col-md-4"><label className="form-label small fw-bold">Mother's Name</label><input type="text" name="mother_name" className="form-control" value={formData.mother_name} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Occupation</label><input type="text" name="mother_occupation" className="form-control" value={formData.mother_occupation} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Contact No.</label><input type="text" name="mother_contact" className="form-control" value={formData.mother_contact} onChange={handleInputChange} /></div>

                        <div className="col-md-6"><label className="form-label small fw-bold">Guardian Name (If applicable)</label><input type="text" name="guardian_name" className="form-control" value={formData.guardian_name} onChange={handleInputChange} /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Guardian Contact</label><input type="text" name="guardian_contact" className="form-control" value={formData.guardian_contact} onChange={handleInputChange} /></div>

                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Living Situation</label>
                            <select name="living_situation" className="form-select" value={formData.living_situation} onChange={handleInputChange}>
                                <option value="Living with parents">Living with parents</option>
                                <option value="Boarding">Boarding</option>
                                <option value="Dormitory">Dormitory</option>
                            </select>
                        </div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Income Bracket</label><input type="text" name="family_income_bracket" className="form-control" placeholder="e.g. Under 50k" value={formData.family_income_bracket} onChange={handleInputChange} /></div>
                        <div className="col-12"><div className="form-check"><input className="form-check-input" type="checkbox" name="guardian_consent_events" checked={formData.guardian_consent_events} onChange={handleInputChange} /><label className="form-check-label small fw-bold">Parental consent for events granted</label></div></div>
                    </div>
                )}

                {activeTab === 'academic' && (
                    <div className="row g-3">
                        <div className="col-md-4"><label className="form-label small fw-bold">Course</label><select name="course" className="form-select" value={formData.course} onChange={handleInputChange}><option value="BSCS">BSCS</option><option value="BSIT">BSIT</option><option value="BSIS">BSIS</option></select></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Year Level</label><select name="year_level" className="form-select" value={formData.year_level} onChange={handleInputChange}><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option></select></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Academic Standing</label><select name="academic_standing" className="form-select" value={formData.academic_standing} onChange={handleInputChange}><option value="Regular">Regular</option><option value="Irregular">Irregular</option><option value="Probation">Probation</option></select></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Semester GPA</label><input type="number" step="0.01" name="semester_gpa" className="form-control" value={formData.semester_gpa} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Overall GWA</label><input type="number" step="0.01" name="overall_gwa" className="form-control" value={formData.overall_gwa} onChange={handleInputChange} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">Scholarship Status</label><input type="text" name="scholarship" className="form-control" value={formData.scholarship} onChange={handleInputChange} /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Academic Adviser</label><input type="text" name="academic_adviser" className="form-control" value={formData.academic_adviser} onChange={handleInputChange} /></div>
                        <div className="col-md-6"><div className="form-check mt-4"><input className="form-check-input" type="checkbox" name="deans_list" checked={formData.deans_list} onChange={handleInputChange} /><label className="form-check-label small fw-bold">Dean's Lister Candidate</label></div></div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Technical Skills</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="e.g. Web Dev, Networking" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
                                <button className="btn btn-primary" type="button" onClick={() => addListItem('skills_json', skillInput, setSkillInput)}>Add</button>
                            </div>
                            <div className="d-flex flex-wrap gap-2">{formData.skills_json.map((s, i) => <span key={i} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">{s} <span className="ms-1 pointer" onClick={() => removeListItem('skills_json', i)}>×</span></span>)}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Soft Skills</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="e.g. Leadership, Communication" value={softSkillInput} onChange={e => setSoftSkillInput(e.target.value)} />
                                <button className="btn btn-primary" type="button" onClick={() => addListItem('soft_skills_json', softSkillInput, setSoftSkillInput)}>Add</button>
                            </div>
                            <div className="d-flex flex-wrap gap-2">{formData.soft_skills_json.map((s, i) => <span key={i} className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">{s} <span className="ms-1 pointer" onClick={() => removeListItem('soft_skills_json', i)}>×</span></span>)}</div>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold small">Talents</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="e.g. Hosting, Modeling, Dance" value={talentInput} onChange={e => setTalentInput(e.target.value)} />
                                <button className="btn btn-primary" type="button" onClick={() => addListItem('talents_json', talentInput, setTalentInput)}>Add</button>
                            </div>
                            <div className="d-flex flex-wrap gap-2">{formData.talents_json.map((s, i) => <span key={i} className="badge bg-warning bg-opacity-10 text-dark px-3 py-2 rounded-pill">{s} <span className="ms-1 pointer" onClick={() => removeListItem('talents_json', i)}>×</span></span>)}</div>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold small">Digital Profile (Links)</label>
                            <div className="row g-2">
                                <div className="col-md-6"><input type="text" name="github" className="form-control" placeholder="GitHub URL" value={formData.digital_profile_json.github} onChange={handleDigitalChange} /></div>
                                <div className="col-md-6"><input type="text" name="linkedin" className="form-control" placeholder="LinkedIn URL" value={formData.digital_profile_json.linkedin} onChange={handleDigitalChange} /></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'representation' && (
                    <div className="row g-3">
                        <div className="col-md-3"><label className="form-label small fw-bold">Height (cm)</label><input type="number" name="height" className="form-control" value={formData.height} onChange={handleInputChange} /></div>
                        <div className="col-md-3"><label className="form-label small fw-bold">Weight (kg)</label><input type="number" name="weight" className="form-control" value={formData.weight} onChange={handleInputChange} /></div>
                        <div className="col-md-6"><label className="form-label small fw-bold">Body Measurements</label><input type="text" name="body_measurements" className="form-control" value={formData.body_measurements} onChange={handleInputChange} placeholder="e.g. 34-24-36" /></div>

                        <div className="col-md-6">
                            <div className="form-check mt-2"><input className="form-check-input" type="checkbox" name="stage_presence" checked={formData.stage_presence} onChange={handleInputChange} /><label className="form-check-label small fw-bold">Possesses strong stage presence</label></div>
                            <div className="form-check mt-2"><input className="form-check-input" type="checkbox" name="willing_to_represent_ccs" checked={formData.willing_to_represent_ccs} onChange={handleInputChange} /><label className="form-check-label small fw-bold">Willing to represent CCS in local/national events</label></div>
                        </div>
                        <div className="col-md-3"><label className="form-label small fw-bold">Dress Size</label><input type="text" name="dress_size" className="form-control" value={formData.dress_size} onChange={handleInputChange} /></div>
                        <div className="col-md-3"><label className="form-label small fw-bold">Shoe Size</label><input type="number" step="0.5" name="shoe_size" className="form-control" value={formData.shoe_size} onChange={handleInputChange} /></div>
                    </div>
                )}

                <div className="d-flex justify-content-end mt-5 pt-4 border-top">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-5 me-2" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold" style={{ backgroundColor: '#f37021', borderColor: '#f37021' }}>Save Complete Record</button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
