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
            <Head title="Home" />

            <section className="home-hero">
                <div className="hero-grid">
                    <div className="hero-copy">
                        <span className="eyebrow">Top Rated Clinic 2024</span>
                        <h1>Your Health, Simplified.</h1>
                        <p>Experience modern healthcare with seamless appointment booking, expert specialists, and instant access to your medical records all in one place.</p>

                        <div className="hero-actions">
                            <Link href="/appointments" className="btn btn-primary">
                                Book Appointment
                            </Link>
                            <Link href="/doctors" className="btn btn-outline">
                                Find a Doctor
                            </Link>
                        </div>

                        <div className="hero-trust">
                            <div className="avatar-stack">
                                <div className="avatar">A</div>
                                <div className="avatar">B</div>
                                <div className="avatar">C</div>
                            </div>
                            <span>Trusted by 10,000+ patients</span>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-card">
                            <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80" alt="Doctor with tablet" className="hero-image" />
                            <div className="hero-badge">
                                <span className="material-symbols-outlined">calendar_month</span>
                                <div>
                                    <div className="badge-label">Next Available</div>
                                    <div className="badge-value">Today, 2:30 PM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section stats-section">
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

            <section className="section">
                <div className="section-header">
                    <h2>Find your Doctor</h2>
                    <p>Browse our directory of specialized medical professionals. Filter by specialization and availability to find the right care for your needs today.</p>
                </div>
                <div className="doctors-grid">
                    {featuredDoctors.map((doctor) => (
                        <div key={doctor.id} className="doctor-card alt">
                            <div className="doctor-card-header">
                                <div className="doctor-avatar">{doctor.name?.charAt(0)}</div>
                                <div>
                                    <h3>{doctor.name}</h3>
                                    <p className="text-secondary">{doctor.specialization}</p>
                                </div>
                            </div>
                            <div className="doctor-card-body">
                                <p>{doctor.bio || 'Experienced provider ready to support your care.'}</p>
                            </div>
                            <div className="doctor-card-footer">
                                <span className="badge badge-available">Available Today</span>
                                <Link href="/appointments" className="btn btn-primary btn-sm">Book Appointment</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
