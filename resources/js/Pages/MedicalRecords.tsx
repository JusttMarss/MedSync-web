import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Calendar, Stethoscope, Pill,
    FileText, Search, X, ChevronRight, Sparkles, Activity,
} from 'lucide-react';

interface MedicalRecord {
    id: number;
    visit_date: string;
    doctor: string;
    specialization: string;
    diagnosis: string;
    treatment: string | null;
    medications: string[] | null;
    notes: string | null;
}

interface MedicalRecordsProps {
    records: MedicalRecord[];
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
    }),
};

export default function MedicalRecords({ records }: MedicalRecordsProps) {
    const [search, setSearch]     = useState('');
    const [selected, setSelected] = useState<MedicalRecord | null>(null);

    const filtered = records.filter(r =>
        r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
        (r.doctor ?? '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainLayout>
            <Head title="Rekam Medis" />

            <section className="section page-section" style={{ padding: '1rem 0 3rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>
                        Riwayat Kesehatan Kamu
                    </div>
                    <h2 style={{
                        fontSize: '2.25rem', fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Rekam Medis
                    </h2>
                    <p style={{ marginTop: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                        Lihat seluruh riwayat diagnosa, penanganan, dan catatan dokter dari setiap kunjungan.
                    </p>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '2rem' }}>
                    <Search size={17} style={{
                        position: 'absolute', left: '1rem', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--color-text-muted)',
                    }} />
                    <input
                        type="search"
                        className="filter-input"
                        placeholder="Cari diagnosa atau nama dokter..."
                        style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-md)' }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Records list */}
                {filtered.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        {filtered.map((record, i) => (
                            <motion.div
                                key={record.id}
                                custom={i}
                                variants={cardVariants}
                                whileHover={{ y: -2, boxShadow: 'var(--shadow-card)' }}
                                style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1.5rem',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onClick={() => setSelected(record)}
                            >
                                {/* left accent bar */}
                                <div style={{
                                    position: 'absolute', left: 0, top: 0, bottom: 0,
                                    width: '4px',
                                    background: 'var(--gradient-button)',
                                    borderRadius: '4px 0 0 4px',
                                }} />

                                <div style={{ paddingLeft: '0.5rem' }}>
                                    {/* date + doctor row */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                            <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
                                            {record.visit_date}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                            <Stethoscope size={13} style={{ color: 'var(--color-primary)' }} />
                                            {record.doctor}
                                            {record.specialization && (
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                                    — {record.specialization}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* diagnosis */}
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                            Diagnosa
                                        </span>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                                            {record.diagnosis}
                                        </p>
                                    </div>

                                    {/* medications preview */}
                                    {record.medications && record.medications.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                                            <Pill size={13} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                                            {record.medications.slice(0, 3).join(', ')}
                                            {record.medications.length > 3 && (
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                                    +{record.medications.length - 3} lainnya
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* arrow button */}
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'var(--color-primary-soft)',
                                    display: 'grid', placeItems: 'center',
                                    color: 'var(--color-primary)', flexShrink: 0,
                                }}>
                                    <ChevronRight size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div style={{
                        textAlign: 'center', padding: '4rem 2rem',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                    }}>
                        <ClipboardList size={44} style={{ margin: '0 auto 1rem', color: 'var(--color-primary)', opacity: 0.25 }} />
                        <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                            {search ? 'Tidak ditemukan rekam medis yang cocok.' : 'Belum ada rekam medis.'}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                            Rekam medis akan muncul setelah dokter mengisi data kunjunganmu.
                        </p>
                    </div>
                )}
            </section>

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <div
                        style={{
                            position: 'fixed', inset: 0, zIndex: 50,
                            background: 'rgba(15,23,42,0.45)',
                            backdropFilter: 'blur(4px)',
                            display: 'grid', placeItems: 'center',
                            padding: '1.5rem',
                        }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-lg)',
                                width: '100%', maxWidth: '580px',
                                boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                                overflow: 'hidden',
                                maxHeight: '90vh',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Modal header */}
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                flexShrink: 0,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                                    <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>Detail Rekam Medis</span>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'var(--color-surface-alt)',
                                        border: '1px solid var(--color-border)',
                                        display: 'grid', placeItems: 'center',
                                        cursor: 'pointer', color: 'var(--color-text-muted)',
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Modal body — scrollable */}
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>

                                {/* doctor + date card */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                                    padding: '1rem', borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-primary-soft)',
                                    flexWrap: 'wrap',
                                }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        background: 'var(--gradient-button)', color: '#fff',
                                        display: 'grid', placeItems: 'center',
                                        fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                                    }}>
                                        {selected.doctor?.charAt(0) ?? '?'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selected.doctor}</div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>{selected.specialization}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tanggal Kunjungan</div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{selected.visit_date}</div>
                                    </div>
                                </div>

                                {/* Diagnosa */}
                                <InfoBlock icon={<Stethoscope size={13} />} label="Diagnosa">
                                    <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                                        {selected.diagnosis}
                                    </span>
                                </InfoBlock>

                                {/* Treatment */}
                                <InfoBlock icon={<Activity size={13} />} label="Penanganan / Treatment">
                                    <span style={{ color: selected.treatment ? 'var(--color-text)' : 'var(--color-text-muted)', fontStyle: selected.treatment ? 'normal' : 'italic', lineHeight: 1.65, fontSize: '0.9rem' }}>
                                        {selected.treatment || 'Tidak ada catatan penanganan.'}
                                    </span>
                                </InfoBlock>

                                {/* Medications */}
                                <InfoBlock icon={<Pill size={13} />} label="Obat / Medications">
                                    {selected.medications && selected.medications.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {selected.medications.map((med, i) => (
                                                <span key={i} style={{
                                                    padding: '0.35rem 0.85rem',
                                                    borderRadius: '99px',
                                                    background: 'var(--color-primary-soft)',
                                                    color: 'var(--color-primary)',
                                                    fontSize: '0.82rem', fontWeight: 600,
                                                    border: '1px solid rgba(15,118,159,0.15)',
                                                }}>
                                                    {med}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                            Tidak ada obat yang diresepkan.
                                        </span>
                                    )}
                                </InfoBlock>

                                {/* Notes */}
                                <InfoBlock icon={<FileText size={13} />} label="Catatan Dokter">
                                    <span style={{ color: selected.notes ? 'var(--color-text)' : 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.65, fontSize: '0.9rem' }}>
                                        {selected.notes ? `"${selected.notes}"` : 'Tidak ada catatan tambahan.'}
                                    </span>
                                </InfoBlock>
                            </div>

                            {/* Modal footer */}
                            <div style={{
                                padding: '1rem 1.5rem',
                                borderTop: '1px solid var(--color-border)',
                                display: 'flex', justifyContent: 'flex-end',
                                flexShrink: 0,
                            }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ borderRadius: 'var(--radius-md)', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                                    onClick={() => setSelected(null)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}

// ── Helper component ──────────────────────────────────────────────
function InfoBlock({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
    return (
        <div>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem',
            }}>
                {icon} {label}
            </div>
            <div style={{
                padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)',
            }}>
                {children}
            </div>
        </div>
    );
}