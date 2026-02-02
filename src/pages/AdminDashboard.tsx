import { useState } from 'react';
import { LogOut, Music, Video, FileText, BookOpen, MessageSquare, Gift, FileQuestion, Scale } from 'lucide-react';
import AdminMusicManager from '../components/admin/AdminMusicManager';
import AdminVideoManager from '../components/admin/AdminVideoManager';
import AdminWritingManager from '../components/admin/AdminWritingManager';
import AdminResearchManager from '../components/admin/AdminResearchManager';
import AdminSocialManager from '../components/admin/AdminSocialManager';
import AdminInquiriesManager from '../components/admin/AdminInquiriesManager';
import AdminMessagesManager from '../components/admin/AdminMessagesManager';
import AdminGiftsManager from '../components/admin/AdminGiftsManager';
import AdminLegalManager from '../components/admin/AdminLegalManager';

export type AdminSection = 'music' | 'video' | 'writing' | 'research' | 'social' | 'inquiries' | 'messages' | 'gifts' | 'legal';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('music');

  const adminItems = [
    { id: 'music' as AdminSection, label: 'Music', icon: Music },
    { id: 'video' as AdminSection, label: 'Videos', icon: Video },
    { id: 'writing' as AdminSection, label: 'Writing', icon: FileText },
    { id: 'research' as AdminSection, label: 'Research', icon: BookOpen },
    { id: 'social' as AdminSection, label: 'Social Posts', icon: MessageSquare },
    { id: 'inquiries' as AdminSection, label: 'Commissions', icon: FileQuestion },
    { id: 'messages' as AdminSection, label: 'Messages', icon: MessageSquare },
    { id: 'gifts' as AdminSection, label: 'Gifts', icon: Gift },
    { id: 'legal' as AdminSection, label: 'Legal', icon: Scale },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'music':
        return <AdminMusicManager />;
      case 'video':
        return <AdminVideoManager />;
      case 'writing':
        return <AdminWritingManager />;
      case 'research':
        return <AdminResearchManager />;
      case 'social':
        return <AdminSocialManager />;
      case 'inquiries':
        return <AdminInquiriesManager />;
      case 'messages':
        return <AdminMessagesManager />;
      case 'gifts':
        return <AdminGiftsManager />;
      case 'legal':
        return <AdminLegalManager />;
      default:
        return <AdminMusicManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              midnight<span className="text-emerald-500">Laundry</span>
            </h1>
            <p className="text-gray-400 text-sm">Web Manager Dashboard</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-800/50 border-r border-gray-700 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeSection === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
