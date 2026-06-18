import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { HeartPulse, ArrowRight } from 'lucide-react';

export default function CtaBannerSection() {
    return (
        <section style={{ padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 4vw, 2.5rem) clamp(3rem, 5vw, 5rem)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        borderRadius: '28px',
                        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* decorative circles */}
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

                    {/* icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{
                            width: '64px', height: '64px', borderRadius: '20px',
                            background: 'rgba(255,255,255,0.18)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            display: 'grid', placeItems: 'center',
                            margin: '0 auto 1.5rem',
                            color: 'white',
                            position: 'relative', zIndex: 1,
                        }}
                    >
                        <HeartPulse size={30} strokeWidth={1.5} />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                            fontWeight: 800, color: '#fff',
                            marginBottom: '0.75rem', lineHeight: 1.2,
                            position: 'relative', zIndex: 1,
                        }}
                    >
                        Mulai Jaga Kesehatanmu Sekarang
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        style={{
                            fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)',
                            maxWidth: '520px', margin: '0 auto 2.5rem',
                            lineHeight: 1.65, position: 'relative', zIndex: 1,
                        }}
                    >
                        Bergabung dengan 10,000+ pasien yang sudah mempercayakan kesehatan mereka kepada MedSync Pro. Gratis, cepat, dan mudah.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}
                    >
                        <Link
                            href="/register"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.9rem 2rem',
                                borderRadius: '99px',
                                background: 'white',
                                color: 'var(--color-primary)',
                                fontWeight: 700, fontSize: '1rem',
                                textDecoration: 'none',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                        >
                            Daftar Gratis
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/doctors"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.9rem 2rem',
                                borderRadius: '99px',
                                background: 'rgba(255,255,255,0.15)',
                                border: '1.5px solid rgba(255,255,255,0.4)',
                                color: 'white',
                                fontWeight: 700, fontSize: '1rem',
                                textDecoration: 'none',
                                backdropFilter: 'blur(8px)',
                                transition: 'background 0.2s',
                            }}
                        >
                            Lihat Dokter
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
