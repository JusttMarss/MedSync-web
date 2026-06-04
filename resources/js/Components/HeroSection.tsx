import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, ShieldCheck } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const avatarData = [
    { label: 'A', anim: 'floatA', delay: '0s' },
    { label: 'B', anim: 'floatB', delay: '0.4s' },
    { label: 'C', anim: 'floatC', delay: '0.8s' },
];

export default function HeroSection() {
    return (
        <section
            className="home-hero"
            style={{
                overflow: 'hidden',
                background: 'radial-gradient(circle at top right, rgba(65,144,213,0.1), transparent 35%), radial-gradient(circle at top left, rgba(0,136,163,0.1), transparent 20%), var(--color-background)',
            }}
        >
            {/* max-width container */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2.5rem 4rem' }}>
                <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem' }}>

                    {/* ── Left copy ── */}
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.span
                            variants={itemVariants}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                borderRadius: '99px', padding: '0.45rem 1rem',
                                fontSize: '0.82rem', fontWeight: 600,
                                marginBottom: '1.5rem',
                                border: '1px solid rgba(15,118,159,0.18)',
                            }}
                        >
                            <ShieldCheck size={14} /> Top Rated Clinic 2024
                        </motion.span>

                        <motion.h1
                            variants={itemVariants}
                            style={{
                                fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
                                fontWeight: 800, lineHeight: 1.08,
                                letterSpacing: '-0.03em', color: 'var(--color-text)',
                                marginBottom: '1.25rem',
                            }}
                        >
                            Your Health,{' '}
                            <br />
                            <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Simplified.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', maxWidth: '460px', marginBottom: '2rem', lineHeight: 1.65 }}
                        >
                            Experience modern healthcare with seamless appointment booking, expert specialists, and instant access to your medical records all in one place.
                        </motion.p>

                        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            <Link href="/appointments" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem', boxShadow: 'var(--shadow-glow)' }}>
                                Book Appointment
                            </Link>
                            <Link href="/doctors" className="btn btn-outline" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem', background: 'var(--color-surface-solid)', border: '1px solid var(--color-border)' }}>
                                Find a Doctor
                            </Link>
                        </motion.div>

                        {/* Trust badge dengan animasi */}
                        <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ display: 'flex' }}>
                                {avatarData.map(({ label, anim, delay }, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '38px', height: '38px', borderRadius: '50%',
                                            background: 'var(--color-primary-soft)',
                                            color: 'var(--color-primary)',
                                            border: '2.5px solid white',
                                            display: 'grid', placeItems: 'center',
                                            fontSize: '0.75rem', fontWeight: 700,
                                            marginLeft: i === 0 ? 0 : '-10px',
                                            boxShadow: 'var(--shadow-soft)',
                                            animation: `${anim} 3s ease-in-out infinite`,
                                            animationDelay: delay,
                                        }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                            <span style={{
                                fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500,
                                animation: 'fadePulse 3s ease-in-out infinite',
                            }}>
                                Trusted by 10,000+ patients
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* ── Right visual ── */}
                    <div style={{ position: 'relative' }}>
                        {/* dekoratif lingkaran */}
                        <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary-soft)', opacity: 0.6, zIndex: 0 }} />
                        <div style={{ position: 'absolute', bottom: '5rem', right: '-1.5rem', width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.3, zIndex: 0 }} />

                        <motion.div
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', position: 'relative', maxHeight: '520px' }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80"
                                alt="Doctor in clinic"
                                style={{
                                    width: '100%',
                                    height: '520px',
                                    objectFit: 'cover',
                                    objectPosition: 'center top',
                                    display: 'block',
                                }}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20, x: -20 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                                style={{
                                    position: 'absolute', bottom: '1.5rem', left: '-1.25rem',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    borderRadius: '16px', padding: '0.9rem 1.1rem',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    boxShadow: '0 8px 28px rgba(15,118,159,0.15)',
                                    border: '1px solid rgba(255,255,255,0.8)',
                                    zIndex: 10,
                                }}
                            >
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'grid', placeItems: 'center' }}>
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                        Next Available
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
                                        Today, 2:30 PM
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}