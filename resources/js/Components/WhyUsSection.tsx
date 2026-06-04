import { motion } from 'framer-motion';
import { ShieldCheck, Clock, FileText, Bell } from 'lucide-react';

const features = [
    {
        icon: <ShieldCheck size={26} />,
        title: 'Dokter Terverifikasi',
        desc: 'Semua dokter telah melalui proses verifikasi ketat dan memiliki izin praktik resmi yang aktif.',
    },
    {
        icon: <Clock size={26} />,
        title: 'Booking 24/7',
        desc: 'Buat janji kapan saja, di mana saja, tanpa perlu menelepon atau datang langsung ke klinik.',
    },
    {
        icon: <FileText size={26} />,
        title: 'Rekam Medis Digital',
        desc: 'Riwayat kesehatan tersimpan aman secara digital dan bisa diakses kapanpun kamu butuhkan.',
    },
    {
        icon: <Bell size={26} />,
        title: 'Notifikasi Otomatis',
        desc: 'Pengingat jadwal otomatis agar kamu tidak pernah melewatkan satu pun appointment penting.',
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
};

export default function WhyUsSection() {
    return (
        <section style={{ padding: '5rem 0', background: 'var(--color-background)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2.5rem' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                        borderRadius: '99px', padding: '0.45rem 1rem',
                        fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem',
                        border: '1px solid rgba(15,118,159,0.15)',
                    }}>
                        Keunggulan Kami
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                        Kenapa{' '}
                        <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Pilih Kami
                        </span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
                        Dirancang untuk memberikan pengalaman healthcare yang modern, aman, dan nyaman.
                    </p>
                </motion.div>

                {/* Cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                            style={{
                                background: 'var(--color-surface-solid)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '20px',
                                padding: '1.75rem',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* subtle gradient corner */}
                            <div style={{
                                position: 'absolute', top: 0, right: 0,
                                width: '80px', height: '80px',
                                background: 'radial-gradient(circle at top right, var(--color-primary-soft), transparent 70%)',
                                pointerEvents: 'none',
                            }} />

                            <div style={{
                                width: '52px', height: '52px', borderRadius: '14px',
                                background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                display: 'grid', placeItems: 'center',
                                marginBottom: '1.25rem',
                            }}>
                                {f.icon}
                            </div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                {f.title}
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
