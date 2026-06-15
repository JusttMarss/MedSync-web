import { useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    FileText, Search, Calendar, User, Activity, 
    Pill, Clipboard, X, Clock, Trash2, ArrowLeft, ChevronRight, Eye 
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

export default function MedicalRecords({ records, userName, userRole }: MedicalRecordsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecordData | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');

    // Handler to delete a record (Admin only)
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

    // Helper functions
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

    // 1. Group records by patient for Doctor/Admin Patient Grid
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

    // Filtered list of patients based on search
    const filteredPatients = uniquePatients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Filter records when viewing a specific patient (Doctor/Admin) or for Patient role
    const activeRecords = userRole === 'patient' 
        ? records 
        : (selectedPatientId ? (patientsMap.get(selectedPatientId)?.records || []) : []);

    const filteredRecords = activeRecords.filter((record) => {
        const diagnosis = record.diagnosis || '';
        const doctorName = record.doctor_name || '';
        const patientName = record.patient_name || '';

        const matchesSearch = 
            diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patientName.toLowerCase().includes(searchTerm.toLowerCase());

        // Date filter
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

    return (
        <MainLayout>
            <Head title="Rekam Medis - MedSync Pro" />

            <section className="section page-enter">
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
                                {userRole === 'patient' ? 'Riwayat Medis Saya' : 'Dashboard Pasien & Rekam Medis'}
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                {userRole === 'patient' 
                                    ? 'Akses catatan medis, diagnosis, dan resep obat dari kunjungan pemeriksaan Anda.'
                                    : 'Cari pasien dan kelola riwayat pemeriksaan rekam medis mereka.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* VIEW 1: Doctor/Admin - Patient Grid (When no patient is selected) */}
                {userRole !== 'patient' && !selectedPatientId && (
                    <>
                        {/* Search Patient Row */}
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

                        {/* Patient Grid */}
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
                                            setSearchTerm(''); // clear search for the records view
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'none';
                                        }}
                                    >
                                        {/* Colored Accent Top */}
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

                {/* VIEW 2: Patient's Timeline/List View (For Patient role or Doctor/Admin looking at a Patient) */}
                {(userRole === 'patient' || selectedPatientId) && (
                    <div>
                        {/* Back navigation & Header details for Doctor/Admin */}
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

                        {/* Search & Filters Inside Timeline View */}
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
                                    placeholder={userRole === 'patient' ? "Cari diagnosis atau dokter..." : "Cari diagnosis..."}
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

                        {/* Beautiful Timeline View for Records (Instead of Ugly Table) */}
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
                                        {/* Circular Indicator Dot */}
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

                                        {/* Timeline Card */}
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
                                            {/* Card Top Info */}
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
                                                        {userRole === 'patient' ? 'Dokter Pemeriksa' : 'Pasien'}
                                                    </span>
                                                    <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.92rem' }}>
                                                        {userRole === 'patient' ? (record.doctor_name || 'N/A') : (record.patient_name || 'N/A')}
                                                    </span>
                                                    {userRole === 'patient' && (
                                                        <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', display: 'block', fontWeight: 600 }}>
                                                            {record.doctor_specialization || 'Umum'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Diagnosis Banner */}
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

                                            {/* Medications list */}
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

                                            {/* Notes Preview if available */}
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

                                            {/* Card Actions Row */}
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

                {/* Detail Modal */}
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
                                
                                {/* Info Cards */}
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

                                {/* Diagnosis */}
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

                                {/* Treatment / Tindakan */}
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

                                {/* Medications */}
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

                                {/* Doctor Notes */}
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
        </MainLayout>
    );
}
