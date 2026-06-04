import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Stethoscope, Plus, Pencil, Trash2, X, Search } from 'lucide-react';

interface Doctor {
    id: number; name: string; email: string;
    specialization: string; phone: string; bio: string | null; is_active: boolean;
}

interface Props { doctors: Doctor[]; }

const empty = { name: '', email: '', password: '', specialization: '', phone: '', bio: '' };

export default function DoctorManager({ doctors }: Props) {
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(empty);

    const filtered = doctors.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
    );

    function openAdd() { setForm(empty); setEditId(null); setModal('add'); }
    function openEdit(d: Doctor) {
        setForm({ name: d.name, email: d.email, password: '', specialization: d.specialization, phone: d.phone, bio: d.bio || '' });
        setEditId(d.id); setModal('edit');
    }
    function close() { setModal(null); setEditId(null); setForm(empty); }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (modal === 'add') {
            router.post('/admin/doctors', form, { onSuccess: close });
        } else if (modal === 'edit' && editId) {
            router.put(`/admin/doctors/${editId}`, form, { onSuccess: close });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus dokter ini?')) {
            router.delete(`/admin/doctors/${id}`);
        }
    }

    const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <>
            <div className="dashboard-card dashboard-grid-full">
                <div className="dashboard-card-header">
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Stethoscope size={18} style={{ color: 'var(--color-primary)' }} /> Kelola Dokter
                        </h3>
                        <p style={{ marginTop: '0.2rem' }}>Tambah, edit, atau hapus data dokter</p>
                    </div>
                    <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }} onClick={openAdd}>
                        <Plus size={16} /> Tambah Dokter
                    </button>
                </div>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input type="search" placeholder="Cari dokter..." className="filter-input" style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-md)' }} value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="schedule-mini-table">
                        <thead><tr><th>Nama</th><th>Email</th><th>Spesialisasi</th><th>Telepon</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {filtered.length > 0 ? filtered.map(d => (
                                <tr key={d.id}>
                                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className="appointment-mini-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{d.name.charAt(0)}</div>
                                        <span style={{ fontWeight: 600 }}>{d.name}</span>
                                    </div></td>
                                    <td style={{ fontSize: '0.85rem' }}>{d.email}</td>
                                    <td><span className="eyebrow" style={{ margin: 0, padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>{d.specialization}</span></td>
                                    <td style={{ fontSize: '0.85rem' }}>{d.phone}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                                            <button onClick={() => openEdit(d)} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}><Pencil size={13} /></button>
                                            <button onClick={() => handleDelete(d.id)} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', borderColor: '#ef4444', color: '#ef4444' }}><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Tidak ada dokter ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <div className="details-modal-overlay" onClick={close}>
                    <div className="details-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <div className="details-modal-header">
                            <h3>{modal === 'add' ? 'Tambah Dokter Baru' : 'Edit Data Dokter'}</h3>
                            <button className="modal-close-btn" onClick={close}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="details-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nama<input className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.name} onChange={e => set('name', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email<input type="email" className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.email} onChange={e => set('email', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Password {modal === 'edit' && '(kosongkan jika tidak diubah)'}<input type="password" className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.password} onChange={e => set('password', e.target.value)} {...(modal === 'add' ? { required: true } : {})} /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Spesialisasi<input className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.specialization} onChange={e => set('specialization', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Telepon<input className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.phone} onChange={e => set('phone', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bio<textarea className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} rows={2} value={form.bio} onChange={e => set('bio', e.target.value)} /></label>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
                                {modal === 'add' ? 'Tambah Dokter' : 'Simpan Perubahan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
