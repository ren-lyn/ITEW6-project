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
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Document Upload Phase</h2>
                <p className="text-secondary">Upload required files for verification. Supported: PDF, JPG, PNG (Max 5MB)</p>
            </div>

            {errorMsg && <div className="alert alert-danger mb-4 rounded-3">{errorMsg}</div>}

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center bg-white" style={{ border: '2px dashed #dee2e6' }}>
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-cloud-arrow-up fs-3"></i>
                </div>
                <h5 className="fw-bold mb-2">Secure Document Vault</h5>
                <p className="small text-muted mb-0">Select your required documents from the list below and upload your scanned copies.</p>
            </div>

            <div className="card shadow-sm border-0 rounded-4 p-4 overflow-hidden bg-white">
                <h5 className="fw-bold mb-4">Required Documents</h5>

                <div className="d-flex flex-column gap-3">
                    {documents.map((doc) => (
                        <div key={doc.document_type_id} className="d-flex align-items-center p-3 rounded-4 border bg-light">
                            <div className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-file-earmark-text fs-4"></i>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="fw-bold mb-1">
                                    {doc.name}
                                    {doc.is_mandatory ? <span className="text-danger ms-1">*</span> : null}
                                </h6>
                                <div className="small text-muted">{doc.description || 'Required for profile verification'}</div>
                                {doc.file_path && (
                                    <div className="mt-1">
                                        <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="small text-decoration-none">
                                            <i className="bi bi-box-arrow-up-right me-1"></i>View Uploaded File
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                {getStatusBadge(doc.status)}

                                <div className="position-relative">
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
                                        className={`btn btn-sm rounded-pill px-3 fw-bold ${doc.status === 'approved' ? 'btn-outline-secondary' : 'btn-primary'}`}
                                        style={{ cursor: uploadingId === doc.document_type_id ? 'not-allowed' : 'pointer' }}
                                    >
                                        {uploadingId === doc.document_type_id ? (
                                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Uploading...</>
                                        ) : (
                                            <>
                                                <i className="bi bi-upload me-1"></i>
                                                {doc.status === 'missing' ? 'Upload' : 'Replace File'}
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                    {documents.length === 0 && (
                        <div className="text-center text-muted p-4 border rounded-3 border-dashed">
                            No documents required at this time.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;
