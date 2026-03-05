import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import MaterialForm from './MaterialForm';

const MaterialList = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const response = await api.get('/materials');
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    if (showForm) {
        return <MaterialForm onSave={() => { setShowForm(false); fetchMaterials(); }} onCancel={() => setShowForm(false)} />;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-6 fw-bold mb-0">Instructional Materials</h2>
                <button className="btn btn-secondary rounded-pill px-4 shadow-sm" onClick={() => setShowForm(true)}>+ Upload Material</button>
            </div>

            <div className="card mb-5 border-0 shadow-sm rounded-4 overflow-hidden position-relative" style={{ minHeight: '150px' }}>
                <div className="bg-secondary bg-opacity-10 w-100 h-100 position-absolute"></div>
                <div className="card-body position-relative p-5">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h3 className="fw-bold text-secondary">Syllabus & Course Packs</h3>
                            <p className="mb-0 text-muted">A centralized repository for all learning modules and academic resources.</p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <button className="btn btn-secondary rounded-pill px-5 py-2 fw-bold">Browse All</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading Materials...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive bg-white rounded-4 shadow-sm">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 small fw-bold text-secondary">SUBJECT</th>
                                <th className="py-3 small fw-bold text-secondary">MATERIAL TITLE</th>
                                <th className="py-3 small fw-bold text-secondary">TYPE</th>
                                <th className="py-3 small fw-bold text-secondary">ADVISER</th>
                                <th className="py-3 text-end px-4 small fw-bold text-secondary">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((m) => (
                                <tr key={m.id}>
                                    <td className="px-4 py-3"><span className="fw-bold text-primary">{m.subject_code || 'N/A'}</span></td>
                                    <td className="py-3 fw-bold text-dark">{m.title}</td>
                                    <td><span className="badge bg-secondary bg-opacity-10 text-secondary border px-3 rounded-pill fw-normal">{m.type}</span></td>
                                    <td className="small">{m.faculty ? `${m.faculty.first_name} ${m.faculty.last_name}` : 'Institutional'}</td>
                                    <td className="text-end px-4">
                                        <div className="btn-group">
                                            <button className="btn btn-sm btn-outline-secondary rounded-start-pill px-3">Review</button>
                                            <button className="btn btn-sm btn-secondary rounded-end-pill px-3"><i className="bi bi-download"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {materials.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">No materials found in the repository.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MaterialList;
