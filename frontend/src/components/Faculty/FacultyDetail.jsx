import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const FacultyDetail = ({ facultyId, onBack }) => {
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await api.get(`/faculties/${facultyId}`);
                setFaculty(response.data);
            } catch (error) {
                console.error('Error fetching faculty details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaculty();
    }, [facultyId]);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
    if (!faculty) return <div className="alert alert-danger">Faculty member not found.</div>;

    return (
        <div className="container-fluid p-0">
            <div className="d-flex align-items-center mb-4 px-2">
                <button className="btn btn-outline-secondary rounded-pill me-3" onClick={onBack}>
                    <i className="bi bi-arrow-left"></i> Directory
                </button>
                <div className="flex-grow-1">
                    <h2 className="display-6 fw-bold mb-0">Institutional Faculty Profile</h2>
                    <p className="small text-muted mb-0">Employment & Academic Performance Intelligence</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Sidebar: Identity Card */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 h-100">
                        <div className="bg-success p-5 text-center position-relative" style={{ background: 'linear-gradient(135deg, #198754 0%, #104e31 100%)' }}>
                            <div className="bg-white rounded-circle shadow p-1 d-inline-block mx-auto" style={{ width: '150px', height: '150px' }}>
                                <div className="w-100 h-100 rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden">
                                    <i className="bi bi-person-workspace display-1 text-secondary"></i>
                                </div>
                            </div>
                        </div>
                        <div className="card-body text-center pt-0 px-4" style={{ marginTop: '-40px' }}>
                            <div className="bg-white rounded-4 p-3 shadow-sm mx-auto mb-4 border" style={{ maxWidth: '300px' }}>
                                <h4 className="fw-bold mb-0 text-dark">{faculty.first_name} {faculty.last_name}</h4>
                                <div className="text-success small fw-bold">Emp ID: {faculty.employee_id}</div>
                                <div className="badge bg-light text-secondary border rounded-pill mt-2 px-3">{faculty.academic_rank}</div>
                            </div>

                            <div className="mt-4 text-start">
                                <div className="p-3 bg-light rounded-4 mb-3 border border-white">
                                    <div className="small text-muted mb-1 font-weight-bold">Department</div>
                                    <h5 className="fw-bold mb-0">{faculty.department}</h5>
                                </div>

                                <div className="p-3 bg-light rounded-4 mb-3 border border-white">
                                    <div className="small text-muted mb-1 font-weight-bold">Status</div>
                                    <span className={`badge rounded-pill px-3 py-2 ${faculty.employment_status === 'Full-time' ? 'bg-success' : 'bg-warning text-dark'}`}>{faculty.employment_status}</span>
                                </div>

                                <div className="mt-4">
                                    <h6 className="fw-bold mb-3 border-start border-success border-4 ps-2 small text-uppercase text-muted">Institutional Contact</h6>
                                    <p className="small mb-1"><i className="bi bi-envelope-fill text-success me-2"></i>{faculty.institutional_email}</p>
                                    <p className="small mb-1"><i className="bi bi-telephone-fill text-success me-2"></i>{faculty.contact_number}</p>
                                    <p className="small mb-0"><i className="bi bi-geo-alt-fill text-success me-2"></i>{faculty.address || 'Laguna, Philippines'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Stats & Tabs */}
                <div className="col-lg-8">
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-3 text-center bg-white border-bottom border-success border-4 h-100">
                                <div className="small text-muted mb-1">Teaching Units</div>
                                <h3 className="fw-bold text-success mb-0">{faculty.teaching_info_json?.units || '0'}</h3>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-3 text-center bg-white border-bottom border-success border-4 h-100">
                                <div className="small text-muted mb-1">Publications</div>
                                <h3 className="fw-bold text-success mb-0">{faculty.research_publications_json?.length || '0'}</h3>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-3 text-center bg-white border-bottom border-success border-4 h-100">
                                <div className="small text-muted mb-1">Tenure</div>
                                <h3 className="fw-bold text-success mb-0">{faculty.years_of_service || '0'} Yrs</h3>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-3 px-3">
                            <ul className="nav nav-tabs border-0 bg-light rounded-pill p-1" style={{ fontSize: '0.85rem' }}>
                                {[
                                    { id: 'profile', label: 'Academic Assets' },
                                    { id: 'research', label: 'Research Portfolio' },
                                    { id: 'teaching', label: 'Teaching Load' },
                                    { id: 'materials', label: 'Materials Managed' }
                                ].map(tab => (
                                    <li className="nav-item flex-grow-1 text-center" key={tab.id}>
                                        <button
                                            className={`nav-link rounded-pill py-2 border-0 w-100 ${activeTab === tab.id ? 'active bg-white text-success shadow-sm fw-bold' : 'text-secondary font-weight-normal'}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="card-body p-4 pt-1">
                            <hr className="mb-4 text-light" />

                            {activeTab === 'profile' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-3 border-start border-success border-4 ps-2 text-success">Academic Credentials</h5>
                                    <div className="row g-3 mb-5">
                                        <div className="col-12">
                                            <ul className="list-group list-group-flush border rounded-4 overflow-hidden">
                                                {faculty.academic_qualifications_json?.map((q, i) => (
                                                    <li key={i} className="list-group-item bg-light bg-opacity-10 py-3"><i className="bi bi-mortarboard-fill text-success me-3"></i> {q}</li>
                                                ))}
                                                {(!faculty.academic_qualifications_json || faculty.academic_qualifications_json.length === 0) && <li className="list-group-item italic text-muted">No academic records on file.</li>}
                                            </ul>
                                        </div>
                                    </div>

                                    <h5 className="fw-bold mb-3 border-start border-success border-4 ps-2 text-success">Professional Certifications</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {faculty.certifications_json?.map((c, i) => (
                                            <span key={i} className="badge bg-success bg-opacity-10 text-success p-3 rounded-4 border border-success border-opacity-25 w-100 text-start font-weight-normal shadow-sm"><i className="bi bi-patch-check-fill me-2"></i> {c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'research' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-3 border-start border-success border-4 ps-2 text-success">Publication History</h5>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="small text-muted"><tr><th>Research Title</th><th>Year</th><th>Status</th></tr></thead>
                                            <tbody>
                                                {faculty.research_publications_json?.map((r, i) => (
                                                    <tr key={i}>
                                                        <td className="fw-bold small py-3">{r.title}</td>
                                                        <td><span className="badge bg-light text-dark">{r.year}</span></td>
                                                        <td><span className="badge bg-success bg-opacity-10 text-success">Published</span></td>
                                                    </tr>
                                                ))}
                                                {(!faculty.research_publications_json || faculty.research_publications_json.length === 0) && <tr><td colSpan="3" className="text-center py-5 text-muted small">No research activity recorded.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'teaching' && (
                                <div className="fade-in">
                                    <div className="p-4 bg-light rounded-4 border-start border-success border-5 mb-4 shadow-sm">
                                        <h6 className="fw-bold mb-3"><i className="bi bi-calendar3 me-2"></i> Current Teaching Load</h6>
                                        <div className="row g-4">
                                            <div className="col-md-6"><div className="small text-muted">Subjects Handled</div><div className="fw-bold">{faculty.teaching_info_json?.subjects || 'No subjects assigned.'}</div></div>
                                            <div className="col-md-3"><div className="small text-muted">Total Units</div><div className="fw-bold">{faculty.teaching_info_json?.units || '0'}</div></div>
                                            <div className="col-md-3"><div className="small text-muted">Assigned Hub/Room</div><div className="fw-bold">{faculty.teaching_info_json?.room || 'Remote'}</div></div>
                                        </div>
                                    </div>
                                    <div className="alert alert-info border-0 rounded-4 small"><i className="bi bi-info-circle me-2"></i> Consultation hours and advising schedules are managed via the Scheduling Module.</div>
                                </div>
                            )}

                            {activeTab === 'materials' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-3 border-start border-success border-4 ps-2 text-success">Instructional Assets</h5>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="small text-muted"><tr><th>Material Title</th><th>Type</th><th>Actions</th></tr></thead>
                                            <tbody>
                                                {faculty.materials?.map(m => (
                                                    <tr key={m.id}>
                                                        <td className="fw-bold small">{m.title}</td>
                                                        <td><span className="badge bg-light text-secondary border rounded-pill">{m.type}</span></td>
                                                        <td><button className="btn btn-sm btn-link text-decoration-none">Review</button></td>
                                                    </tr>
                                                ))}
                                                {(!faculty.materials || faculty.materials.length === 0) && <tr><td colSpan="3" className="text-center text-muted py-4 small">No materials associated with this faculty.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDetail;
