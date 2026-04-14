import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';

const RegistrationForm = () => {
    const [regData, setRegData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        const fetchRegData = async () => {
            try {
                const response = await api.get('/student/registration-form');
                setRegData(response.data);
            } catch (err) {
                console.error('Error fetching registration data:', err);
                setError(err.response?.data?.message || 'Failed to load registration form');
            } finally {
                setLoading(false);
            }
        };
        fetchRegData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="alert alert-danger mx-3 my-4">{error}</div>;

    const { student, user, academic, enrolled_subjects, registration_date, semester, academic_year } = regData;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-end mb-4 no-print">
                <button onClick={handlePrint} className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold">
                    <i className="bi bi-printer me-2"></i> Print Registration Form
                </button>
            </div>

            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white mx-auto print-paper" style={{ maxWidth: '900px' }} ref={printRef}>
                <div className="card-body p-5">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h4 className="fw-bold mb-1">CERTIFICATE OF REGISTRATION</h4>
                        <h6 className="text-muted mb-3">College of Computer Studies</h6>
                        <div className="d-flex justify-content-center gap-4 small fw-bold text-uppercase border-top border-bottom py-2">
                            <span>AY {academic_year}</span>
                            <span>{semester} Semester</span>
                        </div>
                    </div>

                    {/* Student Info Grid */}
                    <div className="row g-4 mb-5 pb-4 border-bottom">
                        <div className="col-md-6">
                            <label className="text-uppercase small text-muted fw-bold mb-1 d-block">Student Name</label>
                            <div className="fw-bold fs-5">{student.first_name} {student.last_name}</div>
                        </div>
                        <div className="col-md-3">
                            <label className="text-uppercase small text-muted fw-bold mb-1 d-block">Student ID</label>
                            <div className="fw-bold">{student.id_number}</div>
                        </div>
                        <div className="col-md-3">
                            <label className="text-uppercase small text-muted fw-bold mb-1 d-block">Date Registered</label>
                            <div className="fw-bold">{registration_date}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="text-uppercase small text-muted fw-bold mb-1 d-block">Course & Year</label>
                            <div className="fw-bold">{academic?.course} - Year {academic?.year_level}</div>
                        </div>
                        <div className="col-md-3">
                            <label className="text-uppercase small text-muted fw-bold mb-1 d-block">Section</label>
                            <div className="fw-bold">{academic?.section}</div>
                        </div>
                        <div className="col-md-3">
                            <label className="text-uppercase small text-muted fw-bold mb-1 d-block">Status</label>
                            <div className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">ENROLLED</div>
                        </div>
                    </div>

                    {/* Enrollment Table */}
                    <h6 className="fw-bold text-uppercase mb-3 small ls-wide">Subjects Enrolled</h6>
                    <div className="table-responsive mb-5">
                        <table className="table table-bordered align-middle">
                            <thead className="bg-light small fw-bold">
                                <tr>
                                    <th style={{ width: '150px' }}>Subject Code</th>
                                    <th>Title</th>
                                    <th className="text-center">Schedule</th>
                                    <th className="text-center">Room</th>
                                    <th className="text-center">Units</th>
                                </tr>
                            </thead>
                            <tbody className="small">
                                {enrolled_subjects.length > 0 ? (
                                    enrolled_subjects.map((subj, index) => (
                                        <tr key={index}>
                                            <td className="fw-bold">{subj.subject_code}</td>
                                            <td>{subj.title}</td>
                                            <td className="text-center">{subj.days_of_week} {subj.start_time.substring(0,5)}-{subj.end_time.substring(0,5)}</td>
                                            <td className="text-center">{subj.room_assignment}</td>
                                            <td className="text-center">3.0</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-3">No subjects listed</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="fw-bold">
                                <tr>
                                    <td colSpan="4" className="text-end px-3">Total Units:</td>
                                    <td className="text-center">{enrolled_subjects.length * 3.0}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="row g-5 mt-5">
                        <div className="col-md-4">
                            <div className="border-top pt-2 text-center small text-muted">
                                Student Signature
                            </div>
                        </div>
                        <div className="col-md-4 offset-md-4">
                            <div className="border-top pt-2 text-center small text-muted">
                                Registrar Office
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-paper, .print-paper * { visibility: visible; }
                    .print-paper { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        box-shadow: none !important;
                    }
                    .no-print { display: none !important; }
                }
                .print-paper {
                    min-height: 100%;
                    border: 1px solid #eee;
                }
            `}</style>
        </div>
    );
};

export default RegistrationForm;
