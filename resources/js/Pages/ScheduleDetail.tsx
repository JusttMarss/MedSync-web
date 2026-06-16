import { Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeSlot {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

interface DoctorDetail {
    id: number;
    name: string;
    specialization?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatar_url?: string;
}

interface ScheduleDetailProps {
    doctor: DoctorDetail;
    timeSlots: TimeSlot[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

function formatTime(time: string): string {
    return time.length === 8 ? time.slice(0, 5) : time;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconArrowLeft() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}

function IconClock() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function IconPhone() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12.1 19.79 19.79 0 0 1 1.14 3.5 2 2 0 0 1 3.11 1.3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.28 16.92z" />
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

// ─── Slot Group by Date ───────────────────────────────────────────────────────

function groupByDate(slots: TimeSlot[]): Record<string, TimeSlot[]> {
    return slots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
        const key = slot.date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(slot);
        return acc;
    }, {});
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScheduleDetail({ doctor, timeSlots }: ScheduleDetailProps) {
    const grouped = groupByDate(timeSlots);
    const sortedDates = Object.keys(grouped).sort();

    const totalSlots = timeSlots.length;
    const availableSlots = timeSlots.filter((s) => !s.is_booked).length;
    const bookedSlots = totalSlots - availableSlots;

    return (
        <MainLayout>
            <Head title={`Jadwal ${doctor.name}`} />

            <section className="section page-enter">

                {/* ── Back Button ── */}
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => router.visit('/schedule')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem', paddingLeft: 0 }}
                >
                    <IconArrowLeft />
                    Kembali ke Jadwal
                </button>

                {/* ── Doctor Profile Card ── */}
                <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                        {/* Avatar */}
                        <div className="doctor-avatar" style={{ width: '64px', height: '64px', fontSize: '1.4rem', flexShrink: 0, overflow: 'hidden' }}>
                            {doctor.avatar_url ? (
                                <img
                                    src={doctor.avatar_url}
                                    alt={doctor.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                getInitials(doctor.name ?? '')
                            )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                                {doctor.name}
                            </h2>
                            <span className="doctor-specialization" style={{ fontSize: '0.85rem' }}>
                                {doctor.specialization || 'Umum'}
                            </span>

                            {doctor.bio && (
                                <p className="doctor-bio" style={{ marginTop: '0.65rem', fontSize: '0.88rem' }}>
                                    {doctor.bio}
                                </p>
                            )}

                            {(doctor.email || doctor.phone) && (
                                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                    {doctor.email && (
                                        <div className="doctor-contact">
                                            <IconMail />
                                            <span>{doctor.email}</span>
                                        </div>
                                    )}
                                    {doctor.phone && (
                                        <div className="doctor-contact">
                                            <IconPhone />
                                            <span>{doctor.phone}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Slot Stats */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            flexShrink: 0,
                            flexWrap: 'wrap',
                        }}>
                            {[
                                { label: 'Total Slot', value: totalSlots, color: 'var(--color-primary)' },
                                { label: 'Tersedia', value: availableSlots, color: '#10b981' },
                                { label: 'Terboking', value: bookedSlots, color: '#ef4444' },
                            ].map((stat) => (
                                <div key={stat.label} style={{
                                    textAlign: 'center',
                                    background: 'var(--color-surface-alt)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.65rem 1rem',
                                    minWidth: '80px',
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => router.visit(`/appointments/create?doctor_id=${doctor.id}`)}
                        >
                            Buat Janji dengan Dokter Ini
                        </button>
                    </div>
                </div>

                {/* ── Section Title ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    <IconCalendar />
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                        Semua Jadwal Tersedia
                    </h3>
                </div>

                {/* ── Timeslot List (Grouped by Date) ── */}
                {sortedDates.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {sortedDates.map((date) => (
                            <div key={date} className="dashboard-card" style={{ padding: '1.25rem 1.5rem' }}>
                                {/* Date Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    paddingBottom: '0.75rem',
                                    borderBottom: '1px solid var(--color-border)',
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--color-primary)',
                                        flexShrink: 0,
                                    }} />
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                                        {formatDate(date)}
                                    </span>
                                    <span style={{
                                        marginLeft: 'auto',
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)',
                                        fontWeight: 600,
                                    }}>
                                        {grouped[date].filter(s => !s.is_booked).length} tersedia
                                    </span>
                                </div>

                                {/* Slots */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {grouped[date].map((slot) => (
                                        <div key={slot.id} className="time-slot-row" style={{
                                            opacity: slot.is_booked ? 0.6 : 1,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
                                                <IconClock />
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                                </span>
                                            </div>
                                            <span className={slot.is_booked ? 'status-chip status-cancelled' : 'status-chip status-scheduled'}>
                                                {slot.is_booked ? 'Terboking' : 'Tersedia'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <IconEmpty />
                        <h3>Belum ada jadwal</h3>
                        <p>Dokter ini belum memiliki jadwal yang tersedia.</p>
                    </div>
                )}

            </section>
        </MainLayout>
    );
}
