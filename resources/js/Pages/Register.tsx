import { FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import type { SharedProps } from '../types';

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

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/register');
    }

    return (
        <MainLayout>
            <Head title="Sign Up" />

            <section className="auth-shell auth-shell-hero">
                <div className="auth-panel auth-panel-hero">
                    <div className="auth-panel-copy">
                        <p className="eyebrow">Create Account</p>
                        <h1>Your health journey, modernized and secure.</h1>
                        <p>Join MedSync Clinic to manage your appointments, access records, and communicate with your healthcare team in a unified, secure portal.</p>
                    </div>
                    <div className="auth-card auth-card-wide">
                        <h2>Create Account</h2>
                        {props.flash?.error && <div className="alert alert-danger">{props.flash.error}</div>}
                        <form onSubmit={submit} className="form-grid">
                            <label>
                                Full Name
                                <input
                                    type="text"
                                    className="filter-input"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                Email Address
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

                            <label>
                                Confirm Password
                                <input
                                    type="password"
                                    className="filter-input"
                                    value={form.data.password_confirmation}
                                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                Date of Birth
                                <input
                                    type="date"
                                    className="filter-input"
                                    value={form.data.date_of_birth}
                                    onChange={(e) => form.setData('date_of_birth', e.target.value)}
                                />
                            </label>

                            <label>
                                Gender
                                <select
                                    className="filter-select"
                                    value={form.data.gender}
                                    onChange={(e) => form.setData('gender', e.target.value)}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </label>

                            <label>
                                Phone Number
                                <input
                                    type="tel"
                                    className="filter-input"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                />
                            </label>

                            <label>
                                Address
                                <textarea
                                    rows={3}
                                    className="filter-input"
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                />
                            </label>

                            <button className="btn btn-primary" type="submit">Sign Up</button>
                        </form>
                        <div className="auth-footer">
                            <p>Already have an account? <Link href="/login" className="link">Sign in</Link></p>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
