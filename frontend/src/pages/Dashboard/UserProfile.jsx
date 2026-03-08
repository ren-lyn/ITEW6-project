import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve basic user info from localStorage to populate the header immediately
        const userJson = localStorage.getItem('user');
        if (userJson && userJson !== "undefined") {
            try {
                setUser(JSON.parse(userJson));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }

        // In a real implementation, we would fetch the full profile data from the backend here
        setTimeout(() => setLoading(false), 500); // Simulate network request
    }, []);

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    return (
        <div>
            {/* Top Blue Banner Section */}
            <div className="card border-0 rounded-start-4 rounded-end-4 mb-4 text-white overflow-hidden shadow-sm" style={{
                backgroundColor: 'var(--ccs-primary-blue)',
                borderBottomLeftRadius: '0 !important',
                borderBottomRightRadius: '0 !important'
            }}>
                <div className="p-4 d-flex align-items-center">
                    <div className="bg-white bg-opacity-25 text-white fw-bold rounded-4 d-flex align-items-center justify-content-center me-4 fs-1"
                        style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 className="fw-bold mb-1">{user?.name || 'Loading Name...'}</h3>
                        <div className="text-white text-opacity-75 mb-2">{user?.email || 'Loading Email...'}</div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-1 fw-normal text-capitalize">
                                {user?.role || 'Role'} • <span className="text-warning fw-bold">Pending</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form Content */}
            <div className="card shadow-sm border-0 rounded-4 bg-white px-4 py-5" style={{ marginTop: '-20px', position: 'relative', zIndex: 1 }}>

                {/* Personal Information */}
                <h6 className="fw-bold mb-4 text-dark">Personal Information</h6>
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Full Name</label>
                        <input type="text" className="form-control rounded-3 py-2 border-opacity-50" defaultValue={user?.name} readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Email</label>
                        <input type="email" className="form-control rounded-3 py-2 border-opacity-50" defaultValue={user?.email} readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Contact Number</label>
                        <input type="text" className="form-control rounded-3 py-2 border-opacity-50 text-muted" placeholder="Enter contact number" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Address</label>
                        <input type="text" className="form-control rounded-3 py-2 border-opacity-50 text-muted" placeholder="Enter your address" />
                    </div>
                </div>

                {/* Academic Information */}
                <h6 className="fw-bold mb-4 text-dark">Academic Information</h6>
                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Student ID</label>
                        <input type="text" className="form-control rounded-3 py-2 border-opacity-50 text-muted" defaultValue="STUMMHGZOJB" readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small text-muted mb-1">Course</label>
                        <select className="form-select rounded-3 py-2 border-opacity-50 text-dark">
                            <option>Select Course</option>
                            <option value="BSCS">BS in Computer Science</option>
                            <option value="BSIT">BS in Information Technology</option>
                            <option value="BSIS">BS in Information Systems</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
