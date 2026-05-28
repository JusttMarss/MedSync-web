import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';

interface PageModule {
    default: ComponentType<Record<string, unknown>>;
}

createInertiaApp({
    title: (title: string) => (title ? `${title} — MedSync Pro` : 'MedSync Pro'),
    resolve: (name: string) => {
        const pages = import.meta.glob<PageModule>('./Pages/**/*.tsx', { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
