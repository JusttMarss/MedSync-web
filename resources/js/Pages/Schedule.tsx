import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';


interface DoctorSchedule {
    id: number;
    name: string;
    specialization?: string;
    totalSlots: number;
    availableSlots: number;
}

interface ScheduleProps {
    doctors: DoctorSchedule[];
}


function IconSearch() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}

function IconEmpty() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
    );
}

function IconChevronRight() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}


function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}


function DoctorScheduleCard({ doctor }: { doctor: DoctorSchedule }) {
    const availabilityPct = doctor.totalSlots > 0
        ? Math.round((doctor.availableSlots / doctor.totalSlots) * 100)
        : 0;

    const statusColor = doctor.availableSlots === 0
        ? '#ef4444'
        : doctor.availableSlots <= 2
            ? '#f59e0b'
            : '#10b981';

    return (
        <div className="doctor-card" style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
            {/* Colored top accent based on availability */}
            <div style={{
                height: '4px',
                background: statusColor,
                margin: '-1.5rem -1.5rem 1.25rem -1.5rem',
                opacity: 0.8,
            }} />

            {/* Header */}
            <div className="doctor-card-header" style={{ marginBottom: '1rem' }}>
                <div className="doctor-avatar">
                    {getInitials(doctor.name ?? '')}
                </div>
                <div className="doctor-info">
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.2rem' }}>
                        {doctor.name}
                    </h3>
                    <span className="doctor-specialization">
                        {doctor.specialization || 'Umum'}
                    </span>
                </div>
            </div>

            {/* Slot Summary */}
            <div style={{
                background: 'var(--color-surface-alt)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    <IconCalendar />
                    <span>Slot Tersedia</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: statusColor,
                    }}>
                        {doctor.availableSlots}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        / {doctor.totalSlots}
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            {doctor.totalSlots > 0 && (
                <div style={{
                    height: '5px',
                    background: 'var(--color-border)',
                    borderRadius: '999px',
                    marginBottom: '1.25rem',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${availabilityPct}%`,
                        background: statusColor,
                        borderRadius: '999px',
                        transition: 'width 0.6s ease',
                    }} />
                </div>
            )}

            {/* Footer CTA */}
            <div style={{ marginTop: 'auto' }}>
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    onClick={() => router.visit(`/schedule/${doctor.id}`)}
                >
                    <IconCalendar />
                    Detail Jadwal
                    <IconChevronRight />
                </button>
            </div>
        </div>
    );
}


export default function Schedule({ doctors }: ScheduleProps) {
    const [search, setSearch] = useState('');
    const [filterSpec, setFilterSpec] = useState('');

    const specializations = Array.from(
        new Set(doctors.map((d) => d.specialization).filter(Boolean))
    ) as string[];

    const filtered = doctors.filter((d) => {
        const matchSearch = search === '' ||
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
            d.specialization?.toLowerCase().includes(search.toLowerCase());
        const matchSpec = filterSpec === '' || d.specialization === filterSpec;
        return matchSearch && matchSpec;
    });

    return (
        <MainLayout>
            <Head title="Jadwal Dokter" />

            <section className="section page-enter">

                {/* ── Page Header ── */}
                <div className="section-header split-header" style={{ marginBottom: '1.75rem', textAlign: 'left' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-text)' }}>
                            Jadwal Dokter
                        </h2>
                        <p className="text-secondary" style={{ marginTop: '0.35rem', fontSize: '0.9rem' }}>
                            Lihat ketersediaan jadwal dokter dan pilih waktu terbaik untuk kunjungan Anda.
                        </p>
                    </div>
                    <span style={{
                        alignSelf: 'flex-start',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(14,165,233,0.1)',
                        color: 'var(--color-primary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                    }}>
                        {filtered.length} dokter
                    </span>
                </div>

                {/* ── Filter Bar ── */}
                <div className="filters-bar" style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Cari nama dokter atau spesialisasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="filter-select"
                        value={filterSpec}
                        onChange={(e) => setFilterSpec(e.target.value)}
                    >
                        <option value="">Semua Spesialisasi</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => {}}>
                        <IconSearch />
                        Cari
                    </button>

                    {(search || filterSpec) && (
                        <button className="btn btn-outline" onClick={() => { setSearch(''); setFilterSpec(''); }}>
                            ✕ Reset
                        </button>
                    )}
                </div>

                {/* ── Doctor Grid ── */}
                {filtered.length > 0 ? (
                    <div className="doctors-grid">
                        {filtered.map((doctor) => (
                            <DoctorScheduleCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <IconEmpty />
                        <h3>Tidak ada dokter ditemukan</h3>
                        <p>
                            {search || filterSpec
                                ? 'Coba ubah kata kunci atau filter spesialisasi Anda.'
                                : 'Belum ada data dokter yang tersedia saat ini.'}
                        </p>
                        {(search || filterSpec) && (
                            <button
                                className="btn btn-outline"
                                onClick={() => { setSearch(''); setFilterSpec(''); }}
                                style={{ marginTop: '1rem' }}
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                )}

            </section>
        </MainLayout>
    );
}
