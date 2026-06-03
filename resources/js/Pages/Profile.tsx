import MainLayout from '../Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface ProfileProps {
    user: any;
    patient: any;
}

export default function Profile({ user, patient }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        date_of_birth: patient?.date_of_birth || '',
        gender: patient?.gender || '',
        phone: patient?.phone || '',
        address: patient?.address || '',
    });

    const getInitial = (name?: string) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    const formatValue = (value: any, fallback = '-') => {
        if (!value) return fallback;
        return value;
    };

    function handleSave(e: any) {
        e.preventDefault();

        form.put('/profile/update', {
            onSuccess: () => setIsEditing(false),
        });
    }

    function handleCancel() {
        setIsEditing(false);

        form.setData({
            name: user?.name || '',
            email: user?.email || '',
            date_of_birth: patient?.date_of_birth || '',
            gender: patient?.gender || '',
            phone: patient?.phone || '',
            address: patient?.address || '',
        });
    }

    return (
        <MainLayout>
            <Head title="Profile" />

            <section className="section page-section">

                {/* HEADER */}
                <div className="section-header text-center">
                    <div>
                        <h2>Profile Settings</h2>
                        <p>Manage your personal information and account security.</p>
                    </div>
                </div>

                {/* BUTTON */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                    {!isEditing ? (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="btn btn-success"
                                onClick={handleSave}
                                disabled={form.processing}
                            >
                                Save
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-grid">

                    {/* PROFILE CARD */}
                    <div className="feature-card profile-card">

                        {/* HEADER AVATAR */}
                        <div
                            className="profile-card-header"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px'
                            }}
                        >
                            <div
                                className="profile-avatar"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '18px'
                                }}
                            >
                                {getInitial(form.data.name)}
                            </div>

                            <div style={{ lineHeight: '1.2', textAlign: 'left' }}>
                                <h3 style={{ margin: 0 }}>
                                    {isEditing ? form.data.name : user?.name ?? 'Unknown User'}
                                </h3>
                                <small style={{ color: '#999' }}>Patient</small>
                            </div>
                        </div>

                        {/* PROFILE INFO (VIEW + EDIT TOGGLE) */}
                        <form onSubmit={handleSave} className="profile-info">

                            {/* EMAIL */}
                            <div>
                                <span>Email</span>
                                {!isEditing ? (
                                    <strong>{formatValue(user?.email)}</strong>
                                ) : (
                                    <input
                                        style={{ textAlign: 'right', width: '100%' }}
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                    />
                                )}
                            </div>

                            {/* DOB */}
                            <div>
                                <span>Date of Birth</span>
                                {!isEditing ? (
                                    <strong>{formatValue(patient?.date_of_birth)}</strong>
                                ) : (
                                    <input
                                        type="date"
                                        value={form.data.date_of_birth}
                                        onChange={(e) => form.setData('date_of_birth', e.target.value)}
                                    />
                                )}
                            </div>

                            {/* GENDER */}
                            <div>
                                <span>Gender</span>
                                {!isEditing ? (
                                    <strong>{formatValue(patient?.gender)}</strong>
                                ) : (
                                    <select
                                        value={form.data.gender}
                                        onChange={(e) => form.setData('gender', e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                )}
                            </div>

                            {/* PHONE */}
                            <div>
                                <span>Phone</span>
                                {!isEditing ? (
                                    <strong>{formatValue(patient?.phone)}</strong>
                                ) : (
                                    <input
                                        style={{ textAlign: 'right', width: '100%' }}
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                    />
                                )}
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <span>Address</span>
                                {!isEditing ? (
                                    <strong>{formatValue(patient?.address)}</strong>
                                ) : (
                                    <textarea
                                        style={{ textAlign: 'right', width: '100%' }}
                                        value={form.data.address}
                                        onChange={(e) => form.setData('address', e.target.value)}
                                    />
                                )}
                            </div>

                        </form>
                    </div>

                    {/* SECURITY CARD */}
                    <div className="feature-card profile-card-secondary">
                        <h3>Account Security</h3>

                        <div className="security-row">
                            <span>Email Address</span>
                            <strong>{user?.email}</strong>
                        </div>

                        <div className="security-row">
                            <span>Password</span>
                            <button className="btn btn-outline btn-sm">
                                Change Password
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </MainLayout>
    );
}