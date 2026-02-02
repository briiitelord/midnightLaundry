import { Music, Video, FileText, BookOpen, Users, Info, Briefcase } from 'lucide-react';
import Navigation from '../components/Navigation';
import MusicSection from '../components/sections/MusicSection';
import VideoSection from '../components/sections/VideoSection';
import WritingSection from '../components/sections/WritingSection';
import ResearchSection from '../components/sections/ResearchSection';
import SocialFeed from '../components/sections/SocialFeed';
import AboutSection from '../components/sections/AboutSection';
import CommissionSection from '../components/sections/CommissionSection';
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
      case 'social':
        return <SocialFeed />;
      case 'commission':
        return <CommissionSection />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />

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
