import { LucideIcon } from 'lucide-react';
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
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
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
                      ? 'text-emerald-700 border-emerald-600 bg-emerald-50/50'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
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
