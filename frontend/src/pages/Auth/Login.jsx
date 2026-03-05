import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import ccsLogo from '../../assets/CCS LOGO.jpg';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/login', credentials);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
                <div className="row g-0">
                    <div className="col-md-6 bg-primary p-5 d-flex flex-column justify-content-center text-white" style={{ background: 'linear-gradient(135deg, #f37021 0%, #212121 100%)' }}>
                        <div className="mb-4">
                            <img
                                src={ccsLogo}
                                alt="CCS Logo"
                                className="bg-white rounded-circle shadow"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                        <h2 className="display-5 fw-bold mb-3">CCS PROFILER</h2>
                        <h5 className="mb-4 opacity-75">College of Computing Studies</h5>
                        <p className="lead opacity-75">Intelligence-driven profiling system for the College of Computing Studies - Pamantasan ng Cabuyao.</p>
                        <div className="mt-5">
                            <ul className="list-unstyled">
                                <li className="mb-3 d-flex align-items-center"><i className="bi bi-check-circle-fill me-2"></i> Advanced Search & Filtering</li>
                                <li className="mb-3 d-flex align-items-center"><i className="bi bi-check-circle-fill me-2"></i> Comprehensive Student Records</li>
                                <li className="mb-3 d-flex align-items-center"><i className="bi bi-check-circle-fill me-2"></i> Faculty Performance Tracking</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6 p-5 bg-white">
                        <div className="text-center mb-5">
                            <h3 className="fw-bold">Welcome Back</h3>
                            <p className="text-secondary">Please sign in to your corporate account</p>
                        </div>

                        {error && <div className="alert alert-danger border-0 small rounded-3 mb-4">{error}</div>}

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary text-uppercase">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg border-0 bg-light rounded-3 px-3 shadow-none"
                                    placeholder="admin@ccs.edu"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="form-label small fw-bold text-secondary text-uppercase">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control form-control-lg border-0 bg-light rounded-3 px-3 shadow-none"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="text-center mt-5">
                            <p className="small text-muted mb-0">Forgot your password? <a href="#" className="text-primary text-decoration-none">Contact IT Support</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
