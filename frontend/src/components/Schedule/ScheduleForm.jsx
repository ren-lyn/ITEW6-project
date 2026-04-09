import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const ScheduleForm = ({ schedule, onSave, onCancel }) => {
    const [formData, setFormData] = useState(schedule ? { ...schedule } : {
        schedule_type: 'Class',
        title: '',
        subject_code: '',
        section: '',
        year_level: '',
        faculty_id: '',
        event_id: '',
        days_of_week: '',
        start_time: '',
        end_time: '',
        room_assignment: ''
    });

    const [faculty, setFaculty] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facRes, evRes] = await Promise.all([
                    api.get('/faculty'),
                    api.get('/events')
                ]);
                setFaculty(facRes.data.data || facRes.data);
                setEvents(evRes.data.data || evRes.data);
            } catch (error) {
                console.error("Error fetching lookups:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (schedule && schedule.schedule_id) {
                await api.put(`/schedules/${schedule.schedule_id}`, formData);
            } else {
                await api.post('/schedules', formData);
            }
            if (onSave) onSave();
        } catch (error) {
            console.error("Error saving schedule:", error);
            alert("Failed to save schedule. Ensure all required fields are correctly specified.");
        }
    };

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden fade-in">
            <div className="p-4 bg-primary text-white d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold mb-0">Resource Scheduling Engine</h4>
                    <p className="small mb-0 opacity-75 fw-medium">Allocate faculty, venues, and timeframes securely.</p>
                </div>
                <div className="bg-white rounded-3 p-2 shadow-sm"><i className="bi bi-calendar3 text-primary fs-4"></i></div>
            </div>

            <form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#fdfdfd' }}>
                <div className="row g-4 mb-4">
                    <div className="col-md-12">
                        <label className="form-label small fw-bold text-uppercase tracking-wider">Schedule Type Classification</label>
                        <select name="schedule_type" className="form-select form-select-lg shadow-sm" value={formData.schedule_type} onChange={handleChange}>
                            <option value="Class">Academic Class</option>
                            <option value="Event">College Event</option>
                            <option value="General Session">General Session</option>
                        </select>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label small fw-bold">Title / Designation</label>
                        <input type="text" name="title" className="form-control" value={formData.title || ''} onChange={handleChange} required placeholder="e.g. Introduction to Computing" />
                    </div>

                    {formData.schedule_type === 'Class' && (
                        <>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Subject Code</label>
                                <input type="text" name="subject_code" className="form-control" value={formData.subject_code || ''} onChange={handleChange} placeholder="e.g. ITEW6" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Section</label>
                                <input type="text" name="section" className="form-control" value={formData.section || ''} onChange={handleChange} placeholder="e.g. 3A" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Year Level</label>
                                <input type="text" name="year_level" className="form-control" value={formData.year_level || ''} onChange={handleChange} placeholder="e.g. 3" />
                            </div>
                            <div className="col-md-12 mt-4">
                                <label className="form-label small fw-bold"><i className="bi bi-person-badge text-primary me-2"></i> Assigned Faculty Member</label>
                                <select name="faculty_id" className="form-select shadow-sm" value={formData.faculty_id || ''} onChange={handleChange}>
                                    <option value="">-- Autoselect Instructor via Database Lookup --</option>
                                    {faculty.map((f) => (
                                        <option key={f.faculty_id} value={f.faculty_id}>
                                            {f.user?.first_name} {f.user?.last_name} ({f.department || 'Faculty'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {formData.schedule_type === 'Event' && (
                        <div className="col-md-12 mt-4">
                            <label className="form-label small fw-bold"><i className="bi bi-calendar-event text-warning me-2"></i> Link to College Event Database</label>
                            <select name="event_id" className="form-select shadow-sm" value={formData.event_id || ''} onChange={handleChange}>
                                <option value="">-- Map to Existing College Event --</option>
                                {events.map((ev) => (
                                    <option key={ev.event_id} value={ev.event_id}>
                                        {ev.name} (Mapped Event ID: {ev.event_code || ev.event_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <h6 className="fw-bold mb-3 border-start border-primary border-4 ps-3 text-dark mt-5">Time & Venue Configuration</h6>
                <div className="row g-3 p-4 bg-light rounded-4 border shadow-sm">
                    <div className="col-md-12">
                        <label className="form-label small fw-bold text-muted">Days of Week Syntax (e.g., MWF, TTh, Sat)</label>
                        <input type="text" name="days_of_week" className="form-control" value={formData.days_of_week || ''} onChange={handleChange} placeholder="MWF" required />
                    </div>
                    <div className="col-md-4 mt-4">
                        <label className="form-label small fw-bold text-muted">Start Interval</label>
                        <input type="time" name="start_time" className="form-control" value={formData.start_time || ''} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mt-4">
                        <label className="form-label small fw-bold text-muted">End Interval</label>
                        <input type="time" name="end_time" className="form-control" value={formData.end_time || ''} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mt-4">
                        <label className="form-label small fw-bold text-muted">Facility Allocation</label>
                        <input type="text" name="room_assignment" className="form-control" value={formData.room_assignment || ''} onChange={handleChange} required placeholder="e.g. CCS Lab 1" />
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-5 pt-4 border-top">
                    <button type="button" className="btn btn-light rounded-pill px-5 me-3 shadow-sm border" onClick={onCancel}>Cancel Edit</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm">
                        <i className="bi bi-cloud-arrow-up me-2"></i>
                        {schedule ? 'Update Matrix Parameters' : 'Publish to Roster'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleForm;
