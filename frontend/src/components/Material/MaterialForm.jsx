import React, { useState } from 'react';
import api from '../../api/axios';

const MaterialForm = ({ onSave, onCancel }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        title: '',
        type: 'Syllabus',
        subject_code: '',
        description: '',
        faculty_id: 1, // Placeholder

        // Detailed Sections (JSON)
        syllabus_json: {
            outcomes: [],
            weekly_topics: [],
            assessment_methods: []
        },
        curriculum_json: {
            course_guide: '',
            pre_requisites: ''
        },
        lesson_json: {
            lecture_notes: '',
            assignments: []
        }
    });

    const [outcomeInput, setOutcomeInput] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [assessmentInput, setAssessmentInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData({
            ...formData,
            [parent]: { ...formData[parent], [field]: value }
        });
    };

    const addListItem = (parent, field, value, setInput) => {
        if (value && !formData[parent][field].includes(value)) {
            const newList = [...formData[parent][field], value];
            handleNestedChange(parent, field, newList);
            setInput('');
        }
    };

    const removeListItem = (parent, field, index) => {
        const newList = [...formData[parent][field]];
        newList.splice(index, 1);
        handleNestedChange(parent, field, newList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/materials', formData);
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving material:', error);
            alert('Failed to save instructional material.');
        }
    };

    const tabs = [
        { id: 'basic', label: '1. Course Metadata' },
        { id: 'syllabus', label: '2. Syllabus & Outcomes' },
        { id: 'curriculum', label: '3. Curriculum Pack' }
    ];

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="p-4 bg-secondary text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #6c757d 0%, #212121 100%)' }}>
                <div>
                    <h4 className="fw-bold mb-0">Instructional Asset Repository</h4>
                    <p className="small mb-0 opacity-75 fw-medium">Centralized management of CCS Syllabi and Course Materials.</p>
                </div>
                <div className="bg-white rounded-3 p-2 shadow-sm text-secondary"><i className="bi bi-file-earmark-medical fs-4"></i></div>
            </div>

            <div className="card-header bg-white border-bottom border-light pt-3 px-3">
                <ul className="nav nav-pills nav-fill bg-light rounded-pill p-1 mb-2">
                    {tabs.map(tab => (
                        <li className="nav-item" key={tab.id}>
                            <button
                                className={`nav-link rounded-pill py-2 border-0 small fw-bold ${activeTab === tab.id ? 'active bg-white text-secondary shadow-sm' : 'text-muted'}`}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#fcfcfc' }}>
                {activeTab === 'basic' && (
                    <div className="row g-4">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">SUBJECT CODE</label>
                            <input type="text" name="subject_code" className="form-control" placeholder="e.g. IT-311" value={formData.subject_code} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary">MATERIAL / COURSE TITLE</label>
                            <input type="text" name="title" className="form-control" placeholder="e.g. Advanced Database Systems" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary">ASSET TYPE</label>
                            <select name="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                                <option value="Syllabus">Syllabus</option>
                                <option value="Course Pack">Course Pack</option>
                                <option value="Lecture Note">Lecture Note</option>
                                <option value="Laboratory Manual">Laboratory Manual</option>
                                <option value="Course Guide">Course Guide</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-secondary">EXECUTIVE SUMMARY / DESCRIPTION</label>
                            <textarea name="description" className="form-control" rows="4" placeholder="Overview of the course or material content..." value={formData.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="col-12 text-end text-muted small"><i className="bi bi-info-circle-fill me-1"></i> This section defines the primary identity of the instructional asset.</div>
                    </div>
                )}

                {activeTab === 'syllabus' && (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary">COURSE LEARNING OUTCOMES</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="Add explicit outcome" value={outcomeInput} onChange={e => setOutcomeInput(e.target.value)} />
                                <button className="btn btn-secondary" type="button" onClick={() => addListItem('syllabus_json', 'outcomes', outcomeInput, setOutcomeInput)}>Add</button>
                            </div>
                            <ul className="list-group list-group-flush border rounded-4 bg-white p-2">
                                {formData.syllabus_json.outcomes.map((o, i) => <li key={i} className="list-group-item small d-flex justify-content-between">{o} <span className="ms-2 text-danger pointer" onClick={() => removeListItem('syllabus_json', 'outcomes', i)}>×</span></li>)}
                                {formData.syllabus_json.outcomes.length === 0 && <li className="list-group-item small text-muted">No outcomes defined yet.</li>}
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary">WEEKLY LESSON TOPICS</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="Week #: Subject Topic" value={topicInput} onChange={e => setTopicInput(e.target.value)} />
                                <button className="btn btn-secondary" type="button" onClick={() => addListItem('syllabus_json', 'weekly_topics', topicInput, setTopicInput)}>Add</button>
                            </div>
                            <ul className="list-group list-group-flush border rounded-4 bg-white p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {formData.syllabus_json.weekly_topics.map((t, i) => <li key={i} className="list-group-item small d-flex justify-content-between">{t} <span className="ms-2 text-danger pointer" onClick={() => removeListItem('syllabus_json', 'weekly_topics', i)}>×</span></li>)}
                                {formData.syllabus_json.weekly_topics.length === 0 && <li className="list-group-item small text-muted">No topics logged.</li>}
                            </ul>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-secondary">ASSESSMENT METHODS</label>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="e.g. Quizzes (20%), Final Project (40%)" value={assessmentInput} onChange={e => setAssessmentInput(e.target.value)} />
                                <button className="btn btn-secondary" type="button" onClick={() => addListItem('syllabus_json', 'assessment_methods', assessmentInput, setAssessmentInput)}>Add</button>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {formData.syllabus_json.assessment_methods.map((a, i) => <span key={i} className="badge bg-light text-secondary border px-3 py-2 rounded-pill small fw-normal">{a} <span className="ms-2 text-danger pointer" onClick={() => removeListItem('syllabus_json', 'assessment_methods', i)}>×</span></span>)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'curriculum' && (
                    <div className="row g-4">
                        <div className="col-md-12">
                            <label className="form-label small fw-bold text-secondary">COURSE GUIDE / CURRICULUM NOTES</label>
                            <textarea className="form-control bg-light" rows="4" placeholder="Link to full curriculum document or course guide summary..." value={formData.curriculum_json.course_guide} onChange={e => handleNestedChange('curriculum_json', 'course_guide', e.target.value)}></textarea>
                        </div>
                        <div className="col-md-12">
                            <div className="p-4 rounded-4 bg-secondary bg-opacity-10 border-start border-secondary border-5">
                                <h6 className="fw-bold mb-3"><i className="bi bi-link-45deg me-2"></i> Course Prerequisites</h6>
                                <input type="text" className="form-control form-control-sm border-0 bg-white" placeholder="e.g. IT-211 Database Management 1" value={formData.curriculum_json.pre_requisites} onChange={e => handleNestedChange('curriculum_json', 'pre_requisites', e.target.value)} />
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-secondary text-uppercase">Material Digital Assets (Links/Cloud Storage)</label>
                            <div className="row g-2">
                                <div className="col-md-6"><input type="text" className="form-control" placeholder="Lecture Notes URL" value={formData.lesson_json.lecture_notes} onChange={e => handleNestedChange('lesson_json', 'lecture_notes', e.target.value)} /></div>
                                <div className="col-md-6"><input type="text" className="form-control" placeholder="Assignments/Laboratory Tasks URL" value={formData.lesson_json.assignments} onChange={e => handleNestedChange('lesson_json', 'assignments', e.target.value)} /></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end mt-5 pt-4 border-top">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-5 me-2" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-secondary rounded-pill px-5 fw-bold shadow-sm">Save Asset Record</button>
                </div>
            </form>
        </div>
    );
};

export default MaterialForm;
