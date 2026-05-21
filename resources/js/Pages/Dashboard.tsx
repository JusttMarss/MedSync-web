import MainLayout from '../Layouts/MainLayout';
import { Head } from '@inertiajs/react';

interface DashboardProps {
    stats: { doctors: number; patients: number; appointments: number };
    upcoming?: {
        doctor: string;
        specialization: string;
        date: string;
        time: string;
    } | null;
}

export default function Dashboard({ stats, upcoming }: DashboardProps) {
    return (
        <MainLayout>
            <Head title="Dashboard" />

            <section className="section dashboard-overview">
                <div className="dashboard-hero">
                    <div>
                        <p className="eyebrow">Good morning</p>
                        <h2>Here is an overview of your health schedule.</h2>
                    </div>
                    <button className="btn btn-primary">Start Next Appointment</button>
                </div>

                <div className="stats-grid dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon">🩺</div>
                        <div className="stat-number">{stats.doctors}</div>
                        <div className="stat-label">Total Doctors</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-number">{stats.appointments}</div>
                        <div className="stat-label">Total Appointments</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-number">{upcoming ? '1' : '0'}</div>
                        <div className="stat-label">Upcoming</div>
                    </div>
                </div>

                <div className="section-heading">
                    <h3>Next Appointment</h3>
                    <p>Quick details for your next scheduled visit.</p>
                </div>

                {upcoming ? (
                    <div className="feature-card appointment-summary-card">
                        <div className="appointment-summary-meta">
                            <div>
                                <h3>{upcoming.doctor}</h3>
                                <p className="text-secondary">{upcoming.specialization}</p>
                            </div>
                            <div className="appointment-details">
                                <div>
                                    <span className="label">Date</span>
                                    <p>{upcoming.date}</p>
                                </div>
                                <div>
                                    <span className="label">Time</span>
                                    <p>{upcoming.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="feature-card appointment-summary-card">
                        <h3>No upcoming appointments yet</h3>
                        <p className="text-secondary">Book a new appointment to get started.</p>
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
