import { Music, Video, FileText, BookOpen, Users, Info, Briefcase, Mic } from 'lucide-react';
import Navigation from '../components/Navigation';
import MusicSection from '../components/sections/MusicSection';
import VideoSection from '../components/sections/VideoSection';
import WritingSection from '../components/sections/WritingSection';
import ResearchSection from '../components/sections/ResearchSection';
import SocialFeed from '../components/sections/SocialFeed';
import AboutSection from '../components/sections/AboutSection';
import CommissionSection from '../components/sections/CommissionSection';
import BriiiteBeSpittinPage from './BriiiteBeSpittinPage';
import TalkToBriiiteWidget from '../components/widgets/TalkToBriiiteWidget';
import GiftBucketWidget from '../components/widgets/GiftBucketWidget';
import Footer from '../components/Footer';
import type { Section } from '../App';

interface HomePageProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function HomePage({ activeSection, onSectionChange }: HomePageProps) {
  const navItems = [
    { id: 'about' as Section, label: 'About', icon: Info },
    { id: 'music' as Section, label: 'Music', icon: Music },
    { id: 'video' as Section, label: 'Video', icon: Video },
    { id: 'writing' as Section, label: 'Writing', icon: FileText },
    { id: 'research' as Section, label: 'Research', icon: BookOpen },
    { id: 'briiite-be-spittin' as Section, label: 'briiite be spittin\'', icon: Mic },
    { id: 'social' as Section, label: 'briiite about town', icon: Users },
    { id: 'commission' as Section, label: 'Commission Work', icon: Briefcase },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection />;
      case 'music':
        return <MusicSection />;
      case 'video':
        return <VideoSection />;
      case 'writing':
        return <WritingSection />;
      case 'research':
        return <ResearchSection />;
      case 'briiite-be-spittin':
        return <BriiiteBeSpittinPage />;
      case 'social':
        return <SocialFeed />;
      case 'commission':
        return <CommissionSection />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Main laundry sketch background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/laundry-sketch.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          opacity: 0.85
        }}
      />
      
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-white/80 pointer-events-none" />

      <div className="relative z-10">
        <header className="bg-black/95 backdrop-blur-sm border-b border-white/10 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <button
              onClick={() => onSectionChange('about')}
              className="hover:opacity-90 transition-opacity text-left"
              title="Go to Home"
            >
              <h1 className="text-4xl font-bold text-white tracking-tight">
                midnight<span className="text-emerald-500">Laundry</span>
              </h1>
              <p className="text-gray-300 text-sm mt-1">briiite's creative universe</p>
            </button>
          </div>
        </header>

        <Navigation
          items={navItems}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {renderSection()}
        </main>
      </div>

      <TalkToBriiiteWidget />
      <GiftBucketWidget />
      <Footer />
    </div>
  );
}
