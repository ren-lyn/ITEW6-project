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
            <div className="row g-4 mb-4 align-items-stretch">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column justify-content-between">
                        <div className="d-flex align-items-center mb-4">
                            <div className="text-white fw-bold rounded-4 d-flex align-items-center justify-content-center me-4 fs-1"
                                style={{ width: '90px', height: '90px', backgroundColor: 'var(--ccs-primary-blue)', boxShadow: '0 4px 15px rgba(59,58,238,0.3)' }}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h4 className="fw-bold mb-1 fs-5 text-dark">{user?.name}</h4>
                                <div className="text-muted small mb-2">{user?.email}</div>
                                <div className="d-flex gap-2">
                                    <span className="badge text-warning bg-warning bg-opacity-10 rounded-pill px-3 py-1">Pending</span>
                                    <span className="badge text-muted bg-light border rounded-pill px-3 py-1 text-capitalize fw-normal">{user?.role}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small fw-medium">Profile Completion</span>
                                <span className="text-muted small">{completion_score}%</span>
                            </div>
                            <div className="progress rounded-pill bg-light" style={{ height: '10px' }}>
                                <div className="progress-bar rounded-pill" role="progressbar" style={{ width: `${completion_score}%`, backgroundColor: 'var(--ccs-accent-orange)' }}></div>
                            </div>
                            <div className="small text-muted mt-2 opacity-75">
                                {completion_score === 100
                                    ? 'Your profile is complete! Check your documents.'
                                    : 'Complete your profile to get approved faster!'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 rounded-4 p-4 h-100 d-flex flex-column justify-content-center text-white"
                        style={{ backgroundColor: 'var(--ccs-primary-blue)', backgroundImage: 'linear-gradient(135deg, var(--ccs-primary-blue) 0%, var(--ccs-primary-blue-hover) 100%)', boxShadow: '0 10px 25px rgba(59,58,238,0.2)' }}>
                        <div className="mb-3">
                            <i className="bi bi-shield-check fs-2 text-white opacity-75"></i>
                        </div>
                        <h5 className="fw-bold mb-2">Profile Status</h5>
                        <p className="small mb-4 text-white text-opacity-75" style={{ lineHeight: '1.5' }}>
                            Your profile is currently pending. Please wait for admin approval.
                        </p>
                        <Link to="/user/profile" className="btn btn-light bg-white bg-opacity-25 border-0 text-white fw-bold rounded-3 py-2 w-100" style={{ backdropFilter: 'blur(5px)' }}>
                            Update Profile
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <Link to="/user/profile" className="text-decoration-none transition-all">
                        <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white d-flex flex-row align-items-center card-stats">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-4" style={{ width: '56px', height: '56px' }}>
                                <i className="bi bi-person fs-4"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">My Profile</h6>
                                <p className="small text-muted mb-0">View and update your information</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-6">
                    <Link to="/user/documents" className="text-decoration-none transition-all">
                        <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white d-flex flex-row align-items-center card-stats">
                            <div className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center me-4" style={{ width: '56px', height: '56px' }}>
                                <i className="bi bi-file-earmark-text fs-4"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">Documents</h6>
                                <p className="small text-muted mb-0">Upload and manage your files</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
