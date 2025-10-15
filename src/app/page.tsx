import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FavoritesSection } from '@/components/sections/FavoritesSection';

export default function Home() {
  return (
    <main className="bg-dark-bg">
      <HeroSection />
      <FavoritesSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
}
