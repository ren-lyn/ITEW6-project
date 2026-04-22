import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const programChartRef = useRef(null);
    const performanceChartRef = useRef(null);
    const riskChartRef = useRef(null);

    const programChartInstance = useRef(null);
    const performanceChartInstance = useRef(null);
    const riskChartInstance = useRef(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!data) return;

        const { stats, charts } = data;

        // Cleanup previous charts
        if (programChartInstance.current) programChartInstance.current.destroy();
        if (performanceChartInstance.current) performanceChartInstance.current.destroy();
        if (riskChartInstance.current) riskChartInstance.current.destroy();

        // Modern Color Palette
        const ccsOrange = '#F26A21';
        const institutionalBlue = '#0d6efd';
        const deepGrey = '#212121';
        const lightGrey = '#e9ecef';
        const warningColor = '#ffc107';
        const dangerColor = '#dc3545';

        // 1. Program Distribution (Donut Chart)
        if (programChartRef.current && charts.students_by_course) {
            const ctx = programChartRef.current.getContext('2d');
            const labels = charts.students_by_course.map(item => item.course);
            const values = charts.students_by_course.map(item => item.total);
            
            programChartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [institutionalBlue, ccsOrange, warningColor, dangerColor, deepGrey, lightGrey],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: { backgroundColor: deepGrey, padding: 12, cornerRadius: 8 }
                    }
                }
            });
        }

        // 2. Performance Overview (Bar Chart)
        if (performanceChartRef.current && charts.standing_summary) {
            const ctx = performanceChartRef.current.getContext('2d');
            const labels = charts.standing_summary.map(item => item.academic_standing.toUpperCase());
            const values = charts.standing_summary.map(item => item.total);

            performanceChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Students',
                        data: values,
                        backgroundColor: institutionalBlue,
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [5, 5], color: '#f0f0f0' } },
                        x: { grid: { display: false } }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { backgroundColor: deepGrey, padding: 12, cornerRadius: 8 }
                    }
                }
            });
        }

        // 3. Risk Distribution (Polar Area Chart)
        if (riskChartRef.current && charts.risk_summary) {
            const ctx = riskChartRef.current.getContext('2d');
            const { academic_risk, behavioral_risk, financial_concern } = charts.risk_summary;

            riskChartInstance.current = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: ['Academic Risk', 'Behavioral Risk', 'Financial Concerns'],
                    datasets: [{
                        data: [academic_risk, behavioral_risk, financial_concern],
                        backgroundColor: [
                            'rgba(242, 106, 33, 0.85)', // CCS Orange
                            'rgba(220, 53, 69, 0.85)',  // Danger Red
                            'rgba(255, 193, 7, 0.85)'   // Warning Yellow
                        ],
                        borderColor: '#1A1A1A',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: { 
                            ticks: { display: false }, 
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    },
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#ffffff', padding: 20, font: { size: 11 } } },
                        tooltip: { backgroundColor: '#ffffff', titleColor: '#000', bodyColor: '#000', padding: 12, cornerRadius: 8 }
                    }
                }
            });
        }

        // Cleanup on unmount
        return () => {
            if (programChartInstance.current) programChartInstance.current.destroy();
            if (performanceChartInstance.current) performanceChartInstance.current.destroy();
            if (riskChartInstance.current) riskChartInstance.current.destroy();
        };

    }, [data]);

    if (loading) {
        return (
            <div className="text-center py-5 mt-5">
                <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading Dashboard...</span>
                </div>
                <h5 className="mt-4 text-muted fw-bold">Initializing Institutional Intelligence...</h5>
            </div>
        );
    }

    if (!data) return <div className="text-center py-5">No dashboard data available.</div>;

    const { stats } = data;

    return (
        <div>
            {/* Institutional Intelligence Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 border-bottom pb-4 gap-3">
                <div>
                    <h2 className="display-4 fw-bold text-dark mb-2 d-flex align-items-center flex-wrap gap-2">
                        <span>Intelligence Central</span>
                    </h2>
                    <p className="text-secondary lead mb-0">College of Computing Studies Command Center.</p>
                </div>
                <div className="d-flex gap-3 align-items-center flex-wrap">
                    <button className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={() => navigate('/admin/verifications')}>
                        <i className="bi bi-clipboard-check me-2 text-primary"></i> Verification Queue
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="row g-4 mb-5">
                {[
                    { t: 'Total Students', c: stats.total_students, b: 'bg-primary', i: 'bi-people-fill' },
                    { t: 'Faculty Members', c: stats.total_faculty, b: 'bg-success', i: 'bi-person-badge' },
                    { t: 'Research/Works', c: stats.total_research, b: 'bg-info', i: 'bi-journal-richtext' },
                    { t: 'Active Events', c: stats.upcoming_events, b: 'bg-warning', i: 'bi-calendar-check' }
                ].map((item, i) => (
                    <div className="col-md-3" key={i}>
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 card-stats" style={{ transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <div className="text-muted small fw-bold text-uppercase tracking-wider mb-1" style={{ fontSize: '0.75rem' }}>{item.t}</div>
                                    <div className="display-6 fw-bold mb-0 text-dark">{item.c}</div>
                                </div>
                                <div className={`rounded-4 d-flex align-items-center justify-content-center ${item.b} bg-opacity-10`} style={{ width: '56px', height: '56px' }}>
                                    <i className={`bi ${item.i} fs-3 ${item.b.replace('bg-', 'text-')}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    <div className="row g-4">
                        {/* Program Distribution (Donut Chart) */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <h5 className="fw-bold mb-4 text-dark">Program Distribution</h5>
                                <div className="position-relative w-100 d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                    <canvas ref={programChartRef} style={{ zIndex: 1 }}></canvas>
                                    <div className="position-absolute top-50 start-50 translate-middle text-center d-flex flex-column justify-content-center align-items-center" style={{ pointerEvents: 'none', zIndex: 0 }}>
                                        <div className="display-5 fw-bold mb-0 text-dark" style={{ lineHeight: '1' }}>{stats.total_students}</div>
                                        <div className="small text-muted fw-bold text-uppercase tracking-wider" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Total</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Overview (Bar Chart) */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0 text-dark">Performance Overview</h5>
                                </div>
                                <div style={{ height: '300px' }} className="w-100">
                                    <canvas ref={performanceChartRef}></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* RISK PROFILER (Polar Area Chart) */}
                    <div className="card border-0 shadow-lg rounded-4 p-0 overflow-hidden h-100 d-flex flex-column" style={{ backgroundColor: '#1A1A1A' }}>
                        <div className="p-4 border-bottom border-light border-opacity-10" style={{ backgroundColor: '#212121' }}>
                            <h5 className="fw-bold mb-1 text-white d-flex align-items-center">
                                <i className="bi bi-shield-lock-fill me-2" style={{ color: '#F26A21' }}></i> Risk Profiler
                            </h5>
                            <div className="small text-light opacity-75">Automated Multi-Vector Monitoring</div>
                        </div>
                        <div className="p-4 text-white flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                            <div style={{ height: '260px', width: '100%' }} className="mb-4">
                                <canvas ref={riskChartRef}></canvas>
                            </div>
                            <button 
                                onClick={() => navigate('/admin/reports')}
                                className="btn w-100 rounded-pill py-3 fw-bold shadow-lg mt-auto border-0 text-white" 
                                style={{ backgroundColor: '#F26A21', transition: 'all 0.3s' }} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d65b1b'} 
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F26A21'}
                            >
                                Initialize Risk Interventions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
