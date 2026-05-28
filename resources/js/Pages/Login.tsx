import { FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import type { SharedProps } from '../types';

export default function Login() {
    const { props } = usePage<SharedProps>();
    const form = useForm({ email: '', password: '', remember: false });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/login');
    }

    return (
        <MainLayout>
            <Head title="Login" />

            <section className="auth-shell">
                <div className="auth-panel">
                    <div className="auth-panel-copy">
                        <p className="eyebrow">Secure access</p>
                        <h1>Welcome back to MedSync Clinic</h1>
                        <p>Sign in to manage appointments, view records, and stay connected with your care team.</p>
                    </div>
                    <div className="auth-card auth-card-wide">
                        <h2>Sign in</h2>
                        {props.flash?.error && <div className="alert alert-danger">{props.flash.error}</div>}
                        <form onSubmit={submit} className="form-grid">
                            <label>
                                Email
                                <input
                                    type="email"
                                    className="filter-input"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                Password
                                <input
                                    type="password"
                                    className="filter-input"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    required
                                />
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={(e) => form.setData('remember', e.target.checked)}
                                />
                                Remember me
                            </label>

                            <div style={{ marginTop: '1rem' }}>
                                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Sign In</button>
                            </div>
                        </form>
                        <div className="auth-footer">
                            <p>Don't have an account? <Link href="/register" className="link">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
