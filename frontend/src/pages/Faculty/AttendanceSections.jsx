import React from 'react';
import { useParams, Link } from 'react-router-dom';

const AttendanceSections = () => {
    const { course } = useParams();
    const years = [1, 2, 3, 4];
    const sectionLetters = ['A', 'B', 'C', 'D', 'E'];

    const getCourseName = (abbr) => {
        switch (abbr?.toUpperCase()) {
            case 'IT': return 'Information Technology';
            case 'IS': return 'Information Systems';
            case 'CS': return 'Computer Science';
            default: return abbr;
        }
    };

    const getCourseColor = (abbr) => {
        switch (abbr?.toUpperCase()) {
            case 'IT': return 'primary';
            case 'IS': return 'success';
            case 'CS': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb small text-uppercase fw-bold">
                        <li className="breadcrumb-item"><Link to="/user" className="text-decoration-none">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Attendance</li>
                        <li className="breadcrumb-item active" aria-current="page">{course} Department</li>
                    </ol>
                </nav>
                <h4 className="fw-bold text-dark mb-1">Select Section</h4>
                <p className="text-muted">Choose a section to manage attendance for {getCourseName(course)}.</p>
            </div>

            {years.map(year => (
                <div key={year} className="mb-5">
                    <h6 className="fw-bold text-muted text-uppercase mb-3 d-flex align-items-center">
                        <span className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px', fontSize: '12px' }}>{year}</span>
                        {year === 1 ? 'First Year' : year === 2 ? 'Second Year' : year === 3 ? 'Third Year' : 'Fourth Year'}
                    </h6>
                    <div className="row g-3">
                        {sectionLetters.map(section => {
                            const sectionCode = `${year}${course}-${section}`;
                            return (
                                <div key={section} className="col-6 col-md-4 col-lg-3">
                                    <div className="card border-0 shadow-sm rounded-4 h-100 transition-all hover-translate-y bg-white card-section overflow-hidden">
                                        <div className="card-body p-3 text-center">
                                            <div 
                                                className="rounded-3 py-2 mb-3 fw-bold"
                                                style={{ 
                                                    backgroundColor: course === 'IT' ? '#fff4ee' : course === 'IS' ? '#f0fdf4' : '#f0f9ff',
                                                    color: course === 'IT' ? '#F26A21' : course === 'IS' ? '#166534' : '#0369a1',
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                {sectionCode}
                                            </div>
                                            
                                            <div className="d-grid gap-2">
                                                <Link 
                                                    to={`/user/attendance/import/${sectionCode}`} 
                                                    className={`btn btn-sm btn-outline-${getCourseColor(course)} fw-bold rounded-pill`}
                                                >
                                                    <i className="bi bi-upload me-1"></i> Import
                                                </Link>
                                                <Link 
                                                    to={`/user/attendance/history/${sectionCode}`} 
                                                    className="btn btn-sm btn-light text-muted fw-bold rounded-pill"
                                                >
                                                    <i className="bi bi-clock-history me-1"></i> History
                                                </Link>
                                                <Link 
                                                    to={`/user/attendance/analytics/${sectionCode}`} 
                                                    className="btn btn-sm btn-light text-primary fw-bold rounded-pill mt-1"
                                                    style={{ backgroundColor: '#f0f0ff' }}
                                                >
                                                    <i className="bi bi-graph-up-arrow me-1"></i> Analytics
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceSections;
