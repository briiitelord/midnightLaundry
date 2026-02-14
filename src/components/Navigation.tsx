import { LucideIcon } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import type { Section } from '../App';

interface NavItem {
  id: Section;
  label: string;
  icon: LucideIcon;
}

interface NavigationProps {
  items: NavItem[];
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Navigation({ items, activeSection, onSectionChange }: NavigationProps) {
  const { settings } = useSiteSettings();
  
  return (
    <nav className="bg-cover bg-center border-b border-white/20 shadow-sm sticky top-0 z-40" style={{ backgroundImage: `url(${settings.header_image})` }}>
      {/* Dark overlay to make text readable */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex space-x-1 overflow-x-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  flex items-center space-x-2 px-6 py-4 font-semibold text-sm
                  transition-all duration-200 whitespace-nowrap border-b-2
                  ${
                    isActive
                      ? 'text-forest-300 border-forest-500 bg-forest-950/30'
                      : 'text-gray-300 border-transparent hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
