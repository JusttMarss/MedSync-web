import { FormEvent, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, HeartPulse, UserPlus, ShieldCheck, Calendar, Phone } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';
import type { SharedProps } from '../types';

const avatarData = [
    { label: '👤', anim: 'floatA', delay: '0s' },
    { label: '👤', anim: 'floatB', delay: '0.4s' },
    { label: '👤', anim: 'floatC', delay: '0.8s' },
];

export default function Register() {
    const { props } = usePage<SharedProps>();
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        gender: '',
        phone: '',
        address: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/register');
    }

    const inputStyle: React.CSSProperties = { width: '100%' };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.8rem',
        fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem',
    };

    return (
        <MainLayout>
            <Head title="Sign Up" />

            <section style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '6rem 2rem 1.5rem',
                flex: 1,
            }}>
                <div style={{
                    display: 'flex',
                    width: '100%', 
                    maxWidth: '1000px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(15,118,159,0.12)',
                    border: '1px solid var(--color-border)',
                    marginTop: '1rem',
                    marginBottom: '2rem',
                }}>
                    {/* ── Left panel ── */}
                    <div style={{
                        flex: 1,
                        background: 'linear-gradient(160deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        padding: '3rem 2.5rem', 
                        display: 'flex',
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        position: 'relative', 
                        overflow: 'hidden',
                        minHeight: '100%',
                    }}>
                        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                                <HeartPulse size={18} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                                    Buat Akun Baru
                                </span>
                            </div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '1rem' }}>
                                Perjalanan Kesehatan Anda,<br />Lebih Modern dan Aman.
                            </h1>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: '2rem' }}>
                                Bergabunglah dengan MedSync Clinic untuk mengelola janji temu dan mengakses rekam medis Anda dalam satu platform yang aman dan mudah digunakan.
                            </p>

                            {/* feature pills */}
                            {[
                                { icon: <ShieldCheck size={14} />, text: 'Data terenkripsi & aman' },
                                { icon: <Calendar size={14} />,    text: 'Booking 24/7 kapan saja' },
                                { icon: <Phone size={14} />,       text: 'Notifikasi otomatis' },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                                    marginBottom: '0.6rem', color: 'rgba(255,255,255,0.8)',
                                    fontSize: '0.85rem', fontWeight: 500,
                                }}>
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.15)',
                                        display: 'grid', placeItems: 'center', flexShrink: 0,
                                    }}>
                                        {item.icon}
                                    </div>
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* trust badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                            <div style={{ display: 'flex' }}>
                                {avatarData.map(({ label, anim, delay }, i) => (
                                    <div key={i} style={{
                                        width: '30px', height: '30px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.18)',
                                        border: '1.5px solid rgba(255,255,255,0.3)',
                                        display: 'grid', placeItems: 'center',
                                        fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)',
                                        marginLeft: i === 0 ? 0 : '-8px',
                                        animation: `${anim} 3s ease-in-out infinite`,
                                        animationDelay: delay,
                                    }}>{label}</div>
                                ))}
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', animation: 'fadePulse 3s ease-in-out infinite' }}>
                                Dipercaya oleh 10.000+ Pasien
                            </span>
                        </div>
                    </div>

                    {/* ── Right panel ── */}
                    <div style={{
                        flex: 1.2, 
                        background: 'var(--color-surface)',
                        padding: '2.5rem 2.75rem',
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.3rem' }}>
                            Create Account
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                            Isi data di bawah untuk membuat akun baru
                        </p>

                        {props.flash?.error && (
                            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                                {props.flash.error}
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

                            {/* Name + Email */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={labelStyle}>Nama Lengkap</label>
                                    <input type="text" className="filter-input" placeholder="John Doe"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Alamat Email</label>
                                    <input type="email" className="filter-input" placeholder="you@example.com"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        required style={inputStyle} />
                                </div>
                            </div>

                            {/* DOB + Gender */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={labelStyle}>Tanggal Lahir</label>
                                    <input type="date" className="filter-input"
                                        value={form.data.date_of_birth}
                                        onChange={(e) => form.setData('date_of_birth', e.target.value)}
                                        style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Gender</label>
                                    <select className="filter-select"
                                        value={form.data.gender}
                                        onChange={(e) => form.setData('gender', e.target.value)}
                                        style={inputStyle}>
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={labelStyle}>Nomor Telepon</label>
                                <input type="tel" className="filter-input" placeholder="08xxxxxxxxxx"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    style={inputStyle} />
                            </div>

                            {/* Address */}
                            <div>
                                <label style={labelStyle}>Alamat</label>
                                <textarea className="filter-input" rows={2} placeholder="Jl. Contoh No. 1, Kota"
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    style={{ ...inputStyle, resize: 'none' }} />
                            </div>

                            {/* Password + Confirm */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={labelStyle}>Kata Sandi</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showPassword ? 'text' : 'password'}
                                            className="filter-input" placeholder="••••••••"
                                            value={form.data.password}
                                            onChange={(e) => form.setData('password', e.target.value)}
                                            required style={{ ...inputStyle, paddingRight: '2.75rem' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                                            aria-label={showPassword ? 'Hide' : 'Show'}>
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Konfirmasi Kata Sandi</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showConfirm ? 'text' : 'password'}
                                            className="filter-input" placeholder="••••••••"
                                            value={form.data.password_confirmation}
                                            onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                            required style={{ ...inputStyle, paddingRight: '2.75rem' }} />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                                            aria-label={showConfirm ? 'Hide' : 'Show'}>
                                            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" className="btn btn-primary" disabled={form.processing}
                                style={{
                                    width: '100%', marginTop: '0.35rem',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.75rem', fontSize: '0.95rem',
                                }}>
                                <UserPlus size={16} />
                                {form.processing ? 'Creating Account…' : 'Sign Up'}
                            </button>
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
                            <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border)' }} />
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>sudah memiliki akun?</span>
                            <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border)' }} />
                        </div>

                        <Link href="/login" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0.7rem', borderRadius: '99px', fontSize: '0.9rem',
                            fontWeight: 600, color: 'var(--color-primary)',
                            border: '1px solid var(--color-border)',
                            textDecoration: 'none', background: 'transparent',
                            transition: 'border-color 0.2s',
                        }}>
                            Masuk Kembali
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}