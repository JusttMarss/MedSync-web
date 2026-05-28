import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroSection from '../Components/HeroSection';
import StatsSection from '../Components/StatsSection';
import DoctorListSection from '../Components/DoctorListSection';
import type { Doctor, Stats } from '../types';

interface HomeProps {
    stats: Stats;
    featuredDoctors: Doctor[];
}

export default function Home({ stats, featuredDoctors }: HomeProps) {
    return (
        <MainLayout>
            <Head title="Home" />

            <HeroSection />
            <StatsSection stats={stats} />
            <DoctorListSection doctors={featuredDoctors} />
            
        </MainLayout>
    );
}
