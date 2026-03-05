import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentDetail = ({ studentId, onBack }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showVioForm, setShowVioForm] = useState(false);
    const [newVio, setNewVio] = useState({
        violation_type: '',
        severity_level: 'Minor',
        date_of_violation: new Date().toISOString().split('T')[0],
        sanction_given: '',
        case_status: 'Ongoing',
        behavioral_remarks: ''
    });

    const fetchStudent = async () => {
        try {
            const response = await api.get(`/students/${studentId}`);
            setStudent(response.data);
        } catch (error) {
            console.error('Error fetching student details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [studentId]);

    const handleAddViolation = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/students/${studentId}/violations`, newVio);
            setShowVioForm(false);
            setNewVio({
                violation_type: '',
                severity_level: 'Minor',
                date_of_violation: new Date().toISOString().split('T')[0],
                sanction_given: '',
                case_status: 'Ongoing',
                behavioral_remarks: ''
            });
            fetchStudent();
        } catch (error) {
            console.error('Error adding violation:', error);
            alert('Failed to record violation.');
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
    if (!student) return <div className="alert alert-danger">Student not found.</div>;

    const riskLevel = student.risk_indicators_json?.length > 0 ? 'High' : (student.semester_gpa < 2.0 ? 'Medium' : 'Low');

    return (
        <div className="container-fluid p-0">
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-outline-secondary rounded-pill me-3" onClick={onBack}>
                    <i className="bi bi-arrow-left"></i> Directory
                </button>
                <div className="flex-grow-1">
                    <h2 className="display-6 fw-bold mb-0">Student Intel Profile</h2>
                    <p className="small text-muted mb-0">Confidential Profiling & Representation Intelligence</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Sidebar: Profile Card */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="p-5 text-center" style={{ background: 'linear-gradient(135deg, #f37021 0%, #212121 100%)' }}>
                            <div className="bg-white rounded-circle shadow p-1 d-inline-block mx-auto position-relative" style={{ width: '160px', height: '160px' }}>
                                <div className="w-100 h-100 rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden">
                                    <i className="bi bi-person-badge-fill display-1 text-secondary"></i>
                                </div>
                                <div className={`position-absolute bottom-0 end-0 badge rounded-pill px-3 py-2 border shadow-sm ${riskLevel === 'High' ? 'bg-danger' : (riskLevel === 'Medium' ? 'bg-warning text-dark' : 'bg-success')}`}>
                                    Risk: {riskLevel}
                                </div>
                            </div>
                        </div>
                        <div className="card-body text-center pt-0" style={{ marginTop: '-40px' }}>
                            <div className="bg-white rounded-4 p-3 shadow-sm mx-auto mb-4" style={{ maxWidth: '320px', border: '1px solid #eee' }}>
                                <h4 className="fw-bold mb-0 text-dark">{student.first_name} {student.last_name}</h4>
                                <div className="text-primary small fw-bold">{student.student_id}</div>
                                <div className="badge bg-light text-secondary border rounded-pill mt-2 px-3">{student.course} - Year {student.year_level}</div>
                            </div>

                            <div className="text-start px-2">
                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <div className="p-3 bg-light rounded-4 h-100 border border-white">
                                            <div className="small text-muted mb-1">GWA</div>
                                            <h4 className="fw-bold mb-0">{student.overall_gwa || 'N/A'}</h4>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 bg-light rounded-4 h-100 border border-white">
                                            <div className="small text-muted mb-1">Status</div>
                                            <div className={`fw-bold small ${student.academic_standing === 'Regular' ? 'text-success' : 'text-danger'}`}>{student.academic_standing || 'Regular'}</div>
                                        </div>
                                    </div>
                                </div>

                                <h6 className="fw-bold mb-3 border-start border-primary border-4 ps-2 small text-uppercase text-muted">Digital Assets</h6>
                                <div className="d-flex gap-2 mb-4">
                                    <a href={student.digital_profile_json?.github} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark rounded-circle"><i className="bi bi-github"></i></a>
                                    <a href={student.digital_profile_json?.linkedin} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary rounded-circle"><i className="bi bi-linkedin"></i></a>
                                    <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle"><i className="bi bi-globe"></i></a>
                                </div>

                                <h6 className="fw-bold mb-3 border-start border-primary border-4 ps-2 small text-uppercase text-muted">Special Classifications</h6>
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {student.classifications_json?.map((c, i) => (
                                        <span key={i} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small border border-primary border-opacity-10">{c}</span>
                                    ))}
                                    {(!student.classifications_json || student.classifications_json.length === 0) && <span className="text-muted small italic">Standard Enrollment</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 bg-danger bg-opacity-10 text-danger p-4 border-start border-danger border-4">
                        <h6 className="fw-bold mb-2"><i className="bi bi-exclamation-triangle-fill me-2"></i> Risk Indicators</h6>
                        <ul className="small mb-0 list-unstyled">
                            {student.risk_indicators_json?.map((r, i) => <li key={i}>• {r}</li>)}
                            {(!student.risk_indicators_json || student.risk_indicators_json.length === 0) && <li>No critical risks detected.</li>}
                        </ul>
                    </div>
                </div>

                {/* Right Content: Details Tabs */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-3">
                            <ul className="nav nav-pills nav-fill bg-light rounded-pill p-1" style={{ fontSize: '0.85rem' }}>
                                {[
                                    { id: 'overview', label: 'Demographics' },
                                    { id: 'family', label: 'Family & Living' },
                                    { id: 'skills', label: 'Capability' },
                                    { id: 'discipline', label: 'Behavioral' },
                                    { id: 'medical', label: 'Medical' }
                                ].map(tab => (
                                    <li className="nav-item" key={tab.id}>
                                        <button
                                            className={`nav-link rounded-pill py-2 border-0 ${activeTab === tab.id ? 'active bg-white text-primary shadow-sm fw-bold' : 'text-secondary'}`}
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

                            {activeTab === 'overview' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Identity & Demographic Info</h5>
                                    <div className="row g-4 mb-5">
                                        <div className="col-md-6">
                                            <div className="p-3 border rounded-4 bg-light bg-opacity-50">
                                                <label className="small text-muted d-block text-uppercase fw-bold mb-1">Full Legal Name</label>
                                                <span className="fw-bold">{student.first_name} {student.last_name}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="p-3 border rounded-4 bg-light bg-opacity-50">
                                                <label className="small text-muted d-block text-uppercase fw-bold mb-1">Gender</label>
                                                <span className="fw-bold">{student.gender || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="p-3 border rounded-4 bg-light bg-opacity-50">
                                                <label className="small text-muted d-block text-uppercase fw-bold mb-1">Birthdate</label>
                                                <span className="fw-bold">{student.birthdate}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-4"><label className="small text-muted d-block fw-bold small">Nickname</label><span>{student.nickname || 'N/A'}</span></div>
                                        <div className="col-md-4"><label className="small text-muted d-block fw-bold small">Nationality</label><span>{student.nationality}</span></div>
                                        <div className="col-md-4"><label className="small text-muted d-block fw-bold small">Civil Status</label><span>{student.civil_status}</span></div>
                                        <div className="col-md-6"><label className="small text-muted d-block fw-bold small">Contact Number</label><span>{student.contact_number}</span></div>
                                        <div className="col-md-6"><label className="small text-muted d-block fw-bold small">Religion</label><span>{student.religion || 'N/A'}</span></div>
                                        <div className="col-12"><label className="small text-muted d-block fw-bold small">Present Address</label><span>{student.present_address}</span></div>
                                    </div>

                                    <h5 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Professional Representation</h5>
                                    <div className="row g-3">
                                        <div className="col-md-3"><label className="small text-muted d-block fw-bold small">Height</label><span>{student.height} cm</span></div>
                                        <div className="col-md-3"><label className="small text-muted d-block fw-bold small">Weight</label><span>{student.weight} kg</span></div>
                                        <div className="col-md-6"><label className="small text-muted d-block fw-bold small">Stage Presence</label><span className={`badge rounded-pill ${student.stage_presence ? 'bg-success' : 'bg-light text-muted'}`}>{student.stage_presence ? 'Yes' : 'No'}</span></div>
                                        <div className="col-12"><label className="small text-muted d-block fw-bold small">Representation Willingness</label><span className={`badge bg-light border text-dark p-2`}>{student.willing_to_represent_ccs ? 'Willing to represent CCS in Pageants / Ambassador roles' : 'Focus on academic/tech roles'}</span></div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'family' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Parent / Guardian Records</h5>
                                    <div className="table-responsive mb-4">
                                        <table className="table table-bordered rounded-4 overflow-hidden">
                                            <thead className="bg-light small"><tr><th>Relation</th><th>Full Name</th><th>Occupation</th><th>Contact</th></tr></thead>
                                            <tbody>
                                                <tr><td className="fw-bold small">Father</td><td>{student.father_name || 'N/A'}</td><td className="small">{student.father_occupation}</td><td className="small">{student.father_contact}</td></tr>
                                                <tr><td className="fw-bold small">Mother</td><td>{student.mother_name || 'N/A'}</td><td className="small">{student.mother_occupation}</td><td className="small">{student.mother_contact}</td></tr>
                                                <tr><td className="fw-bold small">Guardian</td><td>{student.guardian_name || 'N/A'}</td><td className="small">-</td><td className="small">{student.guardian_contact}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="p-4 rounded-4 bg-light border-start border-info border-5">
                                                <h6 className="fw-bold mb-1">Living Situation</h6>
                                                <p className="mb-0 text-info fw-bold">{student.living_situation}</p>
                                                <small className="text-muted">Primary residence during academic term.</small>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-4 rounded-4 bg-light border-start border-warning border-5">
                                                <h6 className="fw-bold mb-1">Parental Consent</h6>
                                                <p className="mb-0 text-warning fw-bold">{student.guardian_consent_events ? 'GRANTED' : 'RESTRICTED'}</p>
                                                <small className="text-muted">Permission for off-campus events participation.</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'skills' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Technical Capabilities</h5>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {student.skills_json?.map((s, i) => <span key={i} className="badge bg-dark px-3 py-2 rounded-3 fw-normal" style={{ fontSize: '0.9rem' }}><i className="bi bi-code-slash me-2"></i>{s}</span>)}
                                    </div>
                                    <h5 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Soft Skills & Intel</h5>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {student.soft_skills_json?.map((s, i) => <span key={i} className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-3 fw-normal" style={{ fontSize: '0.9rem' }}><i className="bi bi-people-fill me-2"></i>{s}</span>)}
                                    </div>
                                    <h5 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Performance Arts & Talents</h5>
                                    <div className="row g-2">
                                        {student.talents_json?.map((t, i) => (
                                            <div className="col-md-4" key={i}>
                                                <div className="p-3 border rounded-4 text-center bg-warning bg-opacity-10 shadow-sm border-warning border-opacity-25">
                                                    <i className="bi bi-star-fill text-warning mb-2 d-block"></i>
                                                    <span className="fw-bold small">{t}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'discipline' && (
                                <div className="fade-in">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-bold mb-0 border-start border-danger border-4 ps-2">Behavioral Records</h5>
                                        <button className="btn btn-sm btn-danger rounded-pill px-4" onClick={() => setShowVioForm(!showVioForm)}>
                                            {showVioForm ? 'Close Reporting' : 'New Incident'}
                                        </button>
                                    </div>

                                    {showVioForm && (
                                        <div className="card border-0 shadow-sm rounded-4 mb-4 bg-light border-start border-danger border-4">
                                            <div className="card-body">
                                                <form onSubmit={handleAddViolation}>
                                                    <div className="row g-3">
                                                        <div className="col-md-6"><label className="form-label small fw-bold">Violation Type</label><input type="text" className="form-control" required value={newVio.violation_type} onChange={e => setNewVio({ ...newVio, violation_type: e.target.value })} /></div>
                                                        <div className="col-md-3"><label className="form-label small fw-bold">Severity</label><select className="form-select" value={newVio.severity_level} onChange={e => setNewVio({ ...newVio, severity_level: e.target.value })}><option value="Minor">Minor</option><option value="Major">Major</option><option value="Grave">Grave</option></select></div>
                                                        <div className="col-md-3"><label className="form-label small fw-bold">Date</label><input type="date" className="form-control" value={newVio.date_of_violation} onChange={e => setNewVio({ ...newVio, date_of_violation: e.target.value })} /></div>
                                                        <div className="col-md-6"><label className="form-label small fw-bold">Sanction Given</label><input type="text" className="form-control" value={newVio.sanction_given} onChange={e => setNewVio({ ...newVio, sanction_given: e.target.value })} /></div>
                                                        <div className="col-md-6"><label className="form-label small fw-bold">Remarks</label><input type="text" className="form-control" value={newVio.behavioral_remarks} onChange={e => setNewVio({ ...newVio, behavioral_remarks: e.target.value })} /></div>
                                                        <div className="col-12 text-end"><button type="submit" className="btn btn-danger rounded-pill px-5 fw-bold">Lodge Violation</button></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="small text-muted border-top-0"><tr><th>Incident</th><th>Severity</th><th>Sanction</th><th>Status</th><th>Date</th></tr></thead>
                                            <tbody>
                                                {student.violations?.map(v => (
                                                    <tr key={v.id}>
                                                        <td><div className="fw-bold small">{v.violation_type}</div><div className="text-muted" style={{ fontSize: '0.7rem' }}>{v.behavioral_remarks || 'No remarks'}</div></td>
                                                        <td><span className={`badge rounded-pill ${v.severity_level === 'Grave' ? 'bg-dark' : (v.severity_level === 'Major' ? 'bg-danger' : 'bg-warning text-dark')}`}>{v.severity_level}</span></td>
                                                        <td className="small">{v.sanction_given || 'N/A'}</td>
                                                        <td><span className="badge bg-light text-secondary border">{v.case_status}</span></td>
                                                        <td className="small">{v.date_of_violation}</td>
                                                    </tr>
                                                ))}
                                                {(!student.violations || student.violations.length === 0) && <tr><td colSpan="5" className="text-center py-5 text-muted small"><i className="bi bi-shield-check display-4 d-block mb-3 text-success"></i> Exemplary record. No violations found.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'medical' && (
                                <div className="fade-in">
                                    <div className="row g-4 mb-4">
                                        <div className="col-md-4">
                                            <div className="card border-0 bg-danger bg-opacity-10 p-3 h-100 rounded-4">
                                                <div className="text-danger small fw-bold mb-1">BLOOD TYPE</div>
                                                <h3 className="fw-bold mb-0 text-danger">{student.medical_records?.[0]?.blood_type || 'N/A'}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card border-0 bg-success bg-opacity-10 p-3 h-100 rounded-4">
                                                <div className="text-success small fw-bold mb-1">FIT TO JOIN ACTIVITIES</div>
                                                <div className="d-flex align-items-center">
                                                    <i className={`bi ${student.medical_records?.[0]?.fit_to_join_activities ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} display-6 me-3`}></i>
                                                    <div>
                                                        <h5 className="fw-bold mb-0">{student.medical_records?.[0]?.fit_to_join_activities ? 'Clearance Granted' : 'Medical Restriction'}</h5>
                                                        <span className="small text-muted">{student.medical_records?.[0]?.emergency_medical_notes || 'No critical health observations.'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h5 className="fw-bold mb-3 border-start border-primary border-4 ps-2">Medical History & Allergies</h5>
                                    <div className="p-4 border rounded-4 bg-light mb-4 shadow-sm">
                                        <div className="row g-4">
                                            <div className="col-md-6 border-end">
                                                <label className="fw-bold small text-danger">Allergies</label>
                                                <p className="mb-0">{student.medical_records?.[0]?.allergies || 'None reported.'}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="fw-bold small text-warning">Chronic Illness / Disability</label>
                                                <p className="mb-0">{student.medical_records?.[0]?.chronic_illness || 'None reported.'}</p>
                                            </div>
                                        </div>
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

export default StudentDetail;
