import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/students?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading Dashboard...</span>
                </div>
            </div>
        );
    }

    const { stats, charts } = data;

    return (
        <div>
            <div className="mb-5">
                <h2 className="display-4 fw-bold text-dark mb-1 d-flex align-items-center">
                    <span className="me-3">Institutional Intelligence</span>
                    <span className="badge bg-success rounded-pill small p-2" style={{ fontSize: '0.8rem' }}>Live Stats</span>
                </h2>
                <p className="text-secondary lead">College of Computing Studies: Comprehensive Student & Faculty Metrics.</p>
            </div>

            <div className="row g-4 mb-5">
                {[
                    { t: 'Total Students', c: stats.total_students, b: 'bg-primary', i: 'bi-people-fill' },
                    { t: 'Faculty Members', c: stats.total_faculty, b: 'bg-success', i: 'bi-person-badge' },
                    { t: 'Research/Works', c: stats.total_research, b: 'bg-info', i: 'bi-journal-richtext' },
                    { t: 'Active Events', c: stats.upcoming_events, b: 'bg-warning', i: 'bi-calendar-check' }
                ].map((item, i) => (
                    <div className="col-md-3" key={i}>
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 card-stats">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <div className="text-muted small fw-bold text-uppercase mb-1">{item.t}</div>
                                    <div className="h1 fw-bold mb-0 text-dark">{item.c}</div>
                                </div>
                                <div className={`rounded-4 d-flex align-items-center justify-content-center ${item.b} bg-opacity-10`} style={{ width: '56px', height: '56px' }}>
                                    <i className={`bi ${item.i} fs-3 ${item.b.replace('bg-', 'text-')}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    {/* Demographics Chart (Course) */}
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Student Distribution By Program</h5>
                            <button className="btn btn-sm btn-light border rounded-pill px-3">Filter Details</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="text-muted small text-uppercase">
                                    <tr><th>Lead Sub-Program</th><th className="text-center">Active Enrollees</th><th>Demographics</th></tr>
                                </thead>
                                <tbody>
                                    {charts.students_by_course.map((item, i) => (
                                        <tr key={i}>
                                            <td className="fw-bold text-secondary py-3">{item.course}</td>
                                            <td className="text-center fw-bold">{item.total}</td>
                                            <td style={{ width: '40%' }}>
                                                <div className="progress rounded-pill overflow-hidden" style={{ height: '8px' }}>
                                                    <div className="progress-bar bg-primary" style={{ width: `${(item.total / stats.total_students) * 100}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Academic Standing */}
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-4">Academic Performance Status</h5>
                        <div className="row g-3">
                            {charts.standing_summary.map((st, i) => (
                                <div className="col-md-4" key={i}>
                                    <div className="p-3 bg-light rounded-4 border text-center h-100">
                                        <div className="small text-muted">{st.academic_standing.toUpperCase()}</div>
                                        <h3 className="fw-bold mb-0 text-dark">{st.total}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* RISK PROFILER */}
                    <div className="card border-0 shadow-lg rounded-4 p-0 overflow-hidden mb-4" style={{ background: '#1c1c1c' }}>
                        <div className="p-4 bg-danger text-white">
                            <h5 className="fw-bold mb-0"><i className="bi bi-shield-lock-fill me-2"></i> RISK PROFILER</h5>
                            <small className="opacity-75">Automated Intelligence Monitoring</small>
                        </div>
                        <div className="p-4 text-white">
                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div className="small opacity-75">Academic Risk</div>
                                        <h3 className="fw-bold mb-0 text-danger">{charts.risk_summary.academic_risk}</h3>
                                    </div>
                                    <span className="badge bg-danger rounded-pill px-3 py-2 small">High</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div className="small opacity-75">Attendance Risk</div>
                                        <h3 className="fw-bold mb-0 text-warning">{charts.risk_summary.attendance_risk}</h3>
                                    </div>
                                    <span className="badge bg-warning text-dark rounded-pill px-3 py-2 small">Moderate</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div className="small opacity-75">Financial Concerns</div>
                                        <h3 className="fw-bold mb-0 text-info">{charts.risk_summary.financial_concern}</h3>
                                    </div>
                                    <span className="badge bg-info text-dark rounded-pill px-3 py-2 small">Insight</span>
                                </div>
                            </div>
                            <button className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow-sm mt-5">View High Priority Actions</button>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white text-center">
                        <i className="bi bi-clock-history display-4 mb-3"></i>
                        <h5 className="fw-bold">Activity Logs</h5>
                        <p className="small opacity-75">View system activity and audit logs for the last 24 hours.</p>
                        <button className="btn btn-light text-primary rounded-pill fw-bold w-100 mt-3">Access Logs</button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white shadow-sm border rounded-4 mt-5">
                <form onSubmit={handleSearch} className="row g-3">
                    <div className="col-md-9">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light border-0 px-4"><i className="bi bi-search text-muted"></i></span>
                            <input
                                type="text"
                                className="form-control bg-light border-0 shadow-none rounded-end-pill px-4"
                                placeholder="Search student by Name, Skill, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm fw-bold">Query Database</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
