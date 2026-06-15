import MainLayout from '../Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Stethoscope, Users, CalendarDays, Clock,
    CalendarCheck, ChevronRight, Activity,
    Sparkles, ArrowRight
} from 'lucide-react';

interface DashboardProps {
    stats: {
        doctors: number;
        patients: number;
        appointments: number;
    };
    upcoming?: {
        id?: number;
        doctor: string;
        specialization: string;
        date: string;
        time: string;
        status?: string;
    } | null;
    userName?: string;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    return 'Selamat Malam';
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

export default function Dashboard({ stats, upcoming, userName }: DashboardProps) {
    const greeting = getGreeting();

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <section className="section page-enter" style={{ padding: '1.5rem 0 3rem' }}>

                {/* ── Hero Banner ── */}
                <div className="patient-hero-banner" style={{ marginBottom: '2rem' }}>
                    {/* Decorative blobs */}
                    <div className="hero-blob hero-blob-1" />
                    <div className="hero-blob hero-blob-2" />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <Activity size={13} />
                                {greeting}
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                fontWeight: 800,
                                lineHeight: 1.15,
                                color: '#fff',
                                marginTop: '0.75rem',
                                maxWidth: '520px',
                            }}>
                                {userName ? `Hai, ${userName.split(' ')[0]}! 👋` : 'Dashboard Pasien'}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                                Pantau jadwal kesehatan, dokter, dan appointment Anda dalam satu tempat.
                            </p>
                        </div>

                        <button
                            className="btn"
                            onClick={() => router.visit('/appointments')}
                            style={{
                                alignSelf: 'center',
                                background: '#fff',
                                color: 'var(--color-primary)',
                                fontWeight: 700,
                                borderRadius: 'var(--radius-md)',
                                gap: '0.5rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {upcoming ? 'Mulai Appointment' : 'Buat Appointment'}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0284c7' }}>
                            <Stethoscope size={22} />
                        </div>
                        <div className="stat-number">{stats.doctors}</div>
                        <div className="stat-label">Total Dokter</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#7c3aed' }}>
                            <Users size={22} />
                        </div>
                        <div className="stat-number">{stats.patients}</div>
                        <div className="stat-label">Total Pasien</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                            <CalendarDays size={22} />
                        </div>
                        <div className="stat-number">{stats.appointments}</div>
                        <div className="stat-label">Total Appointment</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.1)', color: '#ea580c' }}>
                            <Clock size={22} />
                        </div>
                        <div className="stat-number">{upcoming ? 1 : 0}</div>
                        <div className="stat-label">Appointment Mendatang</div>
                    </div>
                </div>

                {/* ── Quick Actions ── */}
                <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
                    <div className="dashboard-card-header">
                        <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                                Aksi Cepat
                            </h3>
                            <p>Navigasi ke fitur yang sering digunakan</p>
                        </div>
                    </div>
                    <div className="quick-actions-grid">
                        <Link href="/appointments" className="quick-action-card">
                            <div className="quick-action-icon quick-action-icon-blue">
                                <CalendarCheck size={22} />
                            </div>
                            <span className="quick-action-label">Buat Appointment</span>
                        </Link>
                        <Link href="/doctors" className="quick-action-card">
                            <div className="quick-action-icon quick-action-icon-green">
                                <Stethoscope size={22} />
                            </div>
                            <span className="quick-action-label">Cari Dokter</span>
                        </Link>
                        <Link href="/schedule" className="quick-action-card">
                            <div className="quick-action-icon quick-action-icon-amber">
                                <CalendarDays size={22} />
                            </div>
                            <span className="quick-action-label">Jadwal Tersedia</span>
                        </Link>
                        <Link href="/profile" className="quick-action-card">
                            <div className="quick-action-icon quick-action-icon-purple">
                                <Users size={22} />
                            </div>
                            <span className="quick-action-label">Edit Profil</span>
                        </Link>
                    </div>
                </div>

                {/* ── Next Appointment ── */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CalendarDays size={16} style={{ color: 'var(--color-primary)' }} />
                                Appointment Berikutnya
                            </h3>
                            <p>Detail kunjungan berikutnya yang sudah dijadwalkan</p>
                        </div>
                        <Link href="/appointments" className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-md)', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                            Lihat Semua
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {upcoming ? (
                        <div className="upcoming-appointment-card">
                            {/* Gradient accent strip */}
                            <div className="upcoming-accent-strip" />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                                <div className="doctor-avatar" style={{ width: '52px', height: '52px', fontSize: '1.1rem' }}>
                                    {getInitials(upcoming.doctor)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>
                                        {upcoming.doctor}
                                    </h4>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                        {upcoming.specialization}
                                    </span>
                                </div>
                                <span className={`status-chip status-${upcoming.status || 'scheduled'}`}>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: upcoming.status === 'confirmed' ? '#4338ca' : upcoming.status === 'pending' ? '#92400e' : '#0b7285',
                                        display: 'inline-block',
                                        marginRight: '0.4rem'
                                    }} />
                                    {upcoming.status === 'confirmed' ? 'Disetujui' : upcoming.status === 'pending' ? 'Menunggu Konfirmasi' : upcoming.status === 'completed' ? 'Selesai' : upcoming.status === 'cancelled' ? 'Dibatalkan' : 'Terjadwal'}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>
                                        📆 Tanggal
                                    </span>
                                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                                        {formatDate(upcoming.date)}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>
                                        🕐 Waktu
                                    </span>
                                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                                        {upcoming.time}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => router.visit('/appointments')}
                                style={{ borderRadius: 'var(--radius-md)', gap: '0.5rem' }}
                            >
                                Mulai Appointment
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>📭</div>
                            <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)', marginBottom: '0.4rem' }}>
                                Belum ada appointment
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                                Buat appointment dengan dokter kami untuk memulai perawatan Anda.
                            </p>
                            <Link href="/appointments" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-md)', gap: '0.5rem' }}>
                                Buat Appointment
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}