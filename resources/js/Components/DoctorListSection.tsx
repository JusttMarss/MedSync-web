import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserRoundCheck, Clock } from 'lucide-react';
import type { Doctor } from '../types';

interface DoctorListSectionProps {
    doctors: Doctor[];
}

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
        }
    })
};

export default function DoctorListSection({ doctors }: DoctorListSectionProps) {
    return (
        <section className="section" style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2.5rem)' }}>
                <motion.div 
                    className="section-header"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-primary)' }}>Temukan Dokter yang Tepat</h2>
                    <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--color-text-muted)' }}>Telusuri daftar dokter spesialis kami. Gunakan filter spesialisasi dan jadwal yang tersedia untuk menemukan dokter yang sesuai dengan kebutuhan Anda.</p>
                </motion.div>

                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 'clamp(1rem, 3vw, 1.5rem)',
                    alignItems: 'start'
                }}>
                {doctors.map((doctor, index) => (
                    <motion.div 
                        key={doctor.id} 
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        whileHover={{ y: -6, boxShadow: 'var(--shadow-card)' }}
                        className="doctor-card glass-panel"
                        style={{ 
                            background: 'var(--color-surface-solid)',
                            borderRadius: '20px',
                            padding: '1.75rem',
                            border: '1px solid var(--color-border)',
                            position: 'relative', 
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'box-shadow 0.3s ease',
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-button)', opacity: 0.6 }} />
                        
                        <div className="doctor-card-header" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
                            <div className="doctor-avatar" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: '2px solid white', boxShadow: 'var(--shadow-soft)', overflow: 'hidden', width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                                {doctor.avatar_url ? (
                                    <img
                                        src={doctor.avatar_url}
                                        alt={doctor.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    doctor.name?.charAt(0)
                                )}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>{doctor.name}</h3>
                                <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', margin: '0.2rem 0 0 0', color: 'var(--color-text-muted)' }}>
                                    <UserRoundCheck size={13} /> {doctor.specialization}
                                </p>
                            </div>
                        </div>
                        
                        <div className="doctor-card-body" style={{ margin: '0 0 1.25rem 0' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>
                                {doctor.bio || 'Experienced provider ready to support your care.'}
                            </p>
                        </div>
                        
                        <div className="doctor-card-footer" style={{ 
                            borderTop: '1px solid var(--color-border)', 
                            paddingTop: '1rem', 
                            marginTop: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            gap: '0.75rem'
                        }}>
                            <span className="badge badge-available" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '16px', fontWeight: 600, justifyContent: 'center' }}>
                                <Clock size={13} /> Available Today
                            </span>
                            <Link href={`/schedule/${doctor.id}`} className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '12px', textAlign: 'center' }}>
                                Lihat Jadwal
                            </Link>
                        </div>
                    </motion.div>
                ))}
                </div>
            </div>
        </section>
    );
}
