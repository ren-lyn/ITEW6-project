import React, { useState } from 'react';
import api from '../../api/axios';

const EventForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        event_id: '',
        name: '',
        event_type: 'Academic',
        description: '',
        event_date: '',
        location: '',
        organizer: 'CCS Council',
        status: 'Upcoming',
        participant_requirements_json: {
            skills: '',
            height: '',
            no_violations: false
        }
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: { ...formData[parent], [child]: type === 'checkbox' ? checked : value }
            });
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event. Ensure the Event ID is unique.');
        }
    };

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="p-4 bg-warning text-dark d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #f37021 100%)' }}>
                <div>
                    <h4 className="fw-bold mb-0">Departmental Event Planner</h4>
                    <p className="small mb-0 opacity-75 fw-medium">Manage and organize College of Computing Studies activities.</p>
                </div>
                <div className="bg-white rounded-3 p-2 shadow-sm"><i className="bi bi-calendar-event-fill text-warning fs-4"></i></div>
            </div>

            <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#fffdf5' }}>
                <div className="row g-4">
                    <div className="col-md-3">
                        <label className="form-label small fw-bold">Event ID</label>
                        <input type="text" name="event_id" className="form-control" placeholder="E-202X-XX" value={formData.event_id} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-9">
                        <label className="form-label small fw-bold">Event Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Event Type</label>
                        <select name="event_type" className="form-select" value={formData.event_type} onChange={handleInputChange}>
                            <option value="Academic">Academic</option>
                            <option value="Competition">Competition</option>
                            <option value="Special Event">Special Event</option>
                            <option value="Seminar/Workshop">Seminar/Workshop</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Date</label>
                        <input type="date" name="event_date" className="form-control" value={formData.event_date} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Current Status</label>
                        <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Registration Open">Registration Open</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Organizer / Department</label>
                        <input type="text" name="organizer" className="form-control" value={formData.organizer} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Location</label>
                        <input type="text" name="location" className="form-control" value={formData.location} onChange={handleInputChange} placeholder="e.g. CCS Lab 1" required />
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold">Description & Objectives</label>
                        <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange}></textarea>
                    </div>

                    <div className="col-12">
                        <h6 className="fw-bold mb-3 border-start border-warning border-4 ps-2 text-dark">Participant filtering requirements</h6>
                        <div className="row g-3 p-3 bg-white rounded-4 border border-warning border-opacity-10 shadow-sm">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Required Skills/Talent</label>
                                <input type="text" name="participant_requirements_json.skills" className="form-control form-control-sm" placeholder="e.g. Public Speaking" value={formData.participant_requirements_json.skills} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Height Requirement</label>
                                <input type="text" name="participant_requirements_json.height" className="form-control form-control-sm" placeholder="e.g. 165cm+" value={formData.participant_requirements_json.height} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <div className="form-check mb-1">
                                    <input className="form-check-input" type="checkbox" name="participant_requirements_json.no_violations" checked={formData.participant_requirements_json.no_violations} onChange={handleInputChange} />
                                    <label className="form-check-label small fw-bold">Strictly no violations</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-5 pt-4 border-top">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-5 me-2" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-warning rounded-pill px-5 fw-bold shadow-sm">Launch Event</button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
