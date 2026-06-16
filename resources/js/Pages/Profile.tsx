import MainLayout from '../Layouts/MainLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    User, Mail, Phone, MapPin, Calendar, Shield,
    Edit3, Save, X, CheckCircle, AlertCircle,
    Lock, BadgeCheck, Camera, Stethoscope, FileText
} from 'lucide-react';
import type { SharedProps } from '../types';

interface ProfileProps {
    user: any;
    patient: any;
    doctor: any;
}

export default function Profile({ user, patient, doctor }: ProfileProps) {
    const { props } = usePage<SharedProps>();
    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const role = user?.role;
    const isDoctor = role === 'doctor';
    const isPatient = role === 'patient' || (!isDoctor && role !== 'admin');

    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        // Patient fields
        date_of_birth: patient?.date_of_birth || '',
        gender: patient?.gender || '',
        phone: isDoctor ? (doctor?.phone || '') : (patient?.phone || ''),
        address: patient?.address || '',
        // Doctor fields
        specialization: doctor?.specialization || '',
        bio: doctor?.bio || '',
        // Avatar
        avatar: null as File | null,
    });

    const getInitial = (name?: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n: string) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        form.post('/profile/update', {
            forceFormData: true,
            onSuccess: () => {
                setIsEditing(false);
                setAvatarPreview(null);
            },
        });
    }

    function handleCancel() {
        setIsEditing(false);
        setAvatarPreview(null);
        form.setData({
            name: user?.name || '',
            email: user?.email || '',
            date_of_birth: patient?.date_of_birth || '',
            gender: patient?.gender || '',
            phone: isDoctor ? (doctor?.phone || '') : (patient?.phone || ''),
            address: patient?.address || '',
            specialization: doctor?.specialization || '',
            bio: doctor?.bio || '',
            avatar: null,
        });
        form.clearErrors();
    }

    const roleLabel = isDoctor ? 'Dokter' : user?.role === 'admin' ? 'Admin' : 'Pasien';
    const currentAvatarUrl = avatarPreview || user?.avatar_url;

    return (
        <MainLayout>
            <Head title="Profile" />

            <section className="section page-enter" style={{ padding: '1.5rem 0 3rem' }}>

                {/* ── Page Header ── */}
                <div style={{ marginBottom: '2rem' }}>
                    <div className="eyebrow" style={{ display: 'inline-flex' }}>
                        <User size={14} />
                        Manajemen Profil
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        fontWeight: 800,
                        color: 'var(--color-text)',
                        marginTop: '0.5rem',
                    }}>
                        Pengaturan Akun
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                        Kelola informasi pribadi dan keamanan akun Anda.
                    </p>
                </div>

                {/* Flash Messages */}
                {props.flash?.success && (
                    <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', width: 'auto', maxWidth: '500px' }}>
                        <CheckCircle size={16} />
                        {props.flash.success}
                    </div>
                )}
                {props.flash?.error && (
                    <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', width: 'auto', maxWidth: '500px' }}>
                        <AlertCircle size={16} />
                        {props.flash.error}
                    </div>
                )}

                <div className="profile-layout">

                    {/* ── Left: Avatar + Quick Info ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Avatar Card */}
                        <div className="profile-avatar-card">
                            <div style={{ position: 'relative' }}>
                                {currentAvatarUrl ? (
                                    <img
                                        src={currentAvatarUrl}
                                        alt={user?.name}
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            objectFit: 'cover',
                                            boxShadow: '0 8px 24px rgba(15, 118, 159, 0.3)',
                                            border: '3px solid var(--color-border)',
                                        }}
                                    />
                                ) : (
                                    <div className="profile-avatar-large">
                                        {getInitial(form.data.name)}
                                    </div>
                                )}
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            position: 'absolute', bottom: '-4px', right: '-4px',
                                            width: '30px', height: '30px', borderRadius: '50%',
                                            background: 'var(--color-primary)', color: '#fff',
                                            border: '2px solid var(--color-surface)',
                                            display: 'grid', placeItems: 'center',
                                            cursor: 'pointer', fontSize: '0.75rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        }}
                                    >
                                        <Camera size={14} />
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleAvatarChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text)' }}>
                                    {user?.name ?? 'Unknown'}
                                </h3>
                                <span className="profile-role-badge">
                                    <BadgeCheck size={12} />
                                    {roleLabel}
                                </span>
                            </div>
                            <div style={{ width: '100%', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div className="profile-meta-row">
                                    <Mail size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user?.email || '—'}
                                    </span>
                                </div>
                                <div className="profile-meta-row">
                                    <Phone size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        {isDoctor ? (doctor?.phone || 'Belum diisi') : (patient?.phone || 'Belum diisi')}
                                    </span>
                                </div>
                                {isDoctor && (
                                    <div className="profile-meta-row">
                                        <Stethoscope size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            {doctor?.specialization || 'Belum diisi'}
                                        </span>
                                    </div>
                                )}
                                {isPatient && (
                                    <div className="profile-meta-row">
                                        <MapPin size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {patient?.address || 'Belum diisi'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {!isEditing ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(true)}
                                    style={{ width: '100%', borderRadius: 'var(--radius-md)', gap: '0.5rem' }}
                                >
                                    <Edit3 size={15} />
                                    Edit Profil
                                </button>
                            ) : (
                                <button
                                    className="btn btn-outline"
                                    onClick={handleCancel}
                                    style={{ width: '100%', borderRadius: 'var(--radius-md)', gap: '0.5rem', borderColor: '#ef4444', color: '#ef4444' }}
                                >
                                    <X size={15} />
                                    Batal
                                </button>
                            )}
                        </div>

                        {/* Account Security Card */}
                        <div className="dashboard-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--color-border)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', display: 'grid', placeItems: 'center' }}>
                                    <Shield size={16} style={{ color: '#7c3aed' }} />
                                </div>
                                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>Keamanan Akun</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <div className="security-info-row">
                                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Email</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                                        {user?.email}
                                    </span>
                                </div>
                                <div className="security-info-row">
                                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Password</span>
                                    <span style={{ fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.8rem', color: 'var(--color-text)' }}>••••••••</span>
                                </div>
                                <button className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-md)', gap: '0.4rem', justifyContent: 'center', marginTop: '0.25rem' }}>
                                    <Lock size={13} />
                                    Ganti Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Edit / View Form ── */}
                    <div className="dashboard-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                            <div>
                                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                                    {isEditing ? 'Edit Informasi Pribadi' : 'Informasi Pribadi'}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                                    {isEditing
                                        ? 'Perbarui detail profil Anda di bawah ini.'
                                        : isDoctor
                                            ? 'Detail informasi akun dan profil dokter Anda.'
                                            : 'Detail informasi akun dan profil pasien Anda.'
                                    }
                                </p>
                            </div>
                            {isEditing && (
                                <span className="eyebrow" style={{ margin: 0, padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'rgba(251, 191, 36, 0.12)', color: '#b45309' }}>
                                    Mode Edit
                                </span>
                            )}
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Name + Email in 2 cols */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                {/* Name */}
                                <div className="profile-field-group">
                                    <label className="profile-field-label">
                                        <User size={13} />
                                        Nama Lengkap
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="filter-input"
                                            value={form.data.name}
                                            onChange={(e) => form.setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                            required
                                        />
                                    ) : (
                                        <div className="profile-field-value">{user?.name || '—'}</div>
                                    )}
                                    {form.errors.name && <span className="profile-field-error">{form.errors.name}</span>}
                                </div>

                                {/* Email */}
                                <div className="profile-field-group">
                                    <label className="profile-field-label">
                                        <Mail size={13} />
                                        Alamat Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="filter-input"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            placeholder="email@contoh.com"
                                            style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                            required
                                        />
                                    ) : (
                                        <div className="profile-field-value">{user?.email || '—'}</div>
                                    )}
                                    {form.errors.email && <span className="profile-field-error">{form.errors.email}</span>}
                                </div>
                            </div>

                            {/* ── Doctor-specific fields ── */}
                            {isDoctor && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                        {/* Specialization */}
                                        <div className="profile-field-group">
                                            <label className="profile-field-label">
                                                <Stethoscope size={13} />
                                                Spesialisasi
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="filter-input"
                                                    value={form.data.specialization}
                                                    onChange={(e) => form.setData('specialization', e.target.value)}
                                                    placeholder="Contoh: Dokter Umum, Dokter Gigi..."
                                                    style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                                    required
                                                />
                                            ) : (
                                                <div className="profile-field-value">{doctor?.specialization || '—'}</div>
                                            )}
                                            {form.errors.specialization && <span className="profile-field-error">{form.errors.specialization}</span>}
                                        </div>

                                        {/* Phone */}
                                        <div className="profile-field-group">
                                            <label className="profile-field-label">
                                                <Phone size={13} />
                                                Nomor Telepon
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    className="filter-input"
                                                    value={form.data.phone}
                                                    onChange={(e) => form.setData('phone', e.target.value)}
                                                    placeholder="08xxxxxxxxxx"
                                                    style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                                />
                                            ) : (
                                                <div className="profile-field-value">{doctor?.phone || '—'}</div>
                                            )}
                                            {form.errors.phone && <span className="profile-field-error">{form.errors.phone}</span>}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="profile-field-group">
                                        <label className="profile-field-label">
                                            <FileText size={13} />
                                            Bio / Tentang Dokter
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                className="filter-input"
                                                value={form.data.bio}
                                                onChange={(e) => form.setData('bio', e.target.value)}
                                                placeholder="Tuliskan bio singkat tentang Anda, pengalaman, atau keahlian..."
                                                rows={4}
                                                style={{ width: '100%', borderRadius: 'var(--radius-md)', resize: 'vertical' }}
                                            />
                                        ) : (
                                            <div className="profile-field-value" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                                                {doctor?.bio || '—'}
                                            </div>
                                        )}
                                        {form.errors.bio && <span className="profile-field-error">{form.errors.bio}</span>}
                                    </div>
                                </>
                            )}

                            {/* ── Patient-specific fields ── */}
                            {isPatient && (
                                <>
                                    {/* DOB + Gender in 2 cols */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                        {/* Date of Birth */}
                                        <div className="profile-field-group">
                                            <label className="profile-field-label">
                                                <Calendar size={13} />
                                                Tanggal Lahir
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    className="filter-input"
                                                    value={form.data.date_of_birth}
                                                    onChange={(e) => form.setData('date_of_birth', e.target.value)}
                                                    style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                                />
                                            ) : (
                                                <div className="profile-field-value">{patient?.date_of_birth || '—'}</div>
                                            )}
                                            {form.errors.date_of_birth && <span className="profile-field-error">{form.errors.date_of_birth}</span>}
                                        </div>

                                        {/* Gender */}
                                        <div className="profile-field-group">
                                            <label className="profile-field-label">
                                                <User size={13} />
                                                Jenis Kelamin
                                            </label>
                                            {isEditing ? (
                                                <select
                                                    className="filter-input filter-select"
                                                    value={form.data.gender}
                                                    onChange={(e) => form.setData('gender', e.target.value)}
                                                    style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                                >
                                                    <option value="">Pilih Jenis Kelamin</option>
                                                    <option value="Laki-laki">Laki-laki</option>
                                                    <option value="Perempuan">Perempuan</option>
                                                </select>
                                            ) : (
                                                <div className="profile-field-value">
                                                    {patient?.gender || '—'}
                                                </div>
                                            )}
                                            {form.errors.gender && <span className="profile-field-error">{form.errors.gender}</span>}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="profile-field-group">
                                        <label className="profile-field-label">
                                            <Phone size={13} />
                                            Nomor Telepon
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                className="filter-input"
                                                value={form.data.phone}
                                                onChange={(e) => form.setData('phone', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                            />
                                        ) : (
                                            <div className="profile-field-value">{patient?.phone || '—'}</div>
                                        )}
                                        {form.errors.phone && <span className="profile-field-error">{form.errors.phone}</span>}
                                    </div>

                                    {/* Address */}
                                    <div className="profile-field-group">
                                        <label className="profile-field-label">
                                            <MapPin size={13} />
                                            Alamat
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                className="filter-input"
                                                value={form.data.address}
                                                onChange={(e) => form.setData('address', e.target.value)}
                                                placeholder="Masukkan alamat lengkap..."
                                                rows={3}
                                                style={{ width: '100%', borderRadius: 'var(--radius-md)', resize: 'vertical' }}
                                            />
                                        ) : (
                                            <div className="profile-field-value" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                                                {patient?.address || '—'}
                                            </div>
                                        )}
                                        {form.errors.address && <span className="profile-field-error">{form.errors.address}</span>}
                                    </div>
                                </>
                            )}

                            {/* Save Button */}
                            {isEditing && (
                                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)', marginTop: '0.25rem' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={form.processing}
                                        style={{ flex: 1, borderRadius: 'var(--radius-md)', gap: '0.5rem' }}
                                    >
                                        <Save size={15} />
                                        {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={handleCancel}
                                        style={{ borderRadius: 'var(--radius-md)', gap: '0.5rem' }}
                                    >
                                        <X size={15} />
                                        Batal
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}