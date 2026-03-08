import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

// Components
import StudentList from './components/Student/StudentList';
import FacultyList from './components/Faculty/FacultyList';
import EventList from './components/Event/EventList';
import ResearchList from './components/Research/ResearchList';
import MaterialList from './components/Material/MaterialList';
import ScheduleList from './components/Schedule/ScheduleList';

// Profiling Cycle Pages
import UserDashboard from './pages/Dashboard/UserDashboard';
import DocumentUpload from './pages/Document/DocumentUpload';
import VerificationList from './pages/Admin/VerificationList';
import AdminReports from './pages/Admin/AdminReports';
import AdminArchives from './pages/Admin/AdminArchives';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import UserProfile from './pages/Dashboard/UserProfile';
import Login from './pages/Auth/Login';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const userJson = localStorage.getItem('user');
    let user = null;
    try {
        if (userJson && userJson !== "undefined") {
            user = JSON.parse(userJson);
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
    }
    const role = user?.role || 'student';

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    let menuItems = [];
    if (role === 'admin') {
        menuItems = [
            { name: 'Admin Dashboard', path: '/', icon: 'bi-grid-1x2' },
            { name: 'Verification Approvals', path: '/verifications', icon: 'bi-check2-square' },
            { name: 'Reports & Analytics', path: '/reports', icon: 'bi-bar-chart-steps' },
            { name: 'Archived Profiles', path: '/archives', icon: 'bi-archive' },
            { name: 'Students', path: '/students', icon: 'bi-people' },
            { name: 'Faculty', path: '/faculty', icon: 'bi-person-badge' },
            { name: 'Events', path: '/events', icon: 'bi-calendar-date' },
            { name: 'Scheduling', path: '/scheduling', icon: 'bi-clock-history' },
            { name: 'Research', path: '/research', icon: 'bi-journal-code' },
            { name: 'Materials', path: '/materials', icon: 'bi-file-earmark-pdf' },
        ];
    } else if (role === 'faculty') {
        menuItems = [
            { name: 'Faculty Dashboard', path: '/', icon: 'bi-grid-1x2' },
            { name: 'My Profile', path: '/profile', icon: 'bi-person' },
            { name: 'Documents', path: '/documents', icon: 'bi-file-earmark' },
            { name: 'My Syllabi/Research', path: '/research', icon: 'bi-journal-text' },
        ];
    } else {
        menuItems = [
            { name: 'Student Dashboard', path: '/', icon: 'bi-grid-1x2' },
            { name: 'My Profile', path: '/profile', icon: 'bi-person' },
            { name: 'Documents', path: '/documents', icon: 'bi-file-earmark' },
            { name: 'Events', path: '/events', icon: 'bi-calendar-event' },
        ];
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-dark sticky-top px-4 py-3" style={{ backgroundColor: 'var(--ccs-bg-dark)', zIndex: 1040 }}>
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span className="fs-5 tracking-tight ms-2">CCS PROFILER</span>
                </Link>
                <div className="d-flex align-items-center">
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 shadow-none border-0" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
            <div className="container-fluid flex-grow-1">
                <div className="row flex-nowrap h-100">
                    <nav className="col-md-2 d-none d-md-block sidebar py-4 sticky-top shadow-sm" style={{ top: '64px', height: 'calc(100vh - 64px)', zIndex: 1030 }}>
                        <div className="sidebar-sticky h-100 d-flex flex-column">
                            {/* Top part of sidebar removed logo */}
                            <ul className="nav flex-column px-3 flex-grow-1 mt-2">
                                {menuItems.map((item) => (
                                    <li className="nav-item mb-2" key={item.path}>
                                        <Link
                                            className={`nav-link py-2 px-3 d-flex align-items-center transition-all ${location.pathname === item.path ? 'active' : ''}`}
                                            to={item.path}
                                        >
                                            <i className={`bi ${item.icon} me-3 fs-5`}></i>
                                            <span className="fw-medium">{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto px-4 py-3 border-top border-secondary border-opacity-25 d-flex align-items-center">
                                <div className="bg-success text-white fw-bold rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="fw-bold text-white text-truncate">{user?.name || 'Guest User'}</div>
                                    <div className="text-muted small text-capitalize">{user?.role || 'Guest'}</div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <main role="main" className="col-md-10 ms-sm-auto px-md-5 py-5 overflow-auto" style={{ backgroundColor: 'var(--ccs-bg-light)', minHeight: 'calc(100vh - 64px)' }}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = !!localStorage.getItem('access_token');
    const userJson = localStorage.getItem('user');
    let user = null;
    try {
        if (userJson && userJson !== "undefined") {
            user = JSON.parse(userJson);
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
    }

    if (!isAuthenticated) return <Navigate to="/login" />;

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Redirect back to their dashboard if unauthorized
    }

    return children;
};

// Placeholder components to prevent errors until fully implemented
const DummyPage = ({ title }) => <div><h2>{title}</h2><p>This module is under construction.</p></div>;

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="/*" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/verifications" element={<VerificationList />} />
                                <Route path="/reports" element={<AdminReports />} />
                                <Route path="/archives" element={<AdminArchives />} />
                                <Route path="/students" element={<StudentList />} />
                                <Route path="/faculty" element={<FacultyList />} />
                                <Route path="/events" element={<EventList />} />
                                <Route path="/scheduling" element={<ScheduleList />} />
                                <Route path="/research" element={<ResearchList />} />
                                <Route path="/materials" element={<MaterialList />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />

                {/* Student / Faculty Routes */}
                <Route path="/user/*" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty']}>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<UserDashboard />} />
                                <Route path="/profile" element={<UserProfile />} />
                                <Route path="/documents" element={<DocumentUpload />} />
                                <Route path="/events" element={<EventList />} />
                                <Route path="/research" element={<ResearchList />} />
                                <Route path="*" element={<Navigate to="/user/" />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />

            </Routes>
        </Router>
    );
}

export default App;
