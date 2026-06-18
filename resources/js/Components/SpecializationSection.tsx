import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';
import {
    Heart, Baby, Smile, Brain,
    Eye, Wind, Bone, Stethoscope,
} from 'lucide-react';

const specializations = [
    { icon: <Heart size={26} />,       name: 'Kardiologi',  count: 6,  key: 'Cardiology' },
    { icon: <Baby size={26} />,        name: 'Pediatri',    count: 5,  key: 'Pediatrics' },
    { icon: <Smile size={26} />,       name: 'Gigi',        count: 4,  key: 'Dentistry' },
    { icon: <Brain size={26} />,       name: 'Neurologi',   count: 3,  key: 'Neurology' },
    { icon: <Eye size={26} />,         name: 'Mata',        count: 4,  key: 'Ophthalmology' },
    { icon: <Wind size={26} />,        name: 'Paru-Paru',   count: 3,  key: 'Pulmonology' },
    { icon: <Bone size={26} />,        name: 'Ortopedi',    count: 4,  key: 'Orthopedics' },
    { icon: <Stethoscope size={26} />, name: 'Umum',        count: 8,  key: 'General Practice' },
];

const cardVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
    }),
};

export default function SpecializationSection() {
    function goToSpec(key: string) {
        router.get('/doctors', { specialization: key }, { preserveState: false });
    }

    return (
        <section style={{ padding: 'clamp(3rem, 5vw, 5rem) 0', background: 'var(--color-surface-solid)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2.5rem)' }}>
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
                        Semua Bidang Tersedia
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                        Pilih{' '}
                        <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Spesialisasi
                        </span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
                        Kami memiliki dokter spesialis di berbagai bidang untuk memenuhi semua kebutuhan kesehatanmu.
                    </p>
                </motion.div>

                {/* Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}
                >
                    {specializations.map((spec, i) => (
                        <motion.button
                            key={spec.key}
                            custom={i}
                            variants={cardVariants}
                            whileHover={{ y: -5, boxShadow: 'var(--shadow-card)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => goToSpec(spec.key)}
                            style={{
                                background: 'var(--color-background)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '18px',
                                padding: '1.5rem 1.25rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'border-color 0.2s ease',
                            }}
                        >
                            <div style={{
                                width: '58px', height: '58px', borderRadius: '16px',
                                background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                display: 'grid', placeItems: 'center',
                            }}>
                                {spec.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '3px' }}>
                                    {spec.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                    {spec.count} dokter tersedia
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
