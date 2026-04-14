import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const EnrolledCourses = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/student/courses');
                setData(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.response?.data?.message || 'Failed to load enrolled courses');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="alert alert-danger mx-3 my-4">{error}</div>;

    const { academic, courses } = data;

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                        <h4 className="fw-bold text-dark mb-1">Enrolled Courses</h4>
                        <p className="text-muted mb-0">List of subjects for {academic.semester} Semester, Academic Year 2025-2026</p>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all overflow-hidden bg-white">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                                            <i className="bi bi-book fs-4"></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark text-uppercase small ls-wide">{course.subject_code}</div>
                                            <h6 className="fw-bold mb-0 text-truncate" title={course.title}>{course.title}</h6>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-25" />
                                    <div className="d-flex justify-content-between text-muted small">
                                        <span>Status: <span className="text-success fw-medium">Active</span></span>
                                        <span>Credits: <span className="fw-medium">3.0 Units</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                            <i className="bi bi-journal-x fs-1 text-muted mb-3"></i>
                            <h5 className="text-muted">No enrolled courses found</h5>
                            <p className="text-muted small mb-0">Check your section assignment or contact the registrar.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourses;
