import { motion } from 'framer-motion';
import { UserPlus, Stethoscope, CalendarCheck, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

const steps = [
    {
        number: '01',
        icon: <UserPlus size={28} />,
        title: 'Buat Akun',
        desc: 'Daftar gratis dalam 1 menit dengan email kamu. Tidak perlu kartu kredit.',
    },
    {
        number: '02',
        icon: <Stethoscope size={28} />,
        title: 'Pilih Dokter',
        desc: 'Temukan spesialis yang tepat sesuai kebutuhanmu dari direktori lengkap kami.',
    },
    {
        number: '03',
        icon: <CalendarCheck size={28} />,
        title: 'Pilih Jadwal',
        desc: 'Lihat slot tersedia secara real-time dan pilih waktu yang paling cocok.',
    },
    {
        number: '04',
        icon: <CheckCircle size={28} />,
        title: 'Konfirmasi',
        desc: 'Terima notifikasi instan dan datang tepat waktu untuk konsultasi.',
    },
];

const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HowItWorksSection() {
    return (
        <section style={{ padding: '5rem 0', background: 'var(--color-background)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2.5rem' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '3.5rem' }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                        borderRadius: '99px', padding: '0.45rem 1rem',
                        fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem',
                        border: '1px solid rgba(15,118,159,0.15)',
                    }}>
                        Mudah & Cepat
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                        Cara{' '}
                        <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Kerja
                        </span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
                        Booking dokter jadi semudah 4 langkah. Tidak perlu antri, tidak perlu telepon.
                    </p>
                </motion.div>

                {/* Steps grid */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', position: 'relative' }}
                >
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{ y: -6, boxShadow: 'var(--shadow-card)' }}
                            style={{
                                background: 'var(--color-surface-solid)',
                                borderRadius: '20px',
                                padding: '2rem 1.75rem',
                                border: '1px solid var(--color-border)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            {/* top accent bar */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                                background: 'var(--gradient-button)',
                                opacity: 0.6,
                            }} />

                            {/* step number watermark */}
                            <div style={{
                                position: 'absolute', top: '1rem', right: '1.25rem',
                                fontSize: '3.5rem', fontWeight: 900,
                                color: 'var(--color-primary-soft)',
                                lineHeight: 1, userSelect: 'none',
                                letterSpacing: '-0.04em',
                            }}>
                                {step.number}
                            </div>

                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                display: 'grid', placeItems: 'center',
                                marginBottom: '1.25rem',
                            }}>
                                {step.icon}
                            </div>

                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                {step.title}
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                                {step.desc}
                            </p>

                            {/* arrow connector (not last) */}
                            {i < steps.length - 1 && (
                                <div style={{
                                    display: 'none', // shown via CSS on large screens via inline below
                                }} />
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ textAlign: 'center', marginTop: '2.5rem' }}
                >
                    <Link
                        href="/register"
                        className="btn btn-primary"
                        style={{ padding: '0.875rem 2rem', fontSize: '1rem', boxShadow: 'var(--shadow-glow)' }}
                    >
                        Mulai Sekarang — Gratis
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
