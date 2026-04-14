import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await api.get('/student/attendance');
                setAttendance(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 border-0">
                    <h5 className="fw-bold mb-0">My Attendance Records</h5>
                    <p className="small text-muted mb-0">Track your attendance for all classes.</p>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Subject / Class</th>
                                    <th className="px-4 py-3">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.length > 0 ? (
                                    attendance.map((record) => (
                                        <tr key={record.attendance_id}>
                                            <td className="px-4 py-3 fw-bold">{new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                            <td className="py-3">
                                                <span className={`badge rounded-pill px-3 py-1 ${
                                                    record.status === 'Present' ? 'bg-success bg-opacity-10 text-success' :
                                                    record.status === 'Absent' ? 'bg-danger bg-opacity-10 text-danger' :
                                                    'bg-warning bg-opacity-10 text-warning'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="small fw-medium">{record.schedule?.title || 'General'}</div>
                                                <div className="extra-small text-muted">{record.schedule?.subject_code}</div>
                                            </td>
                                            <td className="px-4 py-3 text-muted small">{record.remarks || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">No attendance records found.</td>
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

export default StudentAttendance;
