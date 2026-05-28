import { usePage } from '@inertiajs/react';
import type { SharedProps } from '../types';

export default function Topbar() {
    const { props } = usePage<SharedProps>();

    return (
        <header className="app-topbar">
            <div>
                <span className="app-breadcrumb">Welcome back,</span>
                <h1 className="app-topbar-title">{props.auth.user?.name}</h1>
            </div>
            <div className="app-user-chip">{props.auth.user?.email}</div>
        </header>
    );
}
