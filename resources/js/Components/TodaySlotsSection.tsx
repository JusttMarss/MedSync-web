import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Clock, Calendar } from 'lucide-react';

export interface TimeSlot {
    id: number;
    doctorName: string;
    specialization: string;
    startTime: string;
    endTime: string;
}

interface TodaySlotsSectionProps {
    slots?: TimeSlot[];
}

// Fallback demo data kalau props kosong
const demoSlots: TimeSlot[] = [
    { id: 1, doctorName: 'Dr. Diana Putri',   specialization: 'Kardiologi',  startTime: '10:00', endTime: '10:30' },
    { id: 2, doctorName: 'Dr. Rizky Andika',  specialization: 'Pediatri',    startTime: '11:00', endTime: '11:30' },
    { id: 3, doctorName: 'Dr. Sari Dewi',     specialization: 'Umum',        startTime: '13:00', endTime: '13:30' },
    { id: 4, doctorName: 'Dr. Budi Santoso',  specialization: 'Neurologi',   startTime: '14:30', endTime: '15:00' },
    { id: 5, doctorName: 'Dr. Anisa Rahma',   specialization: 'Gigi',        startTime: '15:00', endTime: '15:30' },
    { id: 6, doctorName: 'Dr. Hendra Kusuma', specialization: 'Mata',        startTime: '16:00', endTime: '16:30' },
];

export default function TodaySlotsSection({ slots }: TodaySlotsSectionProps) {
    const displaySlots = slots && slots.length > 0 ? slots : demoSlots;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <section style={{ padding: '5rem 0', background: 'var(--color-surface-solid)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2.5rem' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}
                >
                    <div>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                            borderRadius: '99px', padding: '0.45rem 1rem',
                            fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem',
                            border: '1px solid rgba(15,118,159,0.15)',
                        }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                            Live — Tersedia Sekarang
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                            Slot{' '}
                            <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Tersedia Hari Ini
                            </span>
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            <Calendar size={14} />
                            {today}
                        </div>
                    </div>
                    <Link
                        href="/appointments"
                        className="btn btn-outline"
                        style={{ fontSize: '0.9rem', padding: '0.7rem 1.4rem', border: '1px solid var(--color-border)' }}
                    >
                        Lihat Semua Jadwal
                    </Link>
                </motion.div>

                {/* Horizontal scroll */}
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollSnapType: 'x mandatory' }}>
                    {displaySlots.map((slot, i) => (
                        <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            whileHover={{ y: -4, boxShadow: 'var(--shadow-card)' }}
                            style={{
                                background: 'var(--color-background)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                flexShrink: 0,
                                minWidth: '210px',
                                scrollSnapAlign: 'start',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.35rem',
                            }}
                        >
                            {/* avatar initial */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '50%',
                                    background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                    display: 'grid', placeItems: 'center',
                                    fontSize: '0.8rem', fontWeight: 700,
                                    flexShrink: 0,
                                }}>
                                    {slot.doctorName.split(' ').slice(-1)[0].charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
                                        {slot.doctorName}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        {slot.specialization}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                <Clock size={13} />
                                {slot.startTime} – {slot.endTime}
                            </div>

                            <Link
                                href="/appointments"
                                className="btn btn-primary btn-sm"
                                style={{ marginTop: '0.75rem', fontSize: '0.82rem', padding: '0.55rem 1rem', width: '100%', justifyContent: 'center' }}
                            >
                                Book Sekarang
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </section>
    );
}
