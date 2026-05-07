import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import type { Doctor } from '../types';

interface DoctorsProps {
    doctors: Doctor[];
    specializations: string[];
    filters: {
        search?: string;
        specialization?: string;
    };
}

export default function Doctors({ doctors, specializations, filters }: DoctorsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [specialization, setSpecialization] = useState(filters.specialization || '');

    function handleSearch() {
        router.get(
            '/doctors',
            {
                ...(search && { search }),
                ...(specialization && { specialization }),
            },
            { preserveState: true, preserveScroll: true }
        );
    }

    function handleReset() {
        setSearch('');
        setSpecialization('');
        router.get('/doctors', {}, { preserveState: true });
    }

    return (
        <MainLayout>
            <Head title="Daftar Dokter" />

            <section className="section">
                <div className="section-header">
                    <h2>Daftar Dokter</h2>
                    <p>Temukan dokter spesialis yang tepat untuk kebutuhan kesehatan Anda.</p>
                </div>

                {/* ── Filter Bar ──────────────────────────── */}
                <div className="filters-bar">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Cari nama dokter atau spesialisasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />

                    <select
                        className="filter-select"
                        value={specialization}
                        onChange={(e) => {
                            setSpecialization(e.target.value);
                            // Auto-search on select change
                            router.get(
                                '/doctors',
                                {
                                    ...(search && { search }),
                                    ...(e.target.value && { specialization: e.target.value }),
                                },
                                { preserveState: true, preserveScroll: true }
                            );
                        }}
                    >
                        <option value="">Semua Spesialisasi</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                                {spec}
                            </option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={handleSearch}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        Cari
                    </button>

                    {(filters.search || filters.specialization) && (
                        <button className="btn btn-outline" onClick={handleReset}>
                            Reset
                        </button>
                    )}
                </div>

                {/* ── Doctor Cards Grid ───────────────────── */}
                {doctors.length > 0 ? (
                    <div className="doctors-grid">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="doctor-card">
                                <div className="doctor-card-header">
                                    <div className="doctor-avatar">
                                        {doctor.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="doctor-info">
                                        <h3>{doctor.name}</h3>
                                        <span className="doctor-specialization">
                                            {doctor.specialization}
                                        </span>
                                    </div>
                                </div>

                                {doctor.bio && (
                                    <p className="doctor-bio">{doctor.bio}</p>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {doctor.email && (
                                        <div className="doctor-contact">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                            {doctor.email}
                                        </div>
                                    )}
                                    {doctor.phone && (
                                        <div className="doctor-contact">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                            {doctor.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ── Empty State ──────────────────────── */
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                            <path d="M8 11h6" />
                        </svg>
                        <h3>Tidak ada dokter ditemukan</h3>
                        <p>Coba ubah kata kunci pencarian atau filter spesialisasi Anda.</p>
                        <button className="btn btn-outline" onClick={handleReset} style={{ marginTop: '1rem' }}>
                            Reset Filter
                        </button>
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
