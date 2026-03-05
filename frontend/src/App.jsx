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

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: 'bi-grid-1x2' },
        { name: 'Students', path: '/students', icon: 'bi-people' },
        { name: 'Faculty', path: '/faculty', icon: 'bi-person-badge' },
        { name: 'Events', path: '/events', icon: 'bi-calendar-date' },
        { name: 'Scheduling', path: '/scheduling', icon: 'bi-clock-history' },
        { name: 'Research', path: '/research', icon: 'bi-journal-code' },
        { name: 'Materials', path: '/materials', icon: 'bi-file-earmark-pdf' },
    ];

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

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('access_token');
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
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
            </Routes>
        </Router>
    );
}

export default App;
