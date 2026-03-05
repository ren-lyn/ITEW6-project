import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import EventForm from './EventForm';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (showForm) {
        return <EventForm onSave={() => { setShowForm(false); fetchEvents(); }} onCancel={() => setShowForm(false)} />;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-6 fw-bold mb-0">College Events</h2>
                <button className="btn btn-warning rounded-pill px-4 shadow-sm text-dark fw-bold" onClick={() => setShowForm(true)}>+ Add Event</button>
            </div>

            <div className="row g-4">
                <div className="col-md-12">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-primary text-white overflow-hidden position-relative">
                        <div className="position-relative z-index-1">
                            <h4 className="fw-bold">Welcome to CCS Events Manager</h4>
                            <p className="mb-0 opacity-75">Track and manage all activities within the College of Computing Studies.</p>
                        </div>
                        <i className="bi bi-calendar-event position-absolute end-0 bottom-0 display-1 opacity-10 me-4 mb-2"></i>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5 w-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    events.map((event) => (
                        <div className="col-md-6" key={event.id}>
                            <div className="card border-0 shadow-sm rounded-4 h-100 p-0 overflow-hidden card-stats">
                                <div className="p-4">
                                    <div className="d-flex justify-content-between align-items-<ctrl94> mb-3">
                                        <div className="d-flex gap-2">
                                            <span className="badge bg-warning text-dark rounded-pill px-3 py-2 small fw-bold shadow-sm">{event.event_type}</span>
                                            <span className={`badge rounded-pill px-3 py-2 small fw-bold border shadow-sm ${event.status === 'Completed' ? 'bg-secondary' : (event.status === 'Ongoing' ? 'bg-success' : 'bg-light text-dark')}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <div className="text-muted small fw-bold">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    </div>
                                    <div className="text-primary x-small fw-bold mb-1 opacity-75">{event.event_id}</div>
                                    <h5 className="fw-bold mb-2">{event.name}</h5>
                                    <p className="text-secondary small mb-4" style={{ minHeight: '40px' }}>{event.description}</p>

                                    <div className="row g-2 mb-4 border-top pt-3">
                                        <div className="col-6">
                                            <div className="small text-muted mb-1 x-small"><i className="bi bi-geo-alt me-1"></i> LOCATION</div>
                                            <div className="fw-bold small">{event.location}</div>
                                        </div>
                                        <div className="col-6">
                                            <div className="small text-muted mb-1 x-small"><i className="bi bi-people-fill me-1"></i> ORGANIZER</div>
                                            <div className="fw-bold small">{event.organizer}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-primary rounded-pill btn-sm px-4 fw-bold">View Assets</button>
                                        <button className="btn btn-outline-secondary rounded-pill btn-sm px-4">Edit Info</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!loading && events.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <div className="card border-0 shadow-sm rounded-4 p-5 bg-white">
                            <i className="bi bi-calendar-x display-4 text-light mb-3"></i>
                            <h5 className="text-secondary">No events scheduled yet.</h5>
                            <button className="btn btn-link text-primary text-decoration-none" onClick={() => fetchEvents()}>Refresh</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;
