import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Users, Plus, Pencil, Trash2, X, Search } from 'lucide-react';

interface Patient {
    id: number;
    name: string;
    email: string;
    date_of_birth: string;
    gender: string;
    address: string;
    phone: string;
    avatar_url?: string;
}

interface Props {
    patients: Patient[];
}

const empty = {
    name: '',
    email: '',
    password: '',
    date_of_birth: '',
    gender: 'Laki-laki',
    address: '',
    phone: ''
};

export default function PatientManager({ patients }: Props) {
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(empty);

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    function openAdd() {
        setForm(empty);
        setEditId(null);
        setModal('add');
    }

    function openEdit(p: Patient) {
        setForm({
            name: p.name,
            email: p.email,
            password: '',
            date_of_birth: p.date_of_birth,
            gender: p.gender,
            address: p.address,
            phone: p.phone
        });
        setEditId(p.id);
        setModal('edit');
    }

    function close() {
        setModal(null);
        setEditId(null);
        setForm(empty);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (modal === 'add') {
            router.post('/admin/patients', form, { onSuccess: close });
        } else if (modal === 'edit' && editId) {
            router.put(`/admin/patients/${editId}`, form, { onSuccess: close });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
            router.delete(`/admin/patients/${id}`);
        }
    }

    const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <>
            <div className="dashboard-card dashboard-grid-full">
                <div className="dashboard-card-header">
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={18} style={{ color: 'var(--color-primary)' }} /> Kelola Pasien
                        </h3>
                        <p style={{ marginTop: '0.2rem' }}>Tambah, edit, atau hapus data pasien</p>
                    </div>
                    <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }} onClick={openAdd}>
                        <Plus size={16} /> Tambah Pasien
                    </button>
                </div>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input type="search" placeholder="Cari pasien..." className="filter-input" style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-md)' }} value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="schedule-mini-table">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Tgl Lahir</th>
                                <th>Gender</th>
                                <th>Telepon</th>
                                <th>Alamat</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? filtered.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div className="appointment-mini-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {p.avatar_url ? (
                                                    <img
                                                        src={p.avatar_url}
                                                        alt={p.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    p.name.charAt(0)
                                                )}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>{p.email}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{p.date_of_birth}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{p.gender}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{p.phone}</td>
                                    <td style={{ fontSize: '0.85rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                                            <button onClick={() => openEdit(p)} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}><Pencil size={13} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', borderColor: '#ef4444', color: '#ef4444' }}><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Tidak ada pasien ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <div className="details-modal-overlay" onClick={close}>
                    <div className="details-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <div className="details-modal-header">
                            <h3>{modal === 'add' ? 'Tambah Pasien Baru' : 'Edit Data Pasien'}</h3>
                            <button className="modal-close-btn" onClick={close}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="details-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nama<input className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.name} onChange={e => set('name', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email<input type="email" className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.email} onChange={e => set('email', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Password {modal === 'edit' && '(kosongkan jika tidak diubah)'}<input type="password" className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.password} onChange={e => set('password', e.target.value)} {...(modal === 'add' ? { required: true } : {})} /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Tanggal Lahir<input type="date" className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Jenis Kelamin
                                <select className="filter-select" style={{ borderRadius: 'var(--radius-md)', marginTop: 4, width: '100%' }} value={form.gender} onChange={e => set('gender', e.target.value)} required>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Telepon<input className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} value={form.phone} onChange={e => set('phone', e.target.value)} required /></label>
                            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Alamat<textarea className="filter-input" style={{ borderRadius: 'var(--radius-md)', marginTop: 4 }} rows={2} value={form.address} onChange={e => set('address', e.target.value)} required /></label>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
                                {modal === 'add' ? 'Tambah Pasien' : 'Simpan Perubahan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
