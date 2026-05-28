import { Link } from '@inertiajs/react';

export default function HeroSection() {
    return (
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
    );
}
