import { motion } from 'framer-motion';
import { Stethoscope, Users, CalendarCheck } from 'lucide-react';
import type { Stats } from '../types';

interface StatsSectionProps {
    stats: Stats;
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: "easeOut"
        }
    })
};

export default function StatsSection({ stats }: StatsSectionProps) {
    const statItems = [
        { icon: <Stethoscope size={28} />, value: stats.doctors, label: 'Dokter Aktif', color: '#0ea5e9' },
        { icon: <Users size={28} />, value: stats.patients, label: 'Pasien Terdaftar', color: '#38bdf8' },
        { icon: <CalendarCheck size={28} />, value: stats.appointments, label: 'Total Appointment', color: '#0284c7' },
    ];

    return (
        <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0', position: 'relative' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2.5rem)' }}>
                <div className="stats-grid">

                    {statItems.map((item, index) => (
                        <motion.div 
                            key={index}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="stat-card glass-panel"
                            whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(15, 118, 159, 0.15)' }}
                            style={{ border: 'none', background: 'var(--color-surface)' }}
                        >
                            <div className="stat-icon" style={{ background: 'var(--color-primary-soft)', color: item.color }}>
                                {item.icon}
                            </div>
                            <div className="stat-number">{item.value}</div>
                            <div className="stat-label">{item.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
