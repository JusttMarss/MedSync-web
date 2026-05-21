import { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import type { SharedProps } from '../types';

interface AppointmentsProps {
    appointments: any[];
    doctors: { id: number; name: string }[];
    timeSlots: any[];
}

export default function Appointments({ appointments, doctors, timeSlots }: AppointmentsProps) {
    const { props } = usePage<SharedProps>();
    const [doctorId, setDoctorId] = useState(doctors[0]?.id?.toString() || '');
    const [timeSlotId, setTimeSlotId] = useState(timeSlots[0]?.id?.toString() || '');
    const [notes, setNotes] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Appointments');

    const filteredAppointments = useMemo(
        () => appointments.filter((appointment) => {
            const matchesSearch = appointment.doctor.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'All Appointments' || appointment.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        }),
        [appointments, search, statusFilter]
    );

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post('/appointments', {
            doctor_id: doctorId,
            time_slot_id: timeSlotId,
            notes,
        });
    }

    return (
        <MainLayout>
            <Head title="Appointments" />

            <section className="section page-section">
                <div className="section-header split-header">
                    <div>
                        <h2>Appointments</h2>
                        <p>Manage your history, filter by doctor, and book your next appointment.</p>
                    </div>
                    <button className="btn btn-primary">Book New Appointment</button>
                </div>

                <div className="page-grid">
                    <div className="appointments-table-card">
                        <div className="table-actions">
                            <input
                                type="search"
                                placeholder="Search doctor by name..."
                                className="filter-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option>All Appointments</option>
                                <option>scheduled</option>
                                <option>completed</option>
                                <option>cancelled</option>
                            </select>
                        </div>

                        <div className="feature-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Doctor</th>
                                        <th>Specialization</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.length > 0 ? (
                                        filteredAppointments.map((appointment) => (
                                            <tr key={appointment.id} className="table-row-hover">
                                                <td>{appointment.date} • {appointment.time}</td>
                                                <td>{appointment.doctor}</td>
                                                <td>{appointment.specialization}</td>
                                                <td>
                                                    <span className={`status-chip status-${appointment.status}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="text-primary underline">Details</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="empty-table">No appointments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <aside className="booking-panel feature-card">
                        <div className="panel-header">
                            <h3>Book an Appointment</h3>
                            <p>Choose doctor, select slot and confirm.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="form-grid">
                            <label>
                                Doctor
                                <select className="filter-select" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                                    {doctors.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Time Slot
                                <select className="filter-select" value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value)}>
                                    {timeSlots.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.date} • {t.start_time} - {t.end_time}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Notes
                                <textarea className="filter-input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
                            </label>

                            <button className="btn btn-primary" type="submit">Confirm Booking</button>
                        </form>
                    </aside>
                </div>
            </section>
        </MainLayout>
    );
}
