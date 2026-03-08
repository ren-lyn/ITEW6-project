import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import FacultyForm from './FacultyForm';
import FacultyDetail from './FacultyDetail';

const FacultyList = () => {
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedFacultyId, setSelectedFacultyId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        academic_rank: ''
    });

    const fetchFaculties = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await api.get(`/faculties?${queryParams}`);
            setFaculties(response.data.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchFaculties();
    };

    const handleArchive = async (userId) => {
        if (!userId) return;
        if (!window.confirm('Are you sure you want to archive this user profile?')) return;

        try {
            await api.post(`/admin/users/${userId}/archive`);
            alert('User archived successfully');
            fetchFaculties();
        } catch (error) {
            console.error('Error archiving user:', error);
            alert(error.response?.data?.message || 'Error archiving user.');
        }
    };

    if (showForm) {
        return <FacultyForm onSave={() => { setShowForm(false); fetchFaculties(); }} onCancel={() => setShowForm(false)} />;
    }

    if (selectedFacultyId) {
        return <FacultyDetail facultyId={selectedFacultyId} onBack={() => setSelectedFacultyId(null)} />;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-6 fw-bold mb-0">Faculty Directory</h2>
                <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={() => setShowForm(true)}>+ Add Faculty</button>
            </div>

            <div className="card mb-4 glass-morphism border-0 shadow-sm p-3">
                <form onSubmit={handleFilterSubmit} className="row g-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="search"
                            className="form-control"
                            placeholder="Search name, employee ID, or skills..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <select name="department" className="form-select" value={filters.department} onChange={handleFilterChange}>
                            <option value="">All Departments</option>
                            <option value="CS Department">CS Department</option>
                            <option value="IT Department">IT Department</option>
                            <option value="IS Department">IS Department</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-success w-100">Search Faculty</button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {faculties.map((faculty) => (
                        <div className="col-md-6 col-lg-4" key={faculty.id}>
                            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 card-stats">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 me-3">
                                        <i className="bi bi-person fs-4"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">{faculty.first_name} {faculty.last_name}</h5>
                                        <div className="text-muted small">{faculty.academic_rank}</div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="small text-muted mb-1">Department</div>
                                    <div className="small fw-bold">{faculty.department}</div>
                                </div>
                                <div className="mb-3">
                                    <div className="small text-muted mb-1">Research Areas</div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {faculty.research_areas_json?.map((area, i) => (
                                            <span key={i} className="badge bg-light text-dark border-0 rounded-pill small">{area}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-auto d-flex justify-content-between align-items-center">
                                    <span className="small text-muted">ID: {faculty.employee_id}</span>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => setSelectedFacultyId(faculty.id)}>View Profile</button>
                                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleArchive(faculty.user_id)} title="Archive"><i className="bi bi-archive"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {faculties.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">No faculty members found matching your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyList;
