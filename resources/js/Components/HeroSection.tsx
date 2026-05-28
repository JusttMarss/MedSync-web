import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, ShieldCheck } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, rotate: -2 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function HeroSection() {
    return (
        <section className="home-hero" style={{ overflow: 'hidden' }}>
            <div className="hero-grid">
                <motion.div 
                    className="hero-copy"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.span variants={itemVariants} className="eyebrow glass-panel" style={{ display: 'inline-flex', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(15,118,159,0.2)', background: 'var(--color-surface-alt)' }}>
                        <ShieldCheck size={16} /> Top Rated Clinic 2024
                    </motion.span>
                    
                    <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, color: 'var(--color-text)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                        Your Health, <br/><span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Simplified.</span>
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Experience modern healthcare with seamless appointment booking, expert specialists, and instant access to your medical records all in one place.
                    </motion.p>

                    <motion.div variants={itemVariants} className="hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <Link href="/appointments" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1.05rem', boxShadow: 'var(--shadow-glow)' }}>
                            Book Appointment
                        </Link>
                        <Link href="/doctors" className="btn btn-outline" style={{ padding: '0.875rem 1.75rem', fontSize: '1.05rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            Find a Doctor
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="hero-trust" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="avatar-stack" style={{ display: 'flex', marginLeft: '0.5rem' }}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'grid', placeItems: 'center', fontSize: '0.8rem', fontWeight: 700, marginLeft: '-0.5rem', boxShadow: 'var(--shadow-soft)' }}>
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Trusted by 10,000+ patients</span>
                    </motion.div>
                </motion.div>

                <div className="hero-visual" style={{ position: 'relative' }}>
                    <motion.div 
                        className="hero-card"
                        variants={imageVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', position: 'relative', background: 'var(--color-surface)' }}
                    >
                        <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80" alt="Doctor with tablet" className="hero-image" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', aspectRatio: '4/5' }} />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20, x: -20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                            className="hero-badge glass-panel" 
                            style={{ position: 'absolute', bottom: '1.5rem', left: '-1rem', padding: '1rem 1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'grid', placeItems: 'center' }}>
                                <Calendar size={20} />
                            </div>
                            <div>
                                <div className="badge-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Available</div>
                                <div className="badge-value" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>Today, 2:30 PM</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
