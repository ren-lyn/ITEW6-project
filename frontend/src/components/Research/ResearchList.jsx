import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ResearchForm from './ResearchForm';

const ResearchList = () => {
    const [research, setResearch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');

    const fetchResearch = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/research?search=${search}`);
            // Handle both paginated and non-paginated responses
            setResearch(Array.isArray(response.data) ? response.data : (response.data.data || []));
        } catch (error) {
            console.error('Error fetching research:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResearch();
    }, []);

    if (showForm) {
        return <ResearchForm onSave={() => { setShowForm(false); fetchResearch(); }} onCancel={() => setShowForm(false)} />;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-6 fw-bold mb-0 text-info">Intellectual Repository</h2>
                <button className="btn btn-info text-white rounded-pill px-4 shadow-sm fw-bold" onClick={() => setShowForm(true)}>+ Archive Research</button>
            </div>

            <div className="card mb-5 border-0 shadow-sm rounded-4 p-4" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #087990 100%)' }}>
                <div className="row align-items-center">
                    <div className="col-md-8 text-white">
                        <h4 className="fw-bold mb-2">Advance Your Academic Inquiry</h4>
                        <p className="mb-0 opacity-75">Connect with the latest technological research and publications from CCS.</p>
                    </div>
                    <div className="col-md-4 mt-3 mt-md-0">
                        <div className="input-group bg-white rounded-pill p-1 overflow-hidden">
                            <input
                                type="text"
                                className="form-control border-0 shadow-none px-4"
                                placeholder="Search Intel..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchResearch()}
                            />
                            <button className="btn btn-info text-white rounded-pill px-4" onClick={fetchResearch}>Search</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading Research...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {research.map((item) => (
                        <div className="col-md-6" key={item.id}>
                            <div className="card border-0 shadow-sm rounded-4 h-100 p-4 card-stats border-bottom border-info border-4">
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="d-flex gap-2">
                                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill small fw-bold">{item.research_category || 'Academic'}</span>
                                        <span className={`badge rounded-pill px-3 py-2 small fw-bold ${item.research_status === 'Published' ? 'bg-success text-white' : (item.research_status === 'Ongoing' ? 'bg-warning text-dark' : 'bg-light text-dark')}`}>
                                            {item.research_status}
                                        </span>
                                    </div>
                                    <span className="text-muted small fw-bold">{item.publication_year}</span>
                                </div>
                                <h5 className="fw-bold mb-3">{item.title}</h5>
                                <p className="text-secondary small mb-4 line-clamp-2" style={{ height: '40px', overflow: 'hidden' }}>{item.abstract}</p>
                                <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-light">
                                    <div className="small text-muted">Lead Adviser: <span className="fw-bold text-dark">{item.adviser}</span></div>
                                    <button className="btn btn-sm btn-link text-info text-decoration-none fw-bold p-0">Detailed abstract →</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {research.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">No research entries found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResearchList;
