import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const AttendanceImport = () => {
    const { section } = useParams();
    const [file, setFile] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [subject, setSubject] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState([]);

    const getCourseName = (abbr) => {
        switch (abbr?.toUpperCase()) {
            case 'IT': return 'BS Information Technology';
            case 'IS': return 'BS Information Systems';
            case 'CS': return 'BS Computer Science';
            default: return abbr || 'General';
        }
    };

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await api.get('/schedules');
                setSchedules(response.data);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };
        fetchSchedules();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage({ type: 'danger', text: 'Please select a file to upload.' });
            return;
        }

        setLoading(true);
        setMessage(null);
        setErrors([]);

        const formData = new FormData();
        formData.append('file', file);
        if (selectedSchedule) {
            formData.append('schedule_id', selectedSchedule);
        }
        if (subject) {
            formData.append('subject', subject);
        }
        if (startDate) {
            formData.append('start_date', startDate);
        }
        if (endDate) {
            formData.append('end_date', endDate);
        }
        if (section) {
            formData.append('section', section);
        }

        try {
            const response = await api.post('/attendance/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: response.data.message });
            setErrors(response.data.errors || []);
            setFile(null);
            const fileInput = document.getElementById('attendanceFile');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to import attendance.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3 border-0">
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-people"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0 text-dark">
                                        Import Attendance: {section}
                                    </h5>
                                    <p className="small text-muted mb-0">Upload CSV records for section {section}.</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4 pt-2">
                            {message && (
                                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                    {message.text}
                                    <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                                </div>
                            )}

                            {errors.length > 0 && (
                                <div className="alert alert-warning small">
                                    <h6 className="fw-bold fs-7 mb-2">Import Warnings:</h6>
                                    <ul className="mb-0">
                                        {errors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={handleUpload}>
                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-muted text-uppercase mb-2">Course Subject <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className="form-control rounded-3 p-2 fs-7"
                                            placeholder="e.g. Data Structures & Algorithms"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted text-uppercase mb-2">Start Date <span className="text-danger">*</span></label>
                                        <input 
                                            type="date" 
                                            className="form-control rounded-3 p-2 fs-7"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted text-uppercase mb-2">End Date <span className="text-danger">*</span></label>
                                        <input 
                                            type="date" 
                                            className="form-control rounded-3 p-2 fs-7"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="attendanceFile" className="form-label fw-bold small text-muted text-uppercase mb-2">CSV File <span className="text-danger">*</span></label>
                                    <input 
                                        type="file" 
                                        className="form-control rounded-3 p-2 fs-7" 
                                        id="attendanceFile" 
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                        required
                                    />
                                    <div className="form-text small opacity-75 mt-2">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Format: <code className="text-primary">student_id_number, date (YYYY-MM-DD), status (Present/Absent/Late), remarks</code>
                                    </div>
                                </div>

                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary fw-bold py-2 rounded-3 shadow-none transition-all"
                                        style={{ backgroundColor: 'var(--ccs-primary-blue)', border: 'none' }}
                                        disabled={loading || !file || !subject || !startDate || !endDate}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Importing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-upload me-2"></i> Start Import
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-4 border-0 shadow-sm rounded-4 bg-light bg-opacity-50">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-3 text-dark">Sample CSV Template</h6>
                            <pre className="bg-dark text-white p-3 rounded-3 small mb-0">
                                student_id_number,date,status,remarks{"\n"}
                                2021-00123,2026-04-14,Present,On time{"\n"}
                                2021-00456,2026-04-14,Absent,No notice{"\n"}
                                2021-00789,2026-04-14,Late,Transport issue
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceImport;
