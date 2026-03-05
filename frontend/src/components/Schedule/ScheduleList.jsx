import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await api.get('/schedules');
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-6 fw-bold mb-0">Class & Event Schedules</h2>
                <button className="btn btn-outline-primary rounded-pill px-4 shadow-sm">+ Create Schedule</button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading Schedule...</span>
                    </div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <thead className="bg-primary text-white text-center">
                                <tr>
                                    <th style={{ width: '120px' }}>Type</th>
                                    <th>Subject / Title</th>
                                    <th>Section</th>
                                    <th>Days</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Faculty/Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((s) => (
                                    <tr key={s.id} className="text-center">
                                        <td>
                                            <span className={`badge rounded-pill ${s.schedule_type === 'class' ? 'bg-primary' : (s.schedule_type === 'event' ? 'bg-warning text-dark' : 'bg-info')} px-3 py-2 fw-bold small`}>
                                                {s.schedule_type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{s.subject_code || '---'}</div>
                                            <div className="small text-muted">{s.title}</div>
                                        </td>
                                        <td>
                                            <div className="small fw-bold">{s.section || '---'}</div>
                                            <div className="x-small text-muted">{s.year_level ? `${s.year_level} Year` : ''}</div>
                                        </td>
                                        <td className="small fw-medium">{s.days_of_week}</td>
                                        <td className="small">
                                            {s.start_time && s.end_time ? `${s.start_time.substring(0, 5)} - ${s.end_time.substring(0, 5)}` : 'N/A'}
                                        </td>
                                        <td><span className="badge bg-light text-dark border">{s.room_assignment || '---'}</span></td>
                                        <td className="small">{s.user ? s.user.name : (s.event ? s.event.name : 'Unassigned')}</td>
                                    </tr>
                                ))}
                                {schedules.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No schedules found for this period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleList;
