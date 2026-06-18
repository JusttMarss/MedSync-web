import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import type { Doctor } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DoctorsProps {
    doctors: Doctor[];
    specializations: string[];
    filters: {
        search?: string;
        specialization?: string;
    };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

// ─── Icon Components ──────────────────────────────────────────────────────────

function IconSearch() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function IconPhone() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

function IconEmpty() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M8 11h6" />
        </svg>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DoctorCardProps {
    doctor: Doctor;
}

function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <div className="doctor-card">
            {/* Header */}
            <div className="doctor-card-header">
                <div className="doctor-avatar">
                   {doctor.avatar_url ? <img src={doctor.avatar_url} alt={doctor.name} /> : getInitials(doctor.name ?? '')}
                </div>
                <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <span className="doctor-specialization">
                        {doctor.specialization}
                    </span>
                </div>
            </div>

            {/* Bio */}
            {doctor.bio && (
                <p className="doctor-bio">{doctor.bio}</p>
            )}

            {/* Contact Info */}
            {(doctor.email || doctor.phone) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.75rem' }}>
                    {doctor.email && (
                        <div className="doctor-contact">
                            <IconMail />
                            <span>{doctor.email}</span>
                        </div>
                    )}
                    {doctor.phone && (
                        <div className="doctor-contact">
                            <IconPhone />
                            <span>{doctor.phone}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="doctor-card-footer">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => router.visit(`/login`)}
                >
                    Buat Janji
                </button>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => router.visit(`/doctors/${doctor.id}`)}
                >
                    Lihat Profil
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Doctors({ doctors, specializations, filters }: DoctorsProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [specialization, setSpecialization] = useState(filters.specialization ?? '');

    const hasActiveFilters = Boolean(filters.search || filters.specialization);

    // Send filter params to server, strip empty values
    function applyFilters(overrides: { search?: string; specialization?: string } = {}) {
        const params = {
            search: overrides.search ?? search,
            specialization: overrides.specialization ?? specialization,
        };
        const clean = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== '')
        );
        router.get('/doctors', clean, { preserveState: true, preserveScroll: true });
    }

    function handleSpecializationChange(value: string) {
        setSpecialization(value);
        applyFilters({ specialization: value });
    }

    function handleReset() {
        setSearch('');
        setSpecialization('');
        router.get('/doctors', {}, { preserveState: true });
    }

    return (
        <MainLayout>
            <Head title="Daftar Dokter" />

            <section className="section page-enter">

                {/* ── Page Header ── */}
                <div className="section-header split-header" style={{ marginBottom: '1.75rem' , textAlign: 'left' }}>
                    <div>
                        {/* <span className="eyebrow">🩺 Tenaga Medis</span> */}
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-text)' }}>
                            Daftar Dokter
                        </h2>
                        <p className="text-secondary" style={{ marginTop: '0.35rem', fontSize: '0.9rem' }}>
                            Temukan dokter spesialis yang tepat untuk kebutuhan kesehatan Anda.
                        </p>
                    </div>

                    {/* <span className="badge badge-available" style={{ alignSelf: 'flex-start' }}>
                        {doctors.length} dokter ditemukan
                    </span> */}
                </div>

                {/* ── Filter Bar ── */}
                <div className="filters-bar">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Cari nama atau spesialisasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    />

                    <select
                        className="filter-select"
                        value={specialization}
                        onChange={(e) => handleSpecializationChange(e.target.value)}
                    >
                        <option value="">Semua Spesialisasi</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => applyFilters()}>
                        <IconSearch />
                        Cari
                    </button>

                    {hasActiveFilters && (
                        <button className="btn btn-outline" onClick={handleReset}>
                            ✕ Reset
                        </button>
                    )}
                </div>

                {/* ── Doctor Grid ── */}
                {doctors.length > 0 ? (
                    <div className="doctors-grid">
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    /* ── Empty State ── */
                    <div className="empty-state">
                        <IconEmpty />
                        <h3>Tidak ada dokter ditemukan</h3>
                        <p>
                            {hasActiveFilters
                                ? 'Coba ubah kata kunci atau filter spesialisasi Anda.'
                                : 'Belum ada data dokter yang tersedia saat ini.'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                className="btn btn-outline"
                                onClick={handleReset}
                                style={{ marginTop: '1rem' }}
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                )}

            </section>
        </MainLayout>
    );
}