import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import ccsLogo from '../../assets/CCS LOGO.jpg';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (passwords.new_password !== passwords.new_password_confirmation) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/change-password', passwords);
            setMessage(response.data.message);
            
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user'));
            user.must_change_password = false;
            localStorage.setItem('user', JSON.stringify(user));

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="p-5 text-center bg-dark text-white" style={{ background: 'linear-gradient(135deg, #F26A21 0%, #212121 100%)' }}>
                    <img src={ccsLogo} alt="CCS Logo" className="rounded-circle mb-3 bg-white" style={{ width: '80px', height: '80px', border: '3px solid rgba(255,255,255,0.2)' }} />
                    <h3 className="fw-bold mb-0">Secure Your Account</h3>
                    <p className="small opacity-75 mb-0">Please update your temporary password</p>
                </div>
                
                <div className="card-body p-5 bg-white">
                    {error && <div className="alert alert-danger border-0 small rounded-3 mb-4">{error}</div>}
                    {message && <div className="alert alert-success border-0 small rounded-3 mb-4">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary text-uppercase">Current Password</label>
                            <input
                                type="password"
                                name="current_password"
                                className="form-control border-0 bg-light rounded-3 px-3 py-2 shadow-none focus-ring focus-ring-warning"
                                placeholder="Temporary password"
                                value={passwords.current_password}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-text x-small">The ID used when your account was created.</div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary text-uppercase">New Password</label>
                            <input
                                type="password"
                                name="new_password"
                                className="form-control border-0 bg-light rounded-3 px-3 py-2 shadow-none focus-ring focus-ring-warning"
                                value={passwords.new_password}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-text x-small">At least 8 characters long.</div>
                        </div>

                        <div className="mb-5">
                            <label className="form-label small fw-bold text-secondary text-uppercase">Confirm New Password</label>
                            <input
                                type="password"
                                name="new_password_confirmation"
                                className="form-control border-0 bg-light rounded-3 px-3 py-2 shadow-none focus-ring focus-ring-warning"
                                value={passwords.new_password_confirmation}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm text-white border-0 transition-all"
                            disabled={loading}
                            style={{ backgroundColor: '#F26A21' }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = '#d95a1a'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = '#F26A21'; }}
                        >
                            {loading ? 'Processing...' : 'Update & Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
