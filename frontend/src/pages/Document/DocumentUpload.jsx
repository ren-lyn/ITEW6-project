import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const DocumentUpload = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data.documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setErrorMsg('Failed to load required documents.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileUpload = async (e, docId) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingId(docId);
        setErrorMsg('');

        const formData = new FormData();
        formData.append('document_type_id', docId);
        formData.append('file', file);
        // Expiry date could be added via another input if needed

        try {
            await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchDocuments(); // Refresh list to show new status
        } catch (error) {
            console.error('Error uploading document:', error);
            setErrorMsg(error.response?.data?.message || 'Error uploading file.');
        } finally {
            setUploadingId(null);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 border border-success border-opacity-25">Approved</span>;
            case 'pending': return <span className="badge bg-warning bg-opacity-10 text-dark rounded-pill px-3 py-2 border border-warning border-opacity-50">Pending</span>;
            case 'rejected': return <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2 border border-danger border-opacity-25">Rejected</span>;
            default: return <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-2 border border-secondary border-opacity-25">Missing</span>;
        }
    };

    return (
        <div>
            {errorMsg && <div className="alert alert-danger mb-4 rounded-3">{errorMsg}</div>}

            {/* Top Upload Area */}
            <div className="card shadow-sm border-0 rounded-4 p-5 mb-4 text-center bg-white">
                <div className="bg-primary bg-opacity-10 text-primary rounded-4 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-cloud-arrow-up fs-2 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3 text-dark">Document Upload</h5>
                <p className="small text-muted mb-3 mx-auto" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                    Note: File upload functionality requires server-side storage. Documents are tracked in the system.
                </p>
                <div className="small text-muted">Supported: PDF, JPG, PNG (Max 5MB)</div>
            </div>

            {/* Required Documents List */}
            <div className="card shadow-sm border-0 rounded-4 p-4 pb-5 bg-white">
                <h5 className="fw-bold mb-4 text-dark">Required Documents</h5>

                <div className="d-flex flex-column gap-3">
                    {documents.map((doc) => (
                        <div key={doc.document_type_id} className="d-flex align-items-center p-3 rounded-4 bg-light border-0 transition-all">
                            <div className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                                <i className="bi bi-file-earmark-text fs-4"></i>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="fw-bold mb-1 text-dark">
                                    {doc.name}
                                </h6>
                                <div className="small text-muted">{doc.description || 'Required for enrollment verification'}</div>
                                {doc.file_path && (
                                    <div className="mt-1">
                                        <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="small text-decoration-none d-inline-flex align-items-center gap-1">
                                            <i className="bi bi-box-arrow-up-right"></i> View File
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex flex-column align-items-end justify-content-center gap-2" style={{ minWidth: '120px' }}>
                                {/* Status badge using yellow Pending from mockup instead of default styles */}
                                <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-medium border border-warning border-opacity-25 w-100 text-center">
                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                </span>

                                <div className="position-relative w-100 mt-1 d-none"> {/* Hidden for aesthetics unless actively replacing, mockup hides buttons */}
                                    <input
                                        type="file"
                                        id={`upload-${doc.document_type_id}`}
                                        className="d-none"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, doc.document_type_id)}
                                        disabled={uploadingId === doc.document_type_id}
                                    />
                                    <label
                                        htmlFor={`upload-${doc.document_type_id}`}
                                        className={`btn btn-sm py-1 rounded-pill fw-bold w-100 ${doc.status === 'approved' ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
                                        style={{ cursor: uploadingId === doc.document_type_id ? 'not-allowed' : 'pointer' }}
                                    >
                                        {uploadingId === doc.document_type_id ? (
                                            <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></>
                                        ) : (
                                            <>{doc.status === 'missing' ? 'Upload' : 'Replace'}</>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                    {documents.length === 0 && (
                        <div className="text-center text-muted p-5 rounded-4 bg-light border-0">
                            No documents required at this time.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;
