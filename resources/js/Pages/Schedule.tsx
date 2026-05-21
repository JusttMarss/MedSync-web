import MainLayout from '../Layouts/MainLayout';
import { Head } from '@inertiajs/react';

interface ScheduleProps {
    doctors: any[];
}

export default function Schedule({ doctors }: ScheduleProps) {
    return (
        <MainLayout>
            <Head title="Schedule" />

            <section className="section page-section">
                <div className="section-header split-header">
                    <div>
                        <h2>Schedule</h2>
                        <p>Browse doctor availability and book the best time for your visit.</p>
                    </div>
                    <div className="filter-row">
                        <input type="search" className="filter-input" placeholder="Search doctor by name..." />
                        <select className="filter-select">
                            <option>All Specialties</option>
                            <option>Cardiology</option>
                            <option>Pediatrics</option>
                            <option>General Practice</option>
                        </select>
                        <button className="btn btn-primary">Apply Filters</button>
                    </div>
                </div>

                <div className="schedule-grid">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="doctor-card schedule-card">
                            <div className="doctor-card-header">
                                <div className="doctor-avatar">{doctor.name?.charAt(0)}</div>
                                <div>
                                    <h3>{doctor.name}</h3>
                                    <p className="text-secondary">Specialty</p>
                                </div>
                            </div>
                            <div className="doctor-card-body">
                                {doctor.timeSlots.length > 0 ? (
                                    doctor.timeSlots.map((slot: any) => (
                                        <div key={slot.id} className="time-slot-row">
                                            <div>{slot.date} • {slot.start_time} - {slot.end_time}</div>
                                            <span className={slot.is_booked ? 'status-chip status-cancelled' : 'status-chip status-scheduled'}>
                                                {slot.is_booked ? 'Booked' : 'Available'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-secondary">No timeslots available.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
