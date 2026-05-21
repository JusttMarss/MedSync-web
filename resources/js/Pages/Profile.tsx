import MainLayout from '../Layouts/MainLayout';
import { Head } from '@inertiajs/react';

interface ProfileProps {
    user: any;
    patient: any;
}

export default function Profile({ user, patient }: ProfileProps) {
    return (
        <MainLayout>
            <Head title="Profile" />

            <section className="section page-section">
                <div className="section-header split-header">
                    <div>
                        <h2>Profile Settings</h2>
                        <p>Manage your personal information and account security.</p>
                    </div>
                    <button className="btn btn-primary">Update Profile</button>
                </div>

                <div className="profile-grid">
                    <div className="feature-card profile-card">
                        <div className="profile-card-header">
                            <div className="profile-avatar">{user?.name?.charAt(0)}</div>
                            <div>
                                <h3>{user?.name}</h3>
                                <p className="text-secondary">Patient</p>
                            </div>
                        </div>
                        <div className="profile-info">
                            <div><span>Email</span><strong>{user?.email ?? '-'}</strong></div>
                            <div><span>Date of Birth</span><strong>{patient?.date_of_birth ?? '-'}</strong></div>
                            <div><span>Gender</span><strong>{patient?.gender ?? '-'}</strong></div>
                            <div><span>Phone</span><strong>{patient?.phone ?? '-'}</strong></div>
                            <div><span>Address</span><strong>{patient?.address ?? '-'}</strong></div>
                        </div>
                    </div>

                    <div className="feature-card profile-card-secondary">
                        <h3>Account Security</h3>
                        <div className="security-row">
                            <span>Email Address</span>
                            <strong>{user?.email}</strong>
                        </div>
                        <div className="security-row">
                            <span>Password</span>
                            <button className="btn btn-outline btn-sm">Change Password</button>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
