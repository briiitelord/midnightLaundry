import { useEffect } from 'react';
import { Users } from 'lucide-react';

export default function SocialFeed() {
  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-emerald-700" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">briiite about town</h2>
            <p className="text-gray-700 text-sm">
              Latest posts from across social media
            </p>
          </div>
        </div>
      </div>

      {/* Elfsight Social Feed Widget */}
      <div className="elfsight-app-f372d638-6085-46cb-98c0-b228830f80e2" data-elfsight-app-lazy></div>
    </div>
  );
}
