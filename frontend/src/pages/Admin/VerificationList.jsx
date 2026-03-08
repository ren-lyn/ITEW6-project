import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const VerificationList = () => {
    const [pendingDocs, setPendingDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectModalData, setRejectModalData] = useState(null);
    const [remarks, setRemarks] = useState('');

    const fetchPending = async () => {
        try {
            const response = await api.get('/admin/verifications');
            setPendingDocs(response.data.pending_documents);
        } catch (error) {
            console.error('Error fetching verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this document?')) return;
        setActionLoading(id);
        try {
            await api.post(`/admin/verifications/${id}/approve`);
            fetchPending();
        } catch (error) {
            console.error('Error approving document:', error);
            alert('Error approving document.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        if (!remarks.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }

        setActionLoading(rejectModalData.id);
        try {
            await api.post(`/admin/verifications/${rejectModalData.id}/reject`, { remarks });
            setRejectModalData(null);
            setRemarks('');
            fetchPending();
        } catch (error) {
            console.error('Error rejecting document:', error);
            alert('Error rejecting document.');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold mb-1">Verification Approvals</h2>
                    <p className="text-secondary">Review and approve Student and Faculty document submissions.</p>
                </div>
                <div>
                    <span className="badge bg-warning text-dark fs-6 py-2 px-3 rounded-pill shadow-sm">
                        <i className="bi bi-clock-history me-2"></i>{pendingDocs.length} Pending Approvals
                    </span>
                </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-muted small text-uppercase fw-bold border-bottom-0">User</th>
                                <th className="py-3 text-muted small text-uppercase fw-bold border-bottom-0">Role</th>
                                <th className="py-3 text-muted small text-uppercase fw-bold border-bottom-0">Document Type</th>
                                <th className="py-3 text-muted small text-uppercase fw-bold border-bottom-0 text-center">Submitted At</th>
                                <th className="px-4 py-3 text-muted small text-uppercase fw-bold border-bottom-0 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingDocs.map(doc => (
                                <tr key={doc.id}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                                {doc.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold text-dark">{doc.user.name}</h6>
                                                <small className="text-muted">ID: {doc.user.id}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className={`badge ${doc.user.role === 'faculty' ? 'bg-info text-dark' : 'bg-primary'} rounded-pill text-capitalize`}>
                                            {doc.user.role}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-file-earmark-pdf fs-4 text-danger me-2"></i>
                                            <div>
                                                <h6 className="mb-0">{doc.type.name}</h6>
                                                <a href={`http://localhost:8000/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="small text-decoration-none">View File</a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center text-muted small">
                                        {new Date(doc.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="d-flex gap-2 justify-content-end">
                                            <button
                                                className="btn btn-sm btn-success rounded-pill px-3 fw-bold"
                                                onClick={() => handleApprove(doc.id)}
                                                disabled={actionLoading === doc.id}
                                            >
                                                <i className="bi bi-check-lg me-1"></i>Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold"
                                                onClick={() => setRejectModalData(doc)}
                                                disabled={actionLoading === doc.id}
                                            >
                                                <i className="bi bi-x-lg me-1"></i>Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pendingDocs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <i className="bi bi-check2-circle fs-1 d-block mb-3 text-success opacity-50"></i>
                                        <h5 className="fw-bold">All caught up!</h5>
                                        <p className="mb-0">There are no pending documents to verify.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Reject Modal (Bootstrap style overlay logic) */}
            {rejectModalData && (
                <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <form onSubmit={handleRejectSubmit}>
                                <div className="modal-header border-bottom-0 pb-0">
                                    <h5 className="modal-title fw-bold">Reject Document</h5>
                                    <button type="button" className="btn-close shadow-none" onClick={() => setRejectModalData(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="small text-muted mb-3">
                                        Rejecting <strong>{rejectModalData.type.name}</strong> for <strong>{rejectModalData.user.name}</strong>.
                                    </p>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-muted">Reason for Rejection <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control bg-light shadow-none"
                                            rows="3"
                                            placeholder="E.g., Image is too blurry to read or is expired..."
                                            value={remarks}
                                            onChange={e => setRemarks(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setRejectModalData(null)}>Cancel</button>
                                    <button type="submit" className="btn btn-danger rounded-pill px-4 fw-bold" disabled={actionLoading === rejectModalData.id}>Confirm Rejection</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationList;
