import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLocation } from 'react-router-dom';
import StudentForm from './StudentForm';
import StudentDetail from './StudentDetail';

const StudentList = () => {
    const location = useLocation();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [filters, setFilters] = useState({
        search: new URLSearchParams(location.search).get('search') || '',
        course: '',
        year_level: '',
        classification: ''
    });

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await api.get(`/students?${queryParams}`);
            setStudents(response.data.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    if (showForm) {
        return <StudentForm onSave={() => { setShowForm(false); fetchStudents(); }} onCancel={() => setShowForm(false)} />;
    }

    if (selectedStudentId) {
        return <StudentDetail studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-6 fw-bold mb-0">Student Profiles</h2>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => setShowForm(true)}>+ Add Student</button>
            </div>

            <div className="card mb-4 glass-morphism border-0 shadow-sm p-3">
                <form onSubmit={handleFilterSubmit} className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="search"
                            className="form-control"
                            placeholder="Search name or ID..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <select name="course" className="form-select" value={filters.course} onChange={handleFilterChange}>
                            <option value="">All Courses</option>
                            <option value="BSCS">BSCS</option>
                            <option value="BSIT">BSIT</option>
                            <option value="BSIS">BSIS</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select name="year_level" className="form-select" value={filters.year_level} onChange={handleFilterChange}>
                            <option value="">Year Level</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select name="classification" className="form-select" value={filters.classification} onChange={handleFilterChange}>
                            <option value="">Classification</option>
                            <option value="Scholar">Scholar</option>
                            <option value="Working Student">Working Student</option>
                            <option value="Dean's Lister">Dean's Lister</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Apply Filters</button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status text-center">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Student ID</th>
                                    <th>Full Name</th>
                                    <th>Course</th>
                                    <th>Year</th>
                                    <th>GWA</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="fw-bold text-primary">{student.student_id}</td>
                                        <td>{student.first_name} {student.last_name}</td>
                                        <td>{student.course}</td>
                                        <td>{student.year_level}</td>
                                        <td>{student.overall_gwa}</td>
                                        <td>
                                            <span className={`badge ${student.overall_gwa <= 1.75 ? 'bg-success' : 'bg-info'}`}>
                                                {student.overall_gwa <= 1.75 ? "Dean's Lister" : "Regular"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <button className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" onClick={() => setSelectedStudentId(student.id)}>View Profile</button>
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3">Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">No students found matching your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
