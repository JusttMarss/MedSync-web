import { usePage } from '@inertiajs/react';
import type { SharedProps } from '../types';

export default function FlashMessages() {
    const { props } = usePage<SharedProps>();

    if (!props.flash?.success && !props.flash?.error) {
        return null;
    }

    return (
        <>
            {props.flash?.success && <div className="alert alert-success">{props.flash.success}</div>}
            {props.flash?.error && <div className="alert alert-danger">{props.flash.error}</div>}
        </>
    );
}
