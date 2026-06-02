// import MainLayout from '../Layouts/MainLayout';
// import { Head } from '@inertiajs/react';

// interface DashboardProps {
//     stats: { doctors: number; patients: number; appointments: number };
//     upcoming?: {
//         doctor: string;
//         specialization: string;
//         date: string;
//         time: string;
//     } | null;
// }

// export default function Dashboard({ stats, upcoming }: DashboardProps) {
//     return (
//         <MainLayout>
//             <Head title="Dashboard" />

//             <section className="section dashboard-overview">
//                 <div className="dashboard-hero">
//                     <div>
//                         <p className="eyebrow">Good morning</p>
//                         <h2>Here is an overview of your health schedule.</h2>
//                     </div>
//                     <button className="btn btn-primary">Start Next Appointment</button>
//                 </div>

//                 <div className="stats-grid dashboard-stats">
//                     <div className="stat-card">
//                         <div className="stat-icon">🩺</div>
//                         <div className="stat-number">{stats.doctors}</div>
//                         <div className="stat-label">Total Doctors</div>
//                     </div>
//                     <div className="stat-card">
//                         <div className="stat-icon">📅</div>
//                         <div className="stat-number">{stats.appointments}</div>
//                         <div className="stat-label">Total Appointments</div>
//                     </div>
//                     <div className="stat-card">
//                         <div className="stat-icon">⏱️</div>
//                         <div className="stat-number">{upcoming ? '1' : '0'}</div>
//                         <div className="stat-label">Upcoming</div>
//                     </div>
//                 </div>

//                 <div className="section-heading">
//                     <h3>Next Appointment</h3>
//                     <p>Quick details for your next scheduled visit.</p>
//                 </div>

//                 {upcoming ? (
//                     <div className="feature-card appointment-summary-card">
//                         <div className="appointment-summary-meta">
//                             <div>
//                                 <h3>{upcoming.doctor}</h3>
//                                 <p className="text-secondary">{upcoming.specialization}</p>
//                             </div>
//                             <div className="appointment-details">
//                                 <div>
//                                     <span className="label">Date</span>
//                                     <p>{upcoming.date}</p>
//                                 </div>
//                                 <div>
//                                     <span className="label">Time</span>
//                                     <p>{upcoming.time}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="feature-card appointment-summary-card">
//                         <h3>No upcoming appointments yet</h3>
//                         <p className="text-secondary">Book a new appointment to get started.</p>
//                     </div>
//                 )}
//             </section>
//         </MainLayout>
//     );
// }


import MainLayout from '../Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        doctors: number;
        patients: number;
        appointments: number;
    };
    upcoming?: {
        id?: number;
        doctor: string;
        specialization: string;
        date: string;
        time: string;
    } | null;
    userName?: string;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function Dashboard({ stats, upcoming, userName }: DashboardProps) {
    const greeting = getGreeting();

    function handleStartAppointment() {
        if (upcoming?.id) {
            router.visit(`/appointments/${upcoming.id}`);
        } else {
            router.visit('/appointments/create');
        }
    }

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <section className="section page-enter">
                {/* ── Hero Banner ── */}
                <div className="home-hero" style={{ marginBottom: '2rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div>
                            <span className="eyebrow">
                                <span>🌤</span>
                                {greeting}{userName ? `, ${userName.split(' ')[0]}` : ''}
                            </span>
                            <h2
                                style={{
                                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                    fontWeight: 800,
                                    lineHeight: 1.15,
                                    color: 'var(--color-text)',
                                    marginTop: '0.5rem',
                                    maxWidth: '520px',
                                }}
                            >
                                Here is an overview of your health schedule.
                            </h2>
                            <p
                                style={{
                                    color: 'var(--color-text-muted)',
                                    marginTop: '0.5rem',
                                    fontSize: '0.95rem',
                                }}
                            >
                                Track your doctors, appointments, and upcoming visits in one place.
                            </p>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleStartAppointment}
                            style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}
                        >
                            <span>▶</span>
                            {upcoming ? 'Start Next Appointment' : 'Book Appointment'}
                        </button>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                    <div className="stat-card">
                        <div className="stat-icon">🩺</div>
                        <div className="stat-number">{stats.doctors}</div>
                        <div className="stat-label">Total Doctors</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-number">{stats.patients}</div>
                        <div className="stat-label">Total Patients</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-number">{stats.appointments}</div>
                        <div className="stat-label">Appointments</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-number">{upcoming ? 1 : 0}</div>
                        <div className="stat-label">Upcoming</div>
                    </div>
                </div>

                {/* ── Next Appointment ── */}
                <div className="section-header" style={{ marginBottom: '1.25rem' }}>
                    <div className="split-header">
                        <div>
                            <h3
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text)',
                                }}
                            >
                                Next Appointment
                            </h3>
                            <p
                                style={{
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.9rem',
                                    marginTop: '0.2rem',
                                }}
                            >
                                Quick details for your next scheduled visit.
                            </p>
                        </div>

                        <Link href="/appointments" className="btn btn-outline btn-sm">
                            View All Appointments
                        </Link>
                    </div>
                </div>

                {upcoming ? (
                    <div className="feature-card" style={{ maxWidth: '640px' }}>
                        {/* Doctor info */}
                        <div className="doctor-card-header">
                            <div className="doctor-avatar">
                                {getInitials(upcoming.doctor)}
                            </div>
                            <div>
                                <h3
                                    style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--color-text)',
                                    }}
                                >
                                    {upcoming.doctor}
                                </h3>
                                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                    {upcoming.specialization}
                                </p>
                            </div>
                            <span
                                className="status-chip status-scheduled"
                                style={{ marginLeft: 'auto' }}
                            >
                                Scheduled
                            </span>
                        </div>

                        {/* Date / Time */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                borderTop: '1px solid var(--color-border)',
                                paddingTop: '1rem',
                                marginTop: '0.25rem',
                            }}
                        >
                            <div>
                                <span
                                    style={{
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '0.3rem',
                                    }}
                                >
                                    📆 Date
                                </span>
                                <p
                                    style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: 'var(--color-text)',
                                    }}
                                >
                                    {upcoming.date}
                                </p>
                            </div>
                            <div>
                                <span
                                    style={{
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '0.3rem',
                                    }}
                                >
                                    🕐 Time
                                </span>
                                <p
                                    style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: 'var(--color-text)',
                                    }}
                                >
                                    {upcoming.time}
                                </p>
                            </div>
                        </div>

                        {/* Action */}
                        <div style={{ marginTop: '1.25rem' }}>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleStartAppointment}
                            >
                                Start Appointment
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="feature-card"
                        style={{
                            maxWidth: '640px',
                            textAlign: 'center',
                            padding: '2.5rem 2rem',
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                        <h3
                            style={{
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: 'var(--color-text)',
                                marginBottom: '0.4rem',
                            }}
                        >
                            No upcoming appointments
                        </h3>
                        <p
                            className="text-secondary"
                            style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}
                        >
                            Book a new appointment with one of our doctors to get started.
                        </p>
                        <Link href="/appointments/create" className="btn btn-primary btn-sm">
                            Book an Appointment
                        </Link>
                    </div>
                )}
            </section>
        </MainLayout>
    );
}