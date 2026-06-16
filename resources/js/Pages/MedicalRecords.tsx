import { useState } from 'react';
import type { ReactNode } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Search, Calendar, User, Activity,
    Pill, Clipboard, X, Clock, Trash2, ArrowLeft, ChevronRight, Eye,
    ClipboardList, Stethoscope, Sparkles,
} from 'lucide-react';

interface MedicalRecordData {
    id: number;
    appointment_id: number;
    patient_id: number;
    patient_name: string;
    patient_dob: string | null;
    patient_gender: string | null;
    doctor_id: number;
    doctor_name: string;
    doctor_specialization: string;
    date: string;
    time: string;
    diagnosis: string | null;
    treatment: string | null;
    medications: string[] | null;
    notes: string | null;
}

interface MedicalRecordsProps {
    records: MedicalRecordData[];
    userName: string;
    userRole: 'admin' | 'doctor' | 'patient';
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
    }),
};

export default function MedicalRecords({ records, userName, userRole }: MedicalRecordsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecordData | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');

    // Handler hapus rekam medis (Admin only)
    const handleDeleteRecord = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus rekam medis ini secara permanen?')) {
            router.delete(`/admin/medical-records/${id}`, {
                onSuccess: () => {
                    if (selectedRecord?.id === id) {
                        setSelectedRecord(null);
                    }
                }
            });
        }
    };

    // Helper functions (dipakai di alur Admin/Doctor)
    const getGenderLabel = (gender: string | null) => {
        if (!gender) return '-';
        return gender.toLowerCase() === 'male' || gender.toLowerCase() === 'l' ? 'Laki-laki' : 'Perempuan';
    };

    const formatDateOfBirth = (dob: string | null) => {
        if (!dob) return '-';
        try {
            const date = new Date(dob);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return dob;
        }
    };

    const calculateAge = (dob: string | null) => {
        if (!dob) return '';
        try {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return `(${age} tahun)`;
        } catch {
            return '';
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    // Group records by patient untuk Doctor/Admin Patient Grid
    const patientsMap = new Map<number, {
        id: number;
        name: string;
        dob: string | null;
        gender: string | null;
        records: MedicalRecordData[];
    }>();

    records.forEach(record => {
        const pId = record.patient_id;
        if (!patientsMap.has(pId)) {
            patientsMap.set(pId, {
                id: pId,
                name: record.patient_name || 'N/A',
                dob: record.patient_dob,
                gender: record.patient_gender,
                records: []
            });
        }
        patientsMap.get(pId)!.records.push(record);
    });

    const uniquePatients = Array.from(patientsMap.values());

    const filteredPatients = uniquePatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Records untuk pasien yang sedang di-drill-down (Doctor/Admin)
    const activeRecords = selectedPatientId ? (patientsMap.get(selectedPatientId)?.records || []) : [];

    const filteredRecords = activeRecords.filter((record) => {
        const diagnosis = record.diagnosis || '';
        const doctorName = record.doctor_name || '';
        const patientName = record.patient_name || '';

        const matchesSearch =
            diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patientName.toLowerCase().includes(searchTerm.toLowerCase());

        if (dateFilter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            return matchesSearch && record.date === today;
        } else if (dateFilter === 'week') {
            const recordDate = new Date(record.date);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return matchesSearch && recordDate >= oneWeekAgo;
        }

        return matchesSearch;
    });

    const selectedPatient = selectedPatientId ? patientsMap.get(selectedPatientId) : null;

    // Records untuk role Patient (desain baru)
    const patientFilteredRecords = records.filter(r =>
        (r.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.doctor_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <Head title={userRole === 'patient' ? 'Rekam Medis' : 'Rekam Medis - MedSync Pro'} />

            {userRole === 'patient' ? (
                <>
                    {/* ===================== PATIENT VIEW (desain baru) ===================== */}
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
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Records list */}
                        {patientFilteredRecords.length > 0 ? (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                            >
                                {patientFilteredRecords.map((record, i) => (
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
                                        onClick={() => setSelectedRecord(record)}
                                    >
                                        <div style={{
                                            position: 'absolute', left: 0, top: 0, bottom: 0,
                                            width: '4px',
                                            background: 'var(--gradient-button)',
                                            borderRadius: '4px 0 0 4px',
                                        }} />

                                        <div style={{ paddingLeft: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                    <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
                                                    {formatDate(record.date)}
                                                    <span style={{ opacity: 0.7 }}>· {record.time}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                    <Stethoscope size={13} style={{ color: 'var(--color-primary)' }} />
                                                    {record.doctor_name || 'N/A'}
                                                    {record.doctor_specialization && (
                                                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                                            — {record.doctor_specialization}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                    Diagnosa
                                                </span>
                                                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                                                    {record.diagnosis || 'Tidak ada diagnosis khusus yang dicatat.'}
                                                </p>
                                            </div>

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
                                    {searchTerm ? 'Tidak ditemukan rekam medis yang cocok.' : 'Belum ada rekam medis.'}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                                    Rekam medis akan muncul setelah dokter mengisi data kunjunganmu.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Detail Modal (Patient) */}
                    <AnimatePresence>
                        {selectedRecord && (
                            <div
                                style={{
                                    position: 'fixed', inset: 0, zIndex: 50,
                                    background: 'rgba(15,23,42,0.45)',
                                    backdropFilter: 'blur(4px)',
                                    display: 'grid', placeItems: 'center',
                                    padding: '1.5rem',
                                }}
                                onClick={() => setSelectedRecord(null)}
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
                                            onClick={() => setSelectedRecord(null)}
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

                                    {/* Modal body */}
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>

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
                                                {selectedRecord.doctor_name?.charAt(0) ?? '?'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selectedRecord.doctor_name}</div>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>{selectedRecord.doctor_specialization}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tanggal Kunjungan</div>
                                                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{formatDate(selectedRecord.date)} · {selectedRecord.time}</div>
                                            </div>
                                        </div>

                                        <InfoBlock icon={<Stethoscope size={13} />} label="Diagnosa">
                                            <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                                                {selectedRecord.diagnosis || 'Tidak ada catatan diagnosis.'}
                                            </span>
                                        </InfoBlock>

                                        <InfoBlock icon={<Activity size={13} />} label="Penanganan / Treatment">
                                            <span style={{ color: selectedRecord.treatment ? 'var(--color-text)' : 'var(--color-text-muted)', fontStyle: selectedRecord.treatment ? 'normal' : 'italic', lineHeight: 1.65, fontSize: '0.9rem' }}>
                                                {selectedRecord.treatment || 'Tidak ada catatan penanganan.'}
                                            </span>
                                        </InfoBlock>

                                        <InfoBlock icon={<Pill size={13} />} label="Obat / Medications">
                                            {selectedRecord.medications && selectedRecord.medications.length > 0 ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {selectedRecord.medications.map((med, i) => (
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

                                        <InfoBlock icon={<FileText size={13} />} label="Catatan Dokter">
                                            <span style={{ color: selectedRecord.notes ? 'var(--color-text)' : 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.65, fontSize: '0.9rem' }}>
                                                {selectedRecord.notes ? `"${selectedRecord.notes}"` : 'Tidak ada catatan tambahan.'}
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
                                            onClick={() => setSelectedRecord(null)}
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <section className="section page-enter">
                    {/* ===================== ADMIN / DOCTOR VIEW (current) ===================== */}

                    {/* Header Title Section */}
                    <div className="home-hero" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '46px', height: '46px', borderRadius: '12px',
                                background: 'var(--gradient-button)',
                                display: 'grid', placeItems: 'center',
                                boxShadow: '0 4px 14px rgba(15,118,159,0.20)',
                            }}>
                                <FileText size={22} color="#fff" />
                            </div>
                            <div>
                                <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Activity size={12} /> Portal Rekam Medis
                                </span>
                                <h2 style={{
                                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                    fontWeight: 800,
                                    color: 'var(--color-text)',
                                    marginTop: '0.25rem',
                                }}>
                                    Dashboard Pasien & Rekam Medis
                                </h2>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                    Cari pasien dan kelola riwayat pemeriksaan rekam medis mereka.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* VIEW 1: Patient Grid (saat belum ada pasien terpilih) */}
                    {!selectedPatientId && (
                        <>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                background: 'var(--color-surface)',
                                padding: '1.25rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-border)',
                            }}>
                                <div style={{ position: 'relative', flex: '1' }}>
                                    <Search size={18} style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--color-text-muted)',
                                    }} />
                                    <input
                                        type="text"
                                        placeholder="Cari pasien berdasarkan nama..."
                                        className="filter-input"
                                        style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {filteredPatients.length > 0 ? (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '1.25rem',
                                    marginBottom: '2rem'
                                }}>
                                    {filteredPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className="dashboard-card"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onClick={() => {
                                                setSelectedPatientId(patient.id);
                                                setSearchTerm('');
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'none';
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                top: 0, left: 0, right: 0, height: '4px',
                                                background: 'var(--gradient-button)'
                                            }} />

                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
                                                    <div style={{
                                                        width: '42px', height: '42px', borderRadius: '50%',
                                                        background: 'rgba(15, 118, 159, 0.08)',
                                                        display: 'grid', placeItems: 'center',
                                                        color: 'var(--color-primary)',
                                                        fontWeight: 'bold', fontSize: '1.1rem'
                                                    }}>
                                                        {patient.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                                                            {patient.name}
                                                        </h3>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                            {getGenderLabel(patient.gender)} • {calculateAge(patient.dob)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    background: 'var(--color-surface-alt)',
                                                    padding: '0.75rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontSize: '0.85rem',
                                                    color: 'var(--color-text-muted)',
                                                    marginBottom: '1rem',
                                                    border: '1px solid var(--color-border)'
                                                }}>
                                                    <strong>Tgl Lahir:</strong> {formatDateOfBirth(patient.dob)}
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                borderTop: '1px solid var(--color-border)',
                                                paddingTop: '0.85rem',
                                                marginTop: '0.5rem'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.82rem',
                                                    fontWeight: 600,
                                                    color: 'var(--color-primary)',
                                                    background: 'rgba(15, 118, 159, 0.08)',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '20px'
                                                }}>
                                                    {patient.records.length} Kunjungan Medis
                                                </span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)' }}>
                                                    Riwayat Medis <ChevronRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '4rem 2rem',
                                    background: 'var(--color-surface-alt)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px dashed var(--color-border)',
                                    marginBottom: '2rem'
                                }}>
                                    <User size={40} style={{ opacity: 0.3, margin: '0 auto 1rem', color: 'var(--color-primary)' }} />
                                    <h3 style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                        Pasien tidak ditemukan
                                    </h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        Tidak ada pasien yang cocok dengan pencarian Anda.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* VIEW 2: Timeline pasien terpilih (Doctor/Admin drill-down) */}
                    {selectedPatientId && (
                        <div>
                            {selectedPatient && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <button
                                        onClick={() => {
                                            setSelectedPatientId(null);
                                            setSearchTerm('');
                                        }}
                                        className="btn btn-outline"
                                        style={{
                                            borderRadius: 'var(--radius-md)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '1rem',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <ArrowLeft size={16} />
                                        Kembali ke Daftar Pasien
                                    </button>

                                    <div className="dashboard-card" style={{
                                        background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(15,118,159,0.03) 100%)',
                                        borderLeft: '4px solid var(--color-primary)'
                                    }}>
                                        <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text)', margin: '0 0 0.5rem 0' }}>
                                            Riwayat Pemeriksaan: {selectedPatient.name}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                                            {getGenderLabel(selectedPatient.gender)} • Lahir: {formatDateOfBirth(selectedPatient.dob)} {calculateAge(selectedPatient.dob)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                background: 'var(--color-surface)',
                                padding: '1.25rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-border)',
                            }}>
                                <div style={{ position: 'relative', flex: '1 1 300px' }}>
                                    <Search size={18} style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--color-text-muted)',
                                    }} />
                                    <input
                                        type="text"
                                        placeholder="Cari diagnosis..."
                                        className="filter-input"
                                        style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setDateFilter('all')}
                                        className={`btn btn-sm ${dateFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ borderRadius: 'var(--radius-md)' }}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        onClick={() => setDateFilter('today')}
                                        className={`btn btn-sm ${dateFilter === 'today' ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ borderRadius: 'var(--radius-md)' }}
                                    >
                                        Hari Ini
                                    </button>
                                    <button
                                        onClick={() => setDateFilter('week')}
                                        className={`btn btn-sm ${dateFilter === 'week' ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ borderRadius: 'var(--radius-md)' }}
                                    >
                                        7 Hari
                                    </button>
                                </div>
                            </div>

                            {filteredRecords.length > 0 ? (
                                <div style={{
                                    position: 'relative',
                                    paddingLeft: '2rem',
                                    borderLeft: '2px solid rgba(15, 118, 159, 0.15)',
                                    marginLeft: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    marginBottom: '2rem'
                                }}>
                                    {filteredRecords.map((record) => (
                                        <div key={record.id} style={{ position: 'relative' }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: 'calc(-2rem - 9px)',
                                                top: '16px',
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                background: '#fff',
                                                border: '3px solid var(--color-primary)',
                                                boxShadow: '0 0 0 4px rgba(15, 118, 159, 0.1)',
                                                zIndex: '2'
                                            }} />

                                            <div
                                                className="dashboard-card"
                                                style={{
                                                    padding: '1.25rem 1.5rem',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius-lg)',
                                                    background: 'var(--color-surface)',
                                                    transition: 'box-shadow 0.2s ease',
                                                    boxShadow: 'var(--shadow-soft)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                                                }}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    gap: '0.75rem',
                                                    borderBottom: '1px dashed var(--color-border)',
                                                    paddingBottom: '0.85rem',
                                                    marginBottom: '0.85rem'
                                                }}>
                                                    <div>
                                                        <span style={{
                                                            fontSize: '0.78rem',
                                                            fontWeight: 700,
                                                            color: 'var(--color-primary)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            display: 'block',
                                                            marginBottom: '0.2rem'
                                                        }}>
                                                            Kunjungan Pemeriksaan
                                                        </span>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            fontWeight: 800,
                                                            color: 'var(--color-text)',
                                                            fontSize: '1.05rem'
                                                        }}>
                                                            <Calendar size={15} style={{ color: 'var(--color-text-muted)' }} />
                                                            {formatDate(record.date)}
                                                            <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>
                                                                ({record.time})
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'right' }}>
                                                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                                            Pasien
                                                        </span>
                                                        <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.92rem' }}>
                                                            {record.patient_name || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{ marginBottom: '1rem' }}>
                                                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                                        Diagnosis Utama
                                                    </h4>
                                                    <div style={{
                                                        fontSize: '0.95rem',
                                                        fontWeight: 600,
                                                        color: '#ef4444',
                                                        background: 'rgba(239, 68, 68, 0.04)',
                                                        padding: '0.6rem 0.85rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        borderLeft: '3px solid #ef4444'
                                                    }}>
                                                        {record.diagnosis || 'Tidak ada diagnosis khusus yang dicatat.'}
                                                    </div>
                                                </div>

                                                {record.medications && record.medications.length > 0 && (
                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                                            Resep Obat
                                                        </h4>
                                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                            {record.medications.map((med, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    style={{
                                                                        fontSize: '0.78rem',
                                                                        background: 'rgba(16,185,129,0.06)',
                                                                        color: '#10b981',
                                                                        padding: '0.25rem 0.6rem',
                                                                        borderRadius: 'var(--radius-md)',
                                                                        fontWeight: 600,
                                                                        border: '1px solid rgba(16,185,129,0.12)'
                                                                    }}
                                                                >
                                                                    <Pill size={11} style={{ marginRight: '0.2rem', display: 'inline', verticalAlign: 'middle' }} />
                                                                    {med}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {record.notes && (
                                                    <div style={{
                                                        fontSize: '0.85rem',
                                                        color: 'var(--color-text-muted)',
                                                        background: 'var(--color-surface-alt)',
                                                        padding: '0.6rem 0.85rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        marginBottom: '1rem',
                                                        border: '1px solid var(--color-border)',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        "{record.notes.substring(0, 140)}{record.notes.length > 140 ? '...' : ''}"
                                                    </div>
                                                )}

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    borderTop: '1px solid var(--color-border)',
                                                    paddingTop: '0.85rem',
                                                    marginTop: '0.5rem'
                                                }}>
                                                    <button
                                                        onClick={() => setSelectedRecord(record)}
                                                        className="btn btn-outline btn-sm"
                                                        style={{
                                                            borderRadius: 'var(--radius-md)',
                                                            fontSize: '0.8rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <Eye size={14} />
                                                        Lihat Detail Rekam Medis
                                                    </button>
                                                    {userRole === 'admin' && (
                                                        <button
                                                            onClick={() => handleDeleteRecord(record.id)}
                                                            className="btn btn-sm"
                                                            style={{
                                                                borderRadius: 'var(--radius-md)',
                                                                fontSize: '0.8rem',
                                                                background: '#ef4444',
                                                                color: '#fff',
                                                                border: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.25rem',
                                                                padding: '0.4rem 0.75rem'
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '4rem 2rem',
                                    background: 'var(--color-surface-alt)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px dashed var(--color-border)'
                                }}>
                                    <FileText size={42} style={{ opacity: 0.3, margin: '0 auto 1rem', color: 'var(--color-primary)' }} />
                                    <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                        Belum ada rekam medis
                                    </h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
                                        Catatan riwayat pemeriksaan rekam medis akan muncul di sini setelah pemeriksaan selesai dilakukan oleh dokter.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Detail Modal (Doctor/Admin) */}
                    {selectedRecord && (
                        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', width: '90%' }}>
                                <div className="modal-header">
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                                        <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                                        Detail Rekam Medis
                                    </h3>
                                    <button className="modal-close" onClick={() => setSelectedRecord(null)}>
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.5rem' }}>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem',
                                        marginBottom: '1.5rem',
                                        borderBottom: '1px solid var(--color-border)',
                                        paddingBottom: '1.25rem'
                                    }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                                INFORMASI PASIEN
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selectedRecord.patient_name || 'N/A'}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                    Lahir: {formatDateOfBirth(selectedRecord.patient_dob)}
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                    Gender: {getGenderLabel(selectedRecord.patient_gender)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                                DOKTER PEMERIKSA
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selectedRecord.doctor_name || 'N/A'}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                                    {selectedRecord.doctor_specialization || 'Umum'}
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                                                    <Calendar size={12} /> {formatDate(selectedRecord.date)} ({selectedRecord.time})
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                            <Activity size={16} style={{ color: '#ef4444' }} />
                                            Diagnosis Utama
                                        </h4>
                                        <div style={{
                                            padding: '1rem',
                                            background: 'rgba(239, 68, 68, 0.03)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid rgba(239, 68, 68, 0.1)',
                                            color: 'var(--color-text)',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.5,
                                            fontWeight: 500
                                        }}>
                                            {selectedRecord.diagnosis || 'Tidak ada catatan diagnosis.'}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                            <Clipboard size={16} style={{ color: 'var(--color-primary)' }} />
                                            Tindakan / Perawatan (Treatment)
                                        </h4>
                                        <div style={{
                                            padding: '1rem',
                                            background: 'var(--color-surface-alt)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text)',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.5
                                        }}>
                                            {selectedRecord.treatment || 'Tidak ada tindakan medis khusus yang dicatat.'}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                            <Pill size={16} style={{ color: '#10b981' }} />
                                            Resep Obat (Medications)
                                        </h4>
                                        {selectedRecord.medications && selectedRecord.medications.length > 0 ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {selectedRecord.medications.map((med, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            background: 'rgba(16,185,129,0.08)',
                                                            color: '#10b981',
                                                            padding: '0.35rem 0.75rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            border: '1px solid rgba(16,185,129,0.15)'
                                                        }}
                                                    >
                                                        {med}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                Tidak ada resep obat yang dicatat.
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                            <Clock size={16} style={{ color: '#f59e0b' }} />
                                            Catatan Tambahan Dokter
                                        </h4>
                                        <div style={{
                                            padding: '1rem',
                                            background: 'var(--color-surface-alt)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text)',
                                            fontSize: '0.92rem',
                                            lineHeight: 1.5
                                        }}>
                                            {selectedRecord.notes || 'Tidak ada catatan tambahan.'}
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem' }}>
                                    {userRole === 'admin' && (
                                        <button
                                            className="btn"
                                            onClick={() => handleDeleteRecord(selectedRecord.id)}
                                            style={{
                                                background: '#ef4444',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                flex: '1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.25rem'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Hapus Rekam Medis
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setSelectedRecord(null)}
                                        style={{ borderRadius: 'var(--radius-md)', flex: userRole === 'admin' ? '1' : 'none', width: userRole === 'admin' ? 'auto' : '100%' }}
                                    >
                                        Tutup Catatan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </MainLayout>
    );
}

// ── Helper component (dipakai modal Patient) ─────────────────────
function InfoBlock({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
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