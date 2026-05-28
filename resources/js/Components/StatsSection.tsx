import type { Stats } from '../types';

interface StatsSectionProps {
    stats: Stats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
    return (
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
    );
}
