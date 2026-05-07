import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import type { Doctor, Stats } from '../types';

interface HomeProps {
    stats: Stats;
    featuredDoctors: Doctor[];
}

export default function Home({ stats, featuredDoctors }: HomeProps) {
    return (
        <MainLayout>
            <Head title="Beranda" />

            {/* ── Hero Section ───────────────────────────── */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Kesehatan Anda, Prioritas Kami</h1>
                    <p>
                        Platform layanan kesehatan digital terpercaya. Temukan dokter spesialis,
                        buat janji temu, dan kelola rekam medis Anda dengan mudah.
                    </p>
                    <div className="hero-actions">
                        <Link href="/doctors" className="btn btn-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Cari Dokter
                        </Link>
                        <a href="#features" className="btn btn-outline">
                            Pelajari Selengkapnya
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Stats Section ──────────────────────────── */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🩺</div>
                        <div className="stat-number">{stats.doctors}</div>
                        <div className="stat-label">Dokter Aktif</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-number">{stats.patients}</div>
                        <div className="stat-label">Pasien Terdaftar</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-number">{stats.appointments}</div>
                        <div className="stat-label">Total Appointment</div>
                    </div>
                </div>
            </section>

            {/* ── Featured Doctors ────────────────────────── */}
            {featuredDoctors.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h2>Dokter Pilihan</h2>
                        <p>Temui dokter spesialis kami yang berpengalaman dan terpercaya.</p>
                    </div>
                    <div className="doctors-grid">
                        {featuredDoctors.map((doctor) => (
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
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Link href="/doctors" className="btn btn-outline">
                            Lihat Semua Dokter →
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Features Section ───────────────────────── */}
            <section className="section" id="features">
                <div className="section-header">
                    <h2>Layanan Kami</h2>
                    <p>Solusi kesehatan digital lengkap untuk Anda.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Cari Dokter</h3>
                        <p>Temukan dokter spesialis yang sesuai dengan kebutuhan kesehatan Anda.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📅</div>
                        <h3>Buat Janji Temu</h3>
                        <p>Atur jadwal konsultasi dengan dokter pilihan Anda secara online.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📄</div>
                        <h3>Rekam Medis</h3>
                        <p>Akses riwayat kesehatan dan rekam medis Anda kapan saja, di mana saja.</p>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
