import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CalendarCheck, Clock, CheckCircle2, XCircle, Search, AlertCircle } from 'lucide-react';

interface Appointment {
    id: number;
    patient: string;
    doctor: string;
    specialization: string;
    date: string;
    time: string;
    status: string;
    notes: string | null;
    created_at: string;
}

interface Props {
    appointments: Appointment[];
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'confirmed':
        case 'completed': return <CheckCircle2 size={14} style={{ color: '#15803d' }} />;
        case 'cancelled': return <XCircle size={14} style={{ color: '#b91c1c' }} />;
        default: return <Clock size={14} style={{ color: '#0b7285' }} />;
    }
}

export default function AppointmentManager({ appointments }: Props) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = appointments.filter(apt => {
        const matchesSearch =
            apt.patient.toLowerCase().includes(search.toLowerCase()) ||
            apt.doctor.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'pending' && ['pending', 'scheduled'].includes(apt.status.toLowerCase())) ||
            apt.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    function handleAcc(id: number) {
        if (confirm('Apakah Anda yakin ingin menyetujui (Acc) appointment ini?')) {
            router.put(`/admin/appointments/${id}/status`, { status: 'confirmed' });
        }
    }

    function handleReject(id: number) {
        if (confirm('Apakah Anda yakin ingin membatalkan appointment ini?')) {
            router.put(`/admin/appointments/${id}/status`, { status: 'cancelled' });
        }
    }

    return (
        <div className="dashboard-card dashboard-grid-full">
            <div className="dashboard-card-header">
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CalendarCheck size={18} style={{ color: 'var(--color-primary)' }} /> Kelola Appointment
                    </h3>
                    <p style={{ marginTop: '0.2rem' }}>Persetujuan (Acc) atau Pembatalan appointment pasien</p>
                </div>
            </div>

            <div className="table-actions" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        type="search"
                        placeholder="Cari pasien atau dokter..."
                        className="filter-input"
                        style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-md)' }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <select
                        className="filter-select"
                        style={{ borderRadius: 'var(--radius-md)', minWidth: 150 }}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="All">Semua Status</option>
                        <option value="pending">Menunggu (Pending/Scheduled)</option>
                        <option value="confirmed">Disetujui (Confirmed)</option>
                        <option value="completed">Selesai (Completed)</option>
                        <option value="cancelled">Dibatalkan (Cancelled)</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="schedule-mini-table">
                    <thead>
                        <tr>
                            <th>Pasien</th>
                            <th>Dokter</th>
                            <th>Tanggal & Waktu</th>
                            <th>Status</th>
                            <th>Catatan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(apt => (
                            <tr key={apt.id}>
                                <td>
                                    <span style={{ fontWeight: 600 }}>{apt.patient}</span>
                                </td>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{apt.doctor}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{apt.specialization}</div>
                                    </div>
                                </td>
                                <td style={{ fontSize: '0.85rem' }}>
                                    <div style={{ fontWeight: 600 }}>{apt.date}</div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{apt.time}</div>
                                </td>
                                <td>
                                    <span className={`status-chip status-${apt.status}`} style={{ textTransform: 'capitalize' }}>
                                        {getStatusIcon(apt.status)}
                                        <span style={{ marginLeft: '0.3rem' }}>{apt.status}</span>
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {apt.notes ? <span style={{ fontStyle: 'italic' }}>"{apt.notes}"</span> : <span style={{ opacity: 0.5 }}>—</span>}
                                </td>
                                <td>
                                    {['pending', 'scheduled'].includes(apt.status.toLowerCase()) ? (
                                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                                            <button
                                                onClick={() => handleAcc(apt.id)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                                            >
                                                Acc
                                            </button>
                                            <button
                                                onClick={() => handleReject(apt.id)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', borderColor: '#ef4444', color: '#ef4444' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : apt.status.toLowerCase() === 'confirmed' ? (
                                        <button
                                            onClick={() => handleReject(apt.id)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', borderColor: '#ef4444', color: '#ef4444' }}
                                        >
                                            Batal
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tidak ada aksi</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertCircle size={24} style={{ opacity: 0.5 }} />
                                        <span>Tidak ada appointment ditemukan.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
