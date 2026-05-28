import { Link } from '@inertiajs/react';
import type { Doctor } from '../types';

interface DoctorListSectionProps {
    doctors: Doctor[];
}

export default function DoctorListSection({ doctors }: DoctorListSectionProps) {
    return (
        <section className="section">
            <div className="section-header">
                <h2>Find your Doctor</h2>
                <p>Browse our directory of specialized medical professionals. Filter by specialization and availability to find the right care for your needs today.</p>
            </div>
            <div className="doctors-grid">
                {doctors.map((doctor) => (
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
    );
}
