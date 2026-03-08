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

// Assets
import ccsLogo from './assets/CCS LOGO.jpg';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
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
            <nav className="navbar navbar-dark navbar-ccs sticky-top px-4 py-2">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span className="fs-4 tracking-tight">CCS PROFILER</span>
                </Link>
                <div className="d-flex align-items-center">
                    <div className="text-white me-3 d-none d-md-block small opacity-75">
                        {user ? `${user.name} (${user.role.toUpperCase()})` : 'Guest'}
                    </div>
                    <button className="btn btn-sm btn-outline-light rounded-pill px-3 shadow-none border-0 opacity-75" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
            <div className="container-fluid flex-grow-1">
                <div className="row flex-nowrap">
                    <nav className="col-md-2 d-none d-md-block sidebar py-4 sticky-top bg-white border-end shadow-sm" style={{ top: '60px', height: 'calc(100vh - 60px)' }}>
                        <div className="sidebar-sticky h-100 d-flex flex-column">
                            <div className="text-center mb-4 px-3">
                                <img
                                    src={ccsLogo}
                                    alt="CCS Logo"
                                    className="rounded-circle shadow-sm mb-2"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', border: '3px solid #f37021' }}
                                />
                                <div className="small fw-bold text-dark mt-2">College of Computing Studies</div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>Pamantasan ng Cabuyao</div>
                            </div>
                            <ul className="nav flex-column px-2 flex-grow-1">
                                {menuItems.map((item) => (
                                    <li className="nav-item mb-1" key={item.path}>
                                        <Link
                                            className={`nav-link py-2 px-3 rounded-3 d-flex align-items-center transition-all ${location.pathname === item.path ? 'active text-primary fw-bold' : 'text-secondary'}`}
                                            to={item.path}
                                        >
                                            <i className={`bi ${item.icon} me-2`}></i>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="p-3 bg-light rounded-4 mx-2 mt-auto mb-3">
                                <div className="small fw-bold text-dark">System Version</div>
                                <div className="text-muted small">v1.2.0-stable</div>
                            </div>
                        </div>
                    </nav>
                    <main role="main" className="col-md-10 ms-sm-auto px-md-5 py-5 bg-light min-vh-100">
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
    const user = userJson ? JSON.parse(userJson) : null;

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
                                <Route path="/profile" element={<DummyPage title="My Profile Phase 2" />} />
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
