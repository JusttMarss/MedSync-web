import { useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Users, Stethoscope, CalendarCheck, Clock, AlertCircle,
    TrendingUp, CheckCircle2, XCircle, ChevronRight, Activity, LayoutDashboard
} from 'lucide-react';
import DoctorManager from '../Components/Admin/DoctorManager';
import PatientManager from '../Components/Admin/PatientManager';
import AppointmentManager from '../Components/Admin/AppointmentManager';

interface AdminDashboardProps {
    userName?: string;
    stats: {
        doctors: number;
        patients: number;
        appointments: number;
        pending: number;
        completed: number;
        cancelled: number;
    };
    recentAppointments: any[];
    recentPatients: any[];
    allDoctors: any[];
    allPatients: any[];
    allAppointments: any[];
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    return 'Selamat Malam';
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'confirmed':
        case 'completed': return <CheckCircle2 size={14} style={{ color: '#15803d' }} />;
        case 'cancelled': return <XCircle size={14} style={{ color: '#b91c1c' }} />;
        default: return <Clock size={14} style={{ color: '#0b7285' }} />;
    }
}

export default function AdminDashboard({
    userName,
    stats,
    recentAppointments,
    recentPatients,
    allDoctors,
    allPatients,
    allAppointments
}: AdminDashboardProps) {
    const greeting = getGreeting();
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'patients' | 'appointments'>('overview');

    return (
        <MainLayout>
            <Head title="Admin Dashboard" />

            <section className="section page-enter">
                {/* Hero Banner */}
                <div className="home-hero" style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}>
                        <div>
                            <span className="eyebrow">
                                <Activity size={14} />
                                {greeting}{userName ? `, ${userName.split(' ')[0]}` : ''}
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                fontWeight: 800,
                                lineHeight: 1.15,
                                color: 'var(--color-text)',
                                marginTop: '0.5rem',
                                maxWidth: '520px',
                            }}>
                                Admin Control Panel
                            </h2>
                            <p style={{
                                color: 'var(--color-text-muted)',
                                marginTop: '0.5rem',
                                fontSize: '0.95rem',
                            }}>
                                Monitor seluruh aktivitas sistem, kelola dokter, pasien, dan appointment dari satu tempat.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Tabs Selector */}
                <div className="tabs-container" style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.5rem',
                    overflowX: 'auto',
                    scrollbarWidth: 'none'
                }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
                    >
                        <LayoutDashboard size={16} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`btn ${activeTab === 'doctors' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
                    >
                        <Stethoscope size={16} /> Kelola Dokter
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        className={`btn ${activeTab === 'patients' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
                    >
                        <Users size={16} /> Kelola Pasien
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
                    >
                        <CalendarCheck size={16} /> Kelola Appointment
                    </button>
                </div>

                {/* Tab content area */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Grid */}
                        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('doctors')}>
                                <div className="stat-icon"><Stethoscope size={22} /></div>
                                <div className="stat-number">{stats.doctors}</div>
                                <div className="stat-label">Total Dokter</div>
                            </div>
                            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('patients')}>
                                <div className="stat-icon"><Users size={22} /></div>
                                <div className="stat-number">{stats.patients}</div>
                                <div className="stat-label">Total Pasien</div>
                            </div>
                            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('appointments')}>
                                <div className="stat-icon"><CalendarCheck size={22} /></div>
                                <div className="stat-number">{stats.appointments}</div>
                                <div className="stat-label">Total Appointment</div>
                            </div>
                            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('appointments')}>
                                <div className="stat-icon"><Clock size={22} /></div>
                                <div className="stat-number">{stats.pending}</div>
                                <div className="stat-label">Menunggu</div>
                            </div>
                        </div>

                        {/* Status Breakdown */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            marginBottom: '2rem'
                        }}>
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: 'rgba(38, 198, 218, 0.08)',
                                border: '1px solid rgba(38, 198, 218, 0.2)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <Clock size={20} style={{ color: '#0b7285' }} />
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0b7285' }}>{stats.pending}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0b7285', opacity: 0.8 }}>Scheduled</div>
                                </div>
                            </div>
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: 'rgba(74, 222, 128, 0.08)',
                                border: '1px solid rgba(74, 222, 128, 0.2)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <CheckCircle2 size={20} style={{ color: '#15803d' }} />
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{stats.completed}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d', opacity: 0.8 }}>Completed</div>
                                </div>
                            </div>
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: 'rgba(248, 113, 113, 0.08)',
                                border: '1px solid rgba(248, 113, 113, 0.2)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <XCircle size={20} style={{ color: '#b91c1c' }} />
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c' }}>{stats.cancelled}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b91c1c', opacity: 0.8 }}>Cancelled</div>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Grid: Recent Appointments + Recent Patients */}
                        <div className="dashboard-grid">
                            {/* Recent Appointments */}
                            <div className="dashboard-card dashboard-grid-full">
                                <div className="dashboard-card-header">
                                    <div>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CalendarCheck size={18} style={{ color: 'var(--color-primary)' }} />
                                            Appointment Terbaru
                                        </h3>
                                        <p style={{ marginTop: '0.2rem' }}>10 appointment terakhir di sistem</p>
                                    </div>
                                    <button onClick={() => setActiveTab('appointments')} className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>
                                        Kelola Semua <ChevronRight size={14} />
                                    </button>
                                </div>

                                {recentAppointments.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="schedule-mini-table">
                                            <thead>
                                                <tr>
                                                    <th>Pasien</th>
                                                    <th>Dokter</th>
                                                    <th>Tanggal</th>
                                                    <th>Waktu</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentAppointments.map((apt) => (
                                                    <tr key={apt.id}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <div className="appointment-mini-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                                                    {apt.patient?.charAt(0) || '?'}
                                                                </div>
                                                                <span style={{ fontWeight: 600 }}>{apt.patient || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{apt.doctor || 'N/A'}</div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{apt.specialization}</div>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontSize: '0.88rem' }}>{apt.date || '-'}</td>
                                                        <td style={{ fontSize: '0.88rem' }}>{apt.time || '-'}</td>
                                                        <td>
                                                            <span className={`status-chip status-${apt.status}`} style={{ textTransform: 'capitalize' }}>
                                                                {getStatusIcon(apt.status)}
                                                                <span style={{ marginLeft: '0.3rem' }}>{apt.status}</span>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                                        <AlertCircle size={32} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                                        <p>Belum ada appointment di sistem.</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Patients */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-header">
                                    <div>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={18} style={{ color: 'var(--color-primary)' }} />
                                            Pasien Terbaru
                                        </h3>
                                        <p style={{ marginTop: '0.2rem' }}>Pasien yang baru bergabung</p>
                                    </div>
                                </div>

                                {recentPatients.length > 0 ? (
                                    <div className="appointment-mini-list">
                                        {recentPatients.map((patient) => (
                                            <div key={patient.id} className="appointment-mini-item">
                                                <div className="appointment-mini-avatar">
                                                    {patient.name?.charAt(0) || '?'}
                                                </div>
                                                <div className="appointment-mini-info">
                                                    <div className="appointment-mini-name">{patient.name}</div>
                                                    <div className="appointment-mini-meta">
                                                        {patient.email}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    fontSize: '0.72rem',
                                                    color: 'var(--color-text-muted)',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {patient.joined}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)' }}>
                                        <p>Belum ada pasien terdaftar.</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="dashboard-card">
                                <div className="dashboard-card-header">
                                    <div>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                                            Quick Actions
                                        </h3>
                                        <p style={{ marginTop: '0.2rem' }}>Aksi cepat untuk admin</p>
                                    </div>
                                </div>

                                <div className="quick-actions-grid">
                                    <button onClick={() => setActiveTab('doctors')} className="quick-action-card" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                                        <div className="quick-action-icon quick-action-icon-blue">
                                            <Stethoscope size={22} />
                                        </div>
                                        <span className="quick-action-label">Kelola Dokter</span>
                                    </button>
                                    <button onClick={() => setActiveTab('patients')} className="quick-action-card" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                                        <div className="quick-action-icon quick-action-icon-green">
                                            <Users size={22} />
                                        </div>
                                        <span className="quick-action-label">Kelola Pasien</span>
                                    </button>
                                    <button onClick={() => setActiveTab('appointments')} className="quick-action-card" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                                        <div className="quick-action-icon quick-action-icon-amber">
                                            <CalendarCheck size={22} />
                                        </div>
                                        <span className="quick-action-label">Kelola Appointment</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'doctors' && <DoctorManager doctors={allDoctors} />}
                {activeTab === 'patients' && <PatientManager patients={allPatients} />}
                {activeTab === 'appointments' && <AppointmentManager appointments={allAppointments} />}
            </section>
        </MainLayout>
    );
}
