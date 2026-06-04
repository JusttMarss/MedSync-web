import { useMemo, useState, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import type { SharedProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Calendar, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle,
    Sparkles, BookOpen, ChevronRight, ChevronDown, X, CalendarCheck, HelpCircle
} from 'lucide-react';

interface Doctor {
    id: number;
    name: string;
    specialization: string;
}

interface AppointmentsProps {
    appointments: any[];
    doctors: Doctor[];
    timeSlots: any[];
}

export default function Appointments({ appointments, doctors, timeSlots }: AppointmentsProps) {
    const { props } = usePage<SharedProps>();
    const [doctorId, setDoctorId] = useState(doctors[0]?.id?.toString() || '');
    const [timeSlotId, setTimeSlotId] = useState('');
    const [notes, setNotes] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Appointments');
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close doctor dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDoctorDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get selected doctor object details for the visual preview card
    const selectedDoctorObj = useMemo(() => {
        return doctors.find(d => d.id.toString() === doctorId);
    }, [doctors, doctorId]);

    // Filter available slots for the selected doctor
    const filteredTimeSlots = useMemo(() => {
        if (!doctorId) return [];
        return timeSlots.filter(t => t.doctor_id.toString() === doctorId && !t.is_booked);
    }, [timeSlots, doctorId]);

    // Automatically select the first available slot when doctor changes
    useEffect(() => {
        if (filteredTimeSlots.length > 0) {
            setTimeSlotId(filteredTimeSlots[0].id.toString());
        } else {
            setTimeSlotId('');
        }
    }, [filteredTimeSlots]);

    // Group slots by date for a visual schedule experience
    const groupedSlots = useMemo(() => {
        const groups: { [date: string]: typeof timeSlots } = {};
        filteredTimeSlots.forEach((slot) => {
            const dateStr = slot.date;
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(slot);
        });
        return groups;
    }, [filteredTimeSlots]);

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
        if (!timeSlotId) return;
        router.post('/appointments', {
            doctor_id: doctorId,
            time_slot_id: timeSlotId,
            notes,
        }, {
            onSuccess: () => {
                setNotes('');
            }
        });
    }

    function formatFriendlyDate(dateStr: string) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    return (
        <MainLayout>
            <Head title="Appointments" />

            <section className="section page-section" style={{ padding: '1rem 0 3rem' }}>
                <div className="section-header split-header" style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
                    <div style={{ textAlign: 'left' }}>
                        <div className="eyebrow">
                            Book Your Appointment Now
                        </div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Appointments
                        </h2>
                        <p style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)' }}>
                            Manage your appointment history, view prescription notes, or schedule your next consultation instantly.
                        </p>
                    </div>
                </div>

                <div className="page-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>Appointment History</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>View your active, completed, or cancelled consultation history.</p>
                        </div>

                        <div className="table-actions" style={{ marginBottom: '0.5rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="search"
                                    placeholder="Search doctor by name..."
                                    className="filter-input"
                                    style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-md)' }}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div>
                                <select
                                    className="filter-select"
                                    style={{ borderRadius: 'var(--radius-md)', minWidth: '180px' }}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option>All Appointments</option>
                                    <option>scheduled</option>
                                    <option>completed</option>
                                    <option>cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Beautiful Vertical Feed of Cards instead of a squeezed table */}
                        <div className="appointment-list">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((appointment) => (
                                    <div key={appointment.id} className="appointment-card">
                                        <div className="appointment-card-doctor">
                                            <div className="appointment-card-avatar">
                                                {appointment.doctor.charAt(0)}
                                            </div>
                                            <div className="appointment-card-info">
                                                <span className="appointment-card-name">{appointment.doctor}</span>
                                                <span className="appointment-card-spec">{appointment.specialization}</span>
                                            </div>
                                        </div>

                                        <div className="appointment-card-time">
                                            <div className="appointment-card-date-item">
                                                <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                                                {appointment.date}
                                            </div>
                                            <div className="appointment-card-time-item">
                                                <Clock size={12} style={{ color: 'var(--color-text-muted)' }} />
                                                {appointment.time}
                                            </div>
                                        </div>

                                        <div>
                                            <span className={`status-chip status-${appointment.status}`} style={{ textTransform: 'capitalize' }}>
                                                <span style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: appointment.status === 'completed' ? '#15803d' : appointment.status === 'cancelled' ? '#b91c1c' : '#0b7285',
                                                    marginRight: '0.5rem',
                                                    display: 'inline-block'
                                                }}></span>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        <div>
                                            <button
                                                onClick={() => setSelectedAppointment(appointment)}
                                                className="btn btn-outline btn-sm"
                                                style={{ borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                            >
                                                Details <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                        <HelpCircle size={40} style={{ opacity: 0.3, color: 'var(--color-primary)' }} />
                                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>No appointments found.</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Try adjusting your search query or filter settings.</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="booking-panel">
                        <div className="panel-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CalendarCheck size={20} style={{ color: 'var(--color-primary)' }} />
                                <h3>Book Consultation</h3>
                            </div>
                            <p>Select your specialized doctor and secure an available time slot.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600 }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>Doctor</span>
                                <div className="custom-doctor-dropdown" ref={dropdownRef}>
                                    {/* Trigger Button */}
                                    <button
                                        type="button"
                                        className="doctor-dropdown-trigger"
                                        onClick={() => setDoctorDropdownOpen(!doctorDropdownOpen)}
                                    >
                                        {selectedDoctorObj ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                                                <div className="doctor-dropdown-avatar">
                                                    {selectedDoctorObj.name.charAt(0)}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', textAlign: 'left', minWidth: 0 }}>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {selectedDoctorObj.name}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                                        {selectedDoctorObj.specialization}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--color-text-muted)' }}>Select a doctor...</span>
                                        )}
                                        <ChevronDown
                                            size={18}
                                            style={{
                                                color: 'var(--color-text-muted)',
                                                flexShrink: 0,
                                                transition: 'transform 0.25s ease',
                                                transform: doctorDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}
                                        />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {doctorDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                                className="doctor-dropdown-menu"
                                            >
                                                {doctors.map((d) => (
                                                    <div
                                                        key={d.id}
                                                        className={`doctor-dropdown-item ${doctorId === d.id.toString() ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setDoctorId(d.id.toString());
                                                            setDoctorDropdownOpen(false);
                                                        }}
                                                    >
                                                        <div className="doctor-dropdown-item-avatar">
                                                            {d.name.charAt(0)}
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1, minWidth: 0 }}>
                                                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {d.name}
                                                            </span>
                                                            <span className="doctor-dropdown-item-spec">
                                                                {d.specialization}
                                                            </span>
                                                        </div>
                                                        {doctorId === d.id.toString() && (
                                                            <CheckCircle2 size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                                        )}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600 }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>Available Time Slots</span>

                                {filteredTimeSlots.length > 0 ? (
                                    <div style={{ position: 'relative' }}>
                                        <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <select
                                            className="filter-input"
                                            style={{ paddingLeft: '2.75rem', pr: '2.5rem', borderRadius: 'var(--radius-md)', appearance: 'none', cursor: 'pointer', height: '2.9rem' }}
                                            value={timeSlotId}
                                            onChange={(e) => setTimeSlotId(e.target.value)}
                                        >
                                            <option value="" disabled>Select a time slot...</option>
                                            {filteredTimeSlots.map((slot) => (
                                                <option key={slot.id} value={slot.id.toString()}>
                                                    {formatFriendlyDate(slot.date)} • {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                                    </div>
                                ) : (
                                    <div className="empty-slots-msg">
                                        <AlertCircle size={18} style={{ margin: '0 auto 0.5rem', color: 'var(--color-text-muted)' }} />
                                        No time slots available for this doctor right now.
                                    </div>
                                )}
                            </div>

                            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600 }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>Symptoms or Notes (Optional)</span>
                                <div style={{ position: 'relative' }}>
                                    <FileText size={18} style={{ position: 'absolute', left: '1rem', top: '1.1rem', color: 'var(--color-text-muted)' }} />
                                    <textarea
                                        className="filter-input"
                                        rows={3}
                                        style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-md)' }}
                                        placeholder="Briefly describe your symptoms or specific request..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </label>

                            <button
                                className="btn btn-primary"
                                type="submit"
                                style={{ width: '100%', borderRadius: 'var(--radius-md)', padding: '0.95rem', marginTop: '0.5rem' }}
                                disabled={!timeSlotId}
                            >
                                Confirm Appointment
                            </button>
                        </form>
                    </aside>
                </div>
            </section>

            {/* Premium Details Modal */}
            <AnimatePresence>
                {selectedAppointment && (
                    <div className="details-modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                            className="details-modal"
                        >
                            <div className="details-modal-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                                    <h3>Appointment Details</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setSelectedAppointment(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="details-modal-body">
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {selectedAppointment.doctor.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedAppointment.doctor}</h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{selectedAppointment.specialization}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="modal-info-section">
                                        <span className="modal-info-label">Date</span>
                                        <span className="modal-info-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <Calendar size={15} style={{ color: 'var(--color-primary)' }} />
                                            {selectedAppointment.date}
                                        </span>
                                    </div>
                                    <div className="modal-info-section">
                                        <span className="modal-info-label">Time Slot</span>
                                        <span className="modal-info-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <Clock size={15} style={{ color: 'var(--color-primary)' }} />
                                            {selectedAppointment.time}
                                        </span>
                                    </div>
                                </div>

                                <div className="modal-info-section">
                                    <span className="modal-info-label">Status</span>
                                    <div>
                                        <span className={`status-chip status-${selectedAppointment.status}`} style={{ textTransform: 'capitalize', display: 'inline-flex', padding: '0.5rem 1rem' }}>
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: selectedAppointment.status === 'completed' ? '#15803d' : selectedAppointment.status === 'cancelled' ? '#b91c1c' : '#0b7285',
                                                marginRight: '0.5rem',
                                                display: 'inline-block'
                                            }}></span>
                                            {selectedAppointment.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="modal-info-section">
                                    <span className="modal-info-label">Your Consultation Notes</span>
                                    <div className="modal-info-card">
                                        {selectedAppointment.notes ? (
                                            <p style={{ fontSize: '0.925rem', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.6 }}>
                                                "{selectedAppointment.notes}"
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                                No symptoms or notes were provided for this booking.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="details-modal-footer">
                                <button
                                    className="btn btn-primary"
                                    style={{ borderRadius: 'var(--radius-md)', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                                    onClick={() => setSelectedAppointment(null)}
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
