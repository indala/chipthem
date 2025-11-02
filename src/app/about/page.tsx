import AboutHero from '@/components/AboutHero';
import AboutQuickActions from '@/components/AboutQuickActions';
import AdditionalServices from '@/components/AdditionalServices';
import PetProtectionSteps from '@/components/PetProtectionSteps';
import AboutProvenResults from '@/components/AboutProvenResults';
import ChipthemFeatures from '@/components/ChipthemFeatures';
import PetProtectionSection from '@/components/PetProtectionSection';
export default function AboutPage() {
    return (
        <div>
            <AboutHero />
            <AboutQuickActions />
            <AdditionalServices />
            <PetProtectionSteps />
            <AboutProvenResults />
            <ChipthemFeatures />
            <PetProtectionSection />
        </div>
    );
}