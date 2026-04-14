import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentSchedule = () => {
    const [scheduleData, setScheduleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await api.get('/student/schedule');
                setScheduleData(response.data);
            } catch (err) {
                console.error('Error fetching schedule:', err);
                setError(err.response?.data?.message || 'Failed to load schedule');
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="alert alert-danger mx-3 my-4">{error}</div>;

    const { academic, schedules } = scheduleData;

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="card-header bg-white py-3 border-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-0">My Class Schedule</h5>
                            <p className="small text-muted mb-0">{academic.course} - Year {academic.year_level}, Section {academic.section}</p>
                        </div>
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                            {academic.semester} Semester
                        </span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="py-3">Day</th>
                                    <th className="py-3">Time</th>
                                    <th className="py-3">Room</th>
                                    <th className="px-4 py-3">Instructor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.length > 0 ? (
                                    schedules.map((item) => (
                                        <tr key={item.schedule_id}>
                                            <td className="px-4 py-3">
                                                <div className="fw-bold text-dark">{item.title}</div>
                                                <div className="small text-muted">{item.subject_code}</div>
                                            </td>
                                            <td className="py-3">
                                                <span className="badge bg-info bg-opacity-10 text-info fw-medium">
                                                    {item.days_of_week}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="small">
                                                    {new Date('1970-01-01T' + item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                                    {new Date('1970-01-01T' + item.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="small fw-medium text-secondary">{item.room_assignment}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="small">
                                                        {item.faculty?.user?.name || 'Unassigned'}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No schedules found for your current section.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSchedule;
