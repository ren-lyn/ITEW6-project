import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const AttendanceAnalytics = () => {
    const { section } = useParams();
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSubject, setFilterSubject] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, [section, filterSubject]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const params = { section };
            if (filterSubject) params.subject = filterSubject;
            const response = await api.get('/attendance/analytics', { params });
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (status) => {
        switch (status) {
            case 'Critical': return '#dc3545'; // Red
            case 'High Risk': return '#fd7e14'; // Orange
            case 'Medium Risk': return '#ffc107'; // Yellow
            case 'Low Risk': return '#198754'; // Green
            default: return '#6c757d';
        }
    };

    const getRiskBg = (status) => {
        switch (status) {
            case 'Critical': return 'rgba(220, 53, 69, 0.1)';
            case 'High Risk': return 'rgba(253, 126, 20, 0.1)';
            case 'Medium Risk': return 'rgba(255, 193, 7, 0.1)';
            case 'Low Risk': return 'rgba(25, 135, 84, 0.1)';
            default: return 'rgba(108, 117, 125, 0.1)';
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
                            <li className="breadcrumb-item active">{section} Analytics</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold text-dark mb-1">Predictive Risk Analytics: {section}</h4>
                    <p className="text-muted small">System identifying students at-risk based on cumulative attendance patterns.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to={`/user/attendance/history/${section}`} className="btn btn-light rounded-pill px-4 border small fw-bold">
                        <i className="bi bi-clock-history me-2"></i> View History
                    </Link>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-header bg-white py-3 border-0">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4">
                            <label className="extra-small text-muted text-uppercase fw-bold mb-1">Filter by Subject</label>
                            <input 
                                type="text" 
                                className="form-control form-control-sm border-light" 
                                placeholder="e.g. Web Development" 
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4 border-0 text-muted small text-uppercase py-3">Student Name</th>
                                    <th className="border-0 text-muted small text-uppercase py-3 text-center">Absences</th>
                                    <th className="border-0 text-muted small text-uppercase py-3 text-center">Lates</th>
                                    <th className="border-0 text-muted small text-uppercase py-3 text-center">Absence Rate</th>
                                    <th className="pe-4 border-0 text-muted small text-uppercase py-3 text-end">Risk Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        </td>
                                    </tr>
                                ) : analytics.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No attendance data available for analysis.</td>
                                    </tr>
                                ) : (
                                    analytics.map((item) => (
                                        <tr key={item.student_id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark">{item.name}</div>
                                                <div className="extra-small text-muted">{item.id_number}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`fw-bold ${item.absent_count > 0 ? 'text-danger' : 'text-muted'}`}>
                                                    {item.absent_count}
                                                </span>
                                            </td>
                                            <td className="text-center">{item.late_count}</td>
                                            <td className="text-center">
                                                <div className="progress mx-auto" style={{ height: '6px', width: '60px' }}>
                                                    <div 
                                                        className="progress-bar" 
                                                        role="progressbar" 
                                                        style={{ 
                                                            width: `${item.absence_rate}%`,
                                                            backgroundColor: getRiskColor(item.risk_status)
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="extra-small mt-1 text-muted">{item.absence_rate}%</div>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <span 
                                                    className="badge border rounded-pill px-3 py-2 text-uppercase extra-small fw-bold"
                                                    style={{ 
                                                        backgroundColor: getRiskBg(item.risk_status),
                                                        color: getRiskColor(item.risk_status),
                                                        borderColor: `${getRiskColor(item.risk_status)}44`
                                                    }}
                                                >
                                                    {item.risk_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'rgba(220, 53, 69, 0.05)', borderLeft: '4px solid #dc3545' }}>
                        <h6 className="fw-bold text-danger mb-2">Critical Risk</h6>
                        <p className="extra-small text-dark mb-0 opacity-75">
                            >= 20% absence rate or 3 total absences. Requires immediate reach-out.
                        </p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'rgba(253, 126, 20, 0.05)', borderLeft: '4px solid #fd7e14' }}>
                        <h6 className="fw-bold mb-2" style={{ color: '#fd7e14' }}>High Risk</h6>
                        <p className="extra-small text-dark mb-0 opacity-75">
                            >= 15% absence rate or 2 total absences. Monitor closely.
                        </p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'rgba(255, 193, 7, 0.05)', borderLeft: '4px solid #ffc107' }}>
                        <h6 className="fw-bold text-warning mb-2">Medium Risk</h6>
                        <p className="extra-small text-dark mb-0 opacity-75">
                            >= 5% pattern, 1 absence, or 2+ lates. Early behavioral warning.
                        </p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'rgba(25, 135, 84, 0.05)', borderLeft: '4px solid #198754' }}>
                        <h6 className="fw-bold text-success mb-2">Low Risk</h6>
                        <p className="extra-small text-dark mb-0 opacity-75">
                            Maintaining good attendance standards with minimal disruptions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceAnalytics;
