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
        <section className="section" style={{ padding: '4rem 0' }}>
            <motion.div 
                className="section-header"
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Find Your Doctor</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--color-text-muted)' }}>Browse our directory of specialized medical professionals. Filter by specialization and availability to find the right care for your needs today.</p>
            </motion.div>

            <div className="doctors-grid">
                {doctors.map((doctor, index) => (
                    <motion.div 
                        key={doctor.id} 
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        whileHover={{ y: -8, boxShadow: 'var(--shadow-card)' }}
                        className="doctor-card glass-panel"
                        style={{ border: 'none', background: 'var(--color-surface)', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gradient-button)' }} />
                        
                        <div className="doctor-card-header">
                            <div className="doctor-avatar" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: '2px solid white', boxShadow: 'var(--shadow-soft)' }}>
                                {doctor.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>{doctor.name}</h3>
                                <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
                                    <UserRoundCheck size={14} /> {doctor.specialization}
                                </p>
                            </div>
                        </div>
                        
                        <div className="doctor-card-body" style={{ margin: '1rem 0' }}>
                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                {doctor.bio || 'Experienced provider ready to support your care.'}
                            </p>
                        </div>
                        
                        <div className="doctor-card-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                            <span className="badge badge-available" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                <Clock size={14} /> Available Today
                            </span>
                            <Link href="/appointments" className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.25rem', boxShadow: 'var(--shadow-glow)' }}>
                                Book Appointment
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
