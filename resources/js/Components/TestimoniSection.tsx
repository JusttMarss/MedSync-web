import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        initials: 'AR',
        name: 'Andi Rahmawan',
        role: 'Pasien Kardiologi',
        rating: 5,
        text: 'Proses bookingnya sangat mudah dan cepat. Tidak perlu antri lama, tinggal pilih jadwal dan konfirmasi. Dokternya juga sangat profesional dan informatif.',
    },
    {
        initials: 'SW',
        name: 'Sinta Wijaya',
        role: 'Pasien Pediatri',
        rating: 5,
        text: 'Fitur rekam medis digitalnya sangat membantu. Semua riwayat kesehatan anak saya tersimpan rapi dan bisa dilihat kapanpun oleh dokter yang menangani.',
    },
    {
        initials: 'BN',
        name: 'Bagas Nugraha',
        role: 'Pasien Umum',
        rating: 5,
        text: 'Notifikasi otomatisnya sangat berguna, saya tidak pernah lupa jadwal dokter lagi. Aplikasi ini benar-benar mengubah cara saya menjaga kesehatan keluarga.',
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
    }),
};

export default function TestimoniSection() {
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
                        Dari Pasien Kami
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                        Kata{' '}
                        <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Pasien Kami
                        </span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.65 }}>
                        Ribuan pasien telah mempercayakan kesehatan mereka kepada MedSync Pro.
                    </p>
                </motion.div>

                {/* Cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}
                >
                    {testimonials.map((t, i) => (
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
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* quote mark decoration */}
                            <div style={{
                                position: 'absolute', top: '1rem', right: '1.25rem',
                                fontSize: '5rem', lineHeight: 1,
                                color: 'var(--color-primary-soft)',
                                fontFamily: 'Georgia, serif',
                                userSelect: 'none',
                                pointerEvents: 'none',
                            }}>
                                "
                            </div>

                            {/* stars */}
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {Array.from({ length: t.rating }).map((_, si) => (
                                    <Star key={si} size={15} fill="#f59e0b" stroke="none" />
                                ))}
                            </div>

                            <p style={{
                                fontSize: '0.9rem', color: 'var(--color-text-muted)',
                                lineHeight: 1.7, fontStyle: 'italic',
                                flex: 1,
                            }}>
                                "{t.text}"
                            </p>

                            {/* author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                    display: 'grid', placeItems: 'center',
                                    fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
                                }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>
                                        {t.name}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                        {t.role}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
