import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [scoreData, setScoreData] = useState({ completion_score: 0, missing_fields: [] });
    const [loading, setLoading] = useState(true);
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const response = await api.get('/profile/completion');
                setScoreData(response.data);
            } catch (error) {
                console.error('Error fetching profile completion:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchScore();
    }, []);

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    const { completion_score, missing_fields } = scoreData;

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Welcome, {user?.name}!</h2>
                <p className="text-secondary">Manage your profile and documents</p>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-row align-items-center bg-white">
                        <div className="bg-primary text-white fs-1 fw-bold rounded-4 d-flex align-items-center justify-content-center me-4" style={{ width: '80px', height: '80px' }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h4 className="fw-bold mb-1">{user?.name}</h4>
                            <div className="text-muted small mb-2">{user?.email}</div>
                            <span className="badge bg-warning text-dark me-2 border">Pending</span>
                            <span className="badge bg-light text-dark border text-capitalize">{user?.role}</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card shadow-sm border-0 rounded-4 p-4 h-100" style={{ background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)', color: 'white' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="fw-bold mb-0">Profile Completion</h5>
                            </div>
                            <div className="fs-5 fw-bold">{completion_score}%</div>
                        </div>
                        <div className="progress mb-3 bg-white bg-opacity-25" style={{ height: '10px' }}>
                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${completion_score}%` }}></div>
                        </div>
                        <p className="small mb-3 opacity-75">
                            {completion_score === 100
                                ? 'Your profile is complete! Check your documents.'
                                : `Complete your profile to get approved faster! Missing: ${missing_fields.length} items.`}
                        </p>
                        <Link to="/user/profile" className="btn btn-primary bg-white bg-opacity-25 border-0 rounded-pill w-100 fw-bold">Update Profile</Link>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 bg-white">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-person fs-3"></i>
                        </div>
                        <h5 className="fw-bold">My Profile</h5>
                        <p className="small text-muted mb-4">View and update your personal, academic, and contact information.</p>
                        <Link to="/user/profile" className="btn btn-outline-primary rounded-pill mt-auto">Go to Profile</Link>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 bg-white">
                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-file-earmark-text fs-3"></i>
                        </div>
                        <h5 className="fw-bold">Documents</h5>
                        <p className="small text-muted mb-4">Upload and track the status of your required documents and files.</p>
                        <Link to="/user/documents" className="btn btn-outline-success rounded-pill mt-auto">Manage Documents</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
