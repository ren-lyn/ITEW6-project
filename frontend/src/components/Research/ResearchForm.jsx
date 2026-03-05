import React, { useState } from 'react';
import api from '../../api/axios';

const ResearchForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        research_category: 'Artificial Intelligence',
        publication_year: new Date().getFullYear(),
        adviser: '',
        research_status: 'Completed',
        authors_json: []
    });

    const [authorInput, setAuthorInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const addAuthor = () => {
        if (authorInput && !formData.authors_json.includes(authorInput)) {
            setFormData({ ...formData, authors_json: [...formData.authors_json, authorInput] });
            setAuthorInput('');
        }
    };

    const removeAuthor = (index) => {
        const newList = [...formData.authors_json];
        newList.splice(index, 1);
        setFormData({ ...formData, authors_json: newList });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/research', formData);
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving research:', error);
            alert('Failed to save research record.');
        }
    };

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="p-4 bg-info text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #087990 100%)' }}>
                <div>
                    <h4 className="fw-bold mb-0">Intellectual Asset Management</h4>
                    <p className="small mb-0 opacity-75 fw-medium">Record and archive research projects and publications.</p>
                </div>
                <div className="bg-white rounded-3 p-2 shadow-sm"><i className="bi bi-book-half text-info fs-4"></i></div>
            </div>

            <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#f8fcfe' }}>
                <div className="row g-4">
                    <div className="col-12">
                        <label className="form-label small fw-bold text-secondary">RESEARCH PROJECT TITLE</label>
                        <input type="text" name="title" className="form-control form-control-lg border-info border-opacity-10 shadow-sm" style={{ fontWeight: 600 }} value={formData.title} onChange={handleInputChange} required placeholder="Enter research project name..." />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">CATEGORY</label>
                        <select name="research_category" className="form-select border-info border-opacity-10" value={formData.research_category} onChange={handleInputChange}>
                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Software Engineering">Software Engineering</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="IoT/Embedded Systems">IoT/Embedded Systems</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small fw-bold text-secondary">PROJECT YEAR</label>
                        <input type="number" name="publication_year" className="form-control" value={formData.publication_year} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small fw-bold text-secondary">LIFECYCLE STATUS</label>
                        <select name="research_status" className="form-select text-info fw-bold" value={formData.research_status} onChange={handleInputChange}>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold text-secondary">ABSTRACT / EXECUTIVE SUMMARY</label>
                        <textarea name="abstract" className="form-control border-info border-opacity-10" rows="5" placeholder="Define objectives, scope, and findings..." value={formData.abstract} onChange={handleInputChange}></textarea>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">LEAD ADVISER / MENTOR</label>
                        <input type="text" name="adviser" className="form-control" value={formData.adviser} onChange={handleInputChange} required placeholder="Name of Faculty Adviser" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">TEAM MEMBERS / AUTHORS</label>
                        <div className="input-group mb-2">
                            <input type="text" className="form-control" placeholder="Add researchers" value={authorInput} onChange={(e) => setAuthorInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())} />
                            <button className="btn btn-info text-white px-4" type="button" onClick={addAuthor}>Add</button>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {formData.authors_json.map((a, i) => (
                                <span key={i} className="badge bg-white text-info border border-info border-opacity-25 px-3 py-2 rounded-pill shadow-sm small fw-medium">
                                    {a} <span className="ms-2 pointer text-danger" onClick={() => removeAuthor(i)}>×</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-5 pt-4 border-top">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-5 me-2" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-info text-white rounded-pill px-5 fw-bold shadow-sm">Archive Assets</button>
                </div>
            </form>
        </div>
    );
};

export default ResearchForm;
