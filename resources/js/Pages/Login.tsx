import { FormEvent, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, HeartPulse, LogIn } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';
import type { SharedProps } from '../types';

export default function Login() {
    const { props } = usePage<SharedProps>();
    const form = useForm({ email: '', password: '', remember: false });
    const [showPassword, setShowPassword] = useState(false);

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/login');
    }

    return (
        <MainLayout>
            <Head title="Login" />

            <section style={{
                display: 'flex',
                alignItems: 'center',
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
                    }}>
                        {/* decorative circles */}
                        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                                <HeartPulse size={18} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                                    Secure access
                                </span>
                            </div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '1rem' }}>
                                Welcome back<br />to MedSync Clinic
                            </h1>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
                                Sign in to manage appointments, view records, and stay connected with your care team.
                            </p>
                        </div>

                        {/* trust badge — ganti seluruh bagian ini */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                            <div style={{ display: 'flex' }}>
                                {[
                                    { label: 'A', anim: 'floatA', delay: '0s' },
                                    { label: 'B', anim: 'floatB', delay: '0.4s' },
                                    { label: 'C', anim: 'floatC', delay: '0.8s' },
                                ].map(({ label, anim, delay }, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '30px', height: '30px', borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.18)',
                                            border: '1.5px solid rgba(255,255,255,0.3)',
                                            display: 'grid', placeItems: 'center',
                                            fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)',
                                            marginLeft: i === 0 ? 0 : '-8px',
                                            animation: `${anim} 3s ease-in-out infinite`,
                                            animationDelay: delay,
                                        }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                            <span style={{
                                fontSize: '0.78rem',
                                color: 'rgba(255,255,255,0.55)',
                                animation: 'fadePulse 3s ease-in-out infinite',
                            }}>
                                Trusted by 10,000+ patients
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
                        justifyContent: 'center',
                    }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.3rem' }}>
                            Sign in
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
                            Enter your credentials to continue
                        </p>

                        {props.flash?.error && (
                            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                                {props.flash.error}
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="filter-input"
                                    placeholder="you@example.com"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="filter-input"
                                        placeholder="••••••••"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        required
                                        style={{ width: '100%', paddingRight: '2.75rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '0.75rem', top: '50%',
                                            transform: 'translateY(-50%)', background: 'none',
                                            border: 'none', cursor: 'pointer',
                                            color: 'var(--color-text-muted)',
                                            display: 'flex', alignItems: 'center', padding: 0,
                                        }}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember + forgot */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(e) => form.setData('remember', e.target.checked)}
                                        style={{ accentColor: 'var(--color-primary)', width: '14px', height: '14px' }}
                                    />
                                    Remember me
                                </label>
                                <a href="#" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={form.processing}
                                style={{
                                    width: '100%', marginTop: '0.25rem',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.75rem', fontSize: '0.95rem',
                                }}
                            >
                                <LogIn size={16} />
                                {form.processing ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
                            <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border)' }} />
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>or continue with</span>
                            <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border)' }} />
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Don't have an account?{' '}
                            <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}