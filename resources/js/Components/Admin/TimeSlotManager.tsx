import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Calendar, Clock, Plus, Edit, Trash2, Search, Filter, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface TimeSlot {
    id: number;
    doctor_id?: number;
    doctor_name?: string;
    date: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

interface Doctor {
    id: number;
    name: string;
    specialization: string;
}

interface Props {
    timeSlots: TimeSlot[];
    isAdmin: boolean;
    doctors?: Doctor[];
}

export default function TimeSlotManager({ timeSlots, isAdmin, doctors = [] }: Props) {
    // Search and Filters state
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'booked'>('all');

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    // Form inputs state
    const [formDoctorId, setFormDoctorId] = useState(doctors[0]?.id?.toString() || '');
    const [formDate, setFormDate] = useState('');
    const [formStartTime, setFormStartTime] = useState('');
    const [formEndTime, setFormEndTime] = useState('');
    const [formIsBooked, setFormIsBooked] = useState(false);

    // Filter Logic
    const filteredSlots = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];

        return timeSlots.filter(slot => {
            // Admin Search (by doctor name)
            const matchesSearch = !isAdmin || !search || 
                slot.doctor_name?.toLowerCase().includes(search.toLowerCase());

            // Date Filter
            let matchesDate = true;
            if (dateFilter === 'today') {
                matchesDate = slot.date === todayStr;
            } else if (dateFilter === 'upcoming') {
                matchesDate = slot.date >= todayStr;
            }

            // Status Filter
            let matchesStatus = true;
            if (statusFilter === 'available') {
                matchesStatus = !slot.is_booked;
            } else if (statusFilter === 'booked') {
                matchesStatus = slot.is_booked;
            }

            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [timeSlots, isAdmin, search, dateFilter, statusFilter]);

    // Handle Create Submit
    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const payload: any = {
            date: formDate,
            start_time: formStartTime,
            end_time: formEndTime,
        };

        if (isAdmin) {
            payload.doctor_id = parseInt(formDoctorId);
        }

        router.post('/timeslots', payload, {
            onSuccess: () => {
                setIsCreateOpen(false);
                resetForm();
            }
        });
    }

    // Handle Edit Open
    function openEdit(slot: TimeSlot) {
        setSelectedSlot(slot);
        setFormDate(slot.date);
        // Extract HH:MM from HH:MM:SS
        setFormStartTime(slot.start_time.substring(0, 5));
        setFormEndTime(slot.end_time.substring(0, 5));
        setFormIsBooked(slot.is_booked);
        if (isAdmin && slot.doctor_id) {
            setFormDoctorId(slot.doctor_id.toString());
        }
        setIsEditOpen(true);
    }

    // Handle Update Submit
    function handleUpdateSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedSlot) return;

        router.put(`/timeslots/${selectedSlot.id}`, {
            date: formDate,
            start_time: formStartTime,
            end_time: formEndTime,
            is_booked: formIsBooked,
        }, {
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedSlot(null);
                resetForm();
            }
        });
    }

    // Handle Delete
    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus slot waktu ini?')) {
            router.delete(`/timeslots/${id}`);
        }
    }

    // Reset Form fields
    function resetForm() {
        setFormDate('');
        setFormStartTime('');
        setFormEndTime('');
        setFormIsBooked(false);
        if (doctors.length > 0) {
            setFormDoctorId(doctors[0].id.toString());
        }
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
        } catch {
            return dateStr;
        }
    }

    return (
        <div className="dashboard-card dashboard-grid-full">
            <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={18} style={{ color: 'var(--color-primary)' }} /> Kelola Slot Waktu
                    </h3>
                    <p style={{ marginTop: '0.2rem' }}>Tambah, edit, dan hapus jadwal praktik dokter.</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setIsCreateOpen(true); }}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)' }}
                >
                    <Plus size={16} /> Tambah Slot
                </button>
            </div>

            {/* Filter Row */}
            <div className="table-actions" style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {isAdmin && (
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="search"
                            placeholder="Cari nama dokter..."
                            className="filter-input"
                            style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-md)' }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select
                        className="filter-select"
                        style={{ borderRadius: 'var(--radius-md)', minWidth: 140 }}
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value as any)}
                    >
                        <option value="all">Semua Tanggal</option>
                        <option value="today">Hari Ini</option>
                        <option value="upcoming">Mendatang</option>
                    </select>

                    <select
                        className="filter-select"
                        style={{ borderRadius: 'var(--radius-md)', minWidth: 140 }}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">Semua Status</option>
                        <option value="available">Tersedia</option>
                        <option value="booked">Dipesan</option>
                    </select>
                </div>
            </div>

            {/* Time Slot List */}
            <div style={{ overflowX: 'auto' }}>
                <table className="schedule-mini-table">
                    <thead>
                        <tr>
                            {isAdmin && <th>Dokter</th>}
                            <th>Tanggal</th>
                            <th>Waktu</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSlots.length > 0 ? filteredSlots.map(slot => (
                            <tr key={slot.id}>
                                {isAdmin && (
                                    <td>
                                        <span style={{ fontWeight: 600 }}>{slot.doctor_name}</span>
                                    </td>
                                )}
                                <td style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                                    {formatFriendlyDate(slot.date)}
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Clock size={13} style={{ color: 'var(--color-primary)' }} />
                                        {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-chip status-${slot.is_booked ? 'cancelled' : 'scheduled'}`} style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                                        {slot.is_booked ? <XCircle size={12} style={{ marginRight: '0.25rem', color: '#b91c1c' }} /> : <CheckCircle2 size={12} style={{ marginRight: '0.25rem', color: '#0b7285' }} />}
                                        {slot.is_booked ? 'Dipesan (Booked)' : 'Tersedia'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => openEdit(slot)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                                        >
                                            <Edit size={12} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slot.id)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', borderColor: '#ef4444', color: '#ef4444' }}
                                            disabled={slot.is_booked}
                                            title={slot.is_booked ? "Tidak dapat menghapus slot yang sudah dipesan" : ""}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertCircle size={24} style={{ opacity: 0.5 }} />
                                        <span>Tidak ada slot waktu ditemukan.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="details-modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="details-modal"
                            style={{ maxWidth: '450px' }}
                        >
                            <div className="details-modal-header">
                                <h3>Tambah Slot Praktik Baru</h3>
                                <button className="modal-close-btn" onClick={() => setIsCreateOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                                {isAdmin && (
                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                                        <span>Pilih Dokter</span>
                                        <select
                                            className="filter-input"
                                            value={formDoctorId}
                                            onChange={e => setFormDoctorId(e.target.value)}
                                            required
                                        >
                                            {doctors.map(d => (
                                                <option key={d.id} value={d.id.toString()}>{d.name} ({d.specialization})</option>
                                            ))}
                                        </select>
                                    </label>
                                )}

                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                                    <span>Tanggal Praktik</span>
                                    <input
                                        type="date"
                                        className="filter-input"
                                        value={formDate}
                                        onChange={e => setFormDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </label>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                                        <span>Jam Mulai</span>
                                        <input
                                            type="time"
                                            className="filter-input"
                                            value={formStartTime}
                                            onChange={e => setFormStartTime(e.target.value)}
                                            required
                                        />
                                    </label>

                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                                        <span>Jam Selesai</span>
                                        <input
                                            type="time"
                                            className="filter-input"
                                            value={formEndTime}
                                            onChange={e => setFormEndTime(e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>

                                <div className="details-modal-footer" style={{ marginTop: '0.5rem', padding: '1rem 0 0', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsCreateOpen(false)}>
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Simpan Slot
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditOpen && selectedSlot && (
                    <div className="details-modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="details-modal"
                            style={{ maxWidth: '450px' }}
                        >
                            <div className="details-modal-header">
                                <h3>Edit Slot Praktik</h3>
                                <button className="modal-close-btn" onClick={() => { setIsEditOpen(false); setSelectedSlot(null); }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                                {isAdmin && (
                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600, opacity: 0.7 }}>
                                        <span>Dokter</span>
                                        <input
                                            type="text"
                                            className="filter-input"
                                            value={selectedSlot.doctor_name || ''}
                                            disabled
                                        />
                                    </label>
                                )}

                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                                    <span>Tanggal Praktik</span>
                                    <input
                                        type="date"
                                        className="filter-input"
                                        value={formDate}
                                        onChange={e => setFormDate(e.target.value)}
                                        required
                                    />
                                </label>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                                        <span>Jam Mulai</span>
                                        <input
                                            type="time"
                                            className="filter-input"
                                            value={formStartTime}
                                            onChange={e => setFormStartTime(e.target.value)}
                                            required
                                        />
                                    </label>

                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                                        <span>Jam Selesai</span>
                                        <input
                                            type="time"
                                            className="filter-input"
                                            value={formEndTime}
                                            onChange={e => setFormEndTime(e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formIsBooked}
                                        onChange={e => setFormIsBooked(e.target.checked)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span>Dipesan oleh pasien (Booked)</span>
                                </label>

                                <div className="details-modal-footer" style={{ marginTop: '0.5rem', padding: '1rem 0 0', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => { setIsEditOpen(false); setSelectedSlot(null); }}>
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Perbarui Slot
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
