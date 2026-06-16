/** Shared TypeScript interfaces for the Healthcare App */

export interface Doctor {
    id: number;
    name: string;
    email?: string;
    specialization: string;
    phone?: string;
    bio?: string;
    avatar_url?: string;
}

export interface Stats {
    doctors: number;
    patients: number;
    appointments: number;
}

export interface SharedProps extends Record<string, unknown> {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            avatar_url?: string;
        } | null;
    };
    flash?: {
        success?: string;
        error?: string;
        info?: string;
    };
    appName: string;
}
