import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const AttendanceHistory = () => {
    const { section } = useParams();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSubject, setFilterSubject] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, [section, filterSubject]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const params = { section };
            if (filterSubject) params.subject = filterSubject;
            
            const response = await api.get('/attendance', { params });
            setAttendance(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'success';
            case 'absent': return 'danger';
            case 'late': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb small text-uppercase fw-bold">
                            <li className="breadcrumb-item"><Link to="/user" className="text-decoration-none">Dashboard</Link></li>
                            <li className="breadcrumb-item active">Attendance</li>
                            <li className="breadcrumb-item active">{section} History</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold text-dark mb-1">Attendance History: {section}</h4>
                    <p className="text-muted">Review all imported attendance records for this section.</p>
                </div>
                <div>
                    <Link to={`/user/attendance/import/${section}`} className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold">
                        <i className="bi bi-upload me-2"></i> Import New
                    </Link>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 border-0">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Filter by subject..." 
                                    value={filterSubject}
                                    onChange={(e) => setFilterSubject(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4 border-0 text-muted small text-uppercase py-3">Student</th>
                                    <th className="border-0 text-muted small text-uppercase py-3">Subject</th>
                                    <th className="border-0 text-muted small text-uppercase py-3">Date</th>
                                    <th className="border-0 text-muted small text-uppercase py-3">Status</th>
                                    <th className="border-0 text-muted small text-uppercase py-3">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                            Loading history...
                                        </td>
                                    </tr>
                                ) : attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No attendance records found for this criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    attendance.map((record) => (
                                        <tr key={record.attendance_id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                                                        <i className="bi bi-person text-secondary"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{record.student?.first_name} {record.student?.last_name}</div>
                                                        <div className="extra-small text-muted">{record.student?.id_number}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark fw-medium border">{record.subject || 'N/A'}</span>
                                            </td>
                                            <td>{new Date(record.date).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge bg-${getStatusBadge(record.status)} text-capitalize px-3 py-2 rounded-pill`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small text-muted">{record.remarks || '-'}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistory;
