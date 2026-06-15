import { useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import TimeSlotManager from '../Components/Admin/TimeSlotManager';
import {
    Users, Calendar, Clock, CheckCircle2, AlertCircle,
    Activity, CalendarCheck, Clipboard, XCircle
} from 'lucide-react';

interface DoctorDashboardProps {
    userName?: string;
    stats: {
        todayPatients: number;
        upcomingTotal: number;
        completedWeek: number;
        availableSlots: number;
    };
    todaySchedule: {
        id: number;
        patient: string;
        time: string;
        status: string;
        notes: string | null;
    }[];
    upcomingAppointments: {
        id: number;
        patient: string;
        date: string;
        time: string;
        status: string;
        notes: string | null;
    }[];
    myTimeSlots: any[];
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    return 'Selamat Malam';
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'completed': return <CheckCircle2 size={14} style={{ color: '#15803d' }} />;
        case 'cancelled': return <XCircle size={14} style={{ color: '#b91c1c' }} />;
        default: return <Clock size={14} style={{ color: '#0b7285' }} />;
    }
}

function formatDate(dateStr: string) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    } catch {
        return dateStr;
    }
}

export default function DoctorDashboard({ userName, stats, todaySchedule, upcomingAppointments, myTimeSlots }: DoctorDashboardProps) {
    const greeting = getGreeting();
    const [activeTab, setActiveTab] = useState<'overview' | 'timeslots'>('overview');

    const updateStatus = (id: number, status: string) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status appointment menjadi ${status === 'completed' ? 'Selesai' : 'Dibatalkan'}?`)) {
            router.put(`/appointments/${id}/status`, { status });
        }
    };

    return (
        <MainLayout>
            <Head title="Doctor Dashboard" />

            <section className="section page-enter">
                {/* Hero Banner */}
                <div className="home-hero" style={{ marginBottom: '2rem' }}>
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
                                {greeting}, Dr. {userName ? userName.split(' ')[0] : ''}
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                fontWeight: 800,
                                lineHeight: 1.15,
                                color: 'var(--color-text)',
                                marginTop: '0.5rem',
                                maxWidth: '520px',
                            }}>
                                Dashboard Dokter
                            </h2>
                            <p style={{
                                color: 'var(--color-text-muted)',
                                marginTop: '0.5rem',
                                fontSize: '0.95rem',
                            }}>
                                Lihat jadwal hari ini, appointment mendatang, dan kelola pasien Anda.
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
                        <Activity size={16} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('timeslots')}
                        className={`btn ${activeTab === 'timeslots' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
                    >
                        <Clock size={16} /> Kelola Jadwal
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <>
                        {/* Stats Grid */}
                        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                    <div className="stat-card">
                        <div className="stat-icon"><Users size={22} /></div>
                        <div className="stat-number">{stats.todayPatients}</div>
                        <div className="stat-label">Pasien Hari Ini</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><CalendarCheck size={22} /></div>
                        <div className="stat-number">{stats.upcomingTotal}</div>
                        <div className="stat-label">Upcoming</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><CheckCircle2 size={22} /></div>
                        <div className="stat-number">{stats.completedWeek}</div>
                        <div className="stat-label">Selesai Minggu Ini</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Clock size={22} /></div>
                        <div className="stat-number">{stats.availableSlots}</div>
                        <div className="stat-label">Slot Tersedia</div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="dashboard-grid">
                    {/* Today's Schedule */}
                    <div className="dashboard-card dashboard-grid-full">
                        <div className="dashboard-card-header">
                            <div>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                                    Jadwal Hari Ini
                                </h3>
                                <p style={{ marginTop: '0.2rem' }}>Daftar pasien dan jadwal konsultasi Anda hari ini</p>
                            </div>
                            <span className="eyebrow" style={{ margin: 0, padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}>
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>

                        {todaySchedule.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="schedule-mini-table">
                                    <thead>
                                        <tr>
                                            <th>Pasien</th>
                                            <th>Waktu</th>
                                            <th>Status</th>
                                            <th>Catatan</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todaySchedule.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                        <div className="appointment-mini-avatar" style={{ width: '34px', height: '34px', fontSize: '0.78rem' }}>
                                                            {item.patient?.charAt(0) || '?'}
                                                        </div>
                                                        <span style={{ fontWeight: 600 }}>{item.patient || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                                                        <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                                                        {item.time}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-chip status-${item.status}`} style={{ textTransform: 'capitalize' }}>
                                                        {getStatusIcon(item.status)}
                                                        <span style={{ marginLeft: '0.3rem' }}>{item.status}</span>
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '200px' }}>
                                                    {item.notes ? (
                                                        <span style={{ fontStyle: 'italic' }}>"{item.notes}"</span>
                                                    ) : (
                                                        <span style={{ opacity: 0.5 }}>—</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {['scheduled', 'confirmed', 'pending'].includes(item.status) ? (
                                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                            <button
                                                                onClick={() => updateStatus(item.id, 'completed')}
                                                                className="btn btn-primary"
                                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                                                            >
                                                                Selesai
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(item.id, 'cancelled')}
                                                                className="btn btn-outline"
                                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', borderColor: '#ef4444', color: '#ef4444' }}
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tidak ada aksi</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem 1.5rem',
                                background: 'var(--color-surface-alt)',
                                borderRadius: 'var(--radius-md)',
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                                    Tidak ada jadwal hari ini
                                </h4>
                                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                                    Anda tidak memiliki appointment yang terjadwal untuk hari ini.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="dashboard-card dashboard-grid-full">
                        <div className="dashboard-card-header">
                            <div>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clipboard size={18} style={{ color: 'var(--color-primary)' }} />
                                    Appointment Mendatang
                                </h3>
                                <p style={{ marginTop: '0.2rem' }}>Appointment yang akan datang berikutnya</p>
                            </div>
                        </div>

                        {upcomingAppointments.length > 0 ? (
                            <div className="appointment-mini-list">
                                {upcomingAppointments.map((apt) => (
                                    <div key={apt.id} className="appointment-mini-item" style={{ justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                            <div className="appointment-mini-avatar">
                                                {apt.patient?.charAt(0) || '?'}
                                            </div>
                                            <div className="appointment-mini-info">
                                                <div className="appointment-mini-name">{apt.patient || 'N/A'}</div>
                                                <div className="appointment-mini-meta">
                                                    <Calendar size={12} />
                                                    {formatDate(apt.date)} • {apt.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span className={`status-chip status-${apt.status}`} style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                                                {getStatusIcon(apt.status)}
                                                <span style={{ marginLeft: '0.25rem' }}>{apt.status}</span>
                                            </span>
                                            {['scheduled', 'confirmed', 'pending'].includes(apt.status) && (
                                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                                    <button
                                                        onClick={() => updateStatus(apt.id, 'completed')}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: 'var(--radius-sm)' }}
                                                    >
                                                        Selesai
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(apt.id, 'cancelled')}
                                                        className="btn btn-outline"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: 'var(--radius-sm)', borderColor: '#ef4444', color: '#ef4444' }}
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '2.5rem 1.5rem',
                                background: 'var(--color-surface-alt)',
                                borderRadius: 'var(--radius-md)',
                            }}>
                                <AlertCircle size={32} style={{ opacity: 0.3, margin: '0 auto 0.75rem', color: 'var(--color-primary)' }} />
                                <p style={{ color: 'var(--color-text-muted)' }}>Tidak ada appointment mendatang.</p>
                            </div>
                        )}
                    </div>
                </div>
                    </>
                )}

                {activeTab === 'timeslots' && (
                    <TimeSlotManager timeSlots={myTimeSlots} isAdmin={false} />
                )}
            </section>
        </MainLayout>
    );
}
