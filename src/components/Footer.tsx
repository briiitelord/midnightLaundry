import { useState } from 'react';
import LegalDocumentView from './LegalDocumentView';

export default function Footer() {
  const [legalModalSlug, setLegalModalSlug] = useState<string | null>(null);

  return (
    <>
      <footer className="relative bg-cover bg-center border-t border-white/10 mt-16" style={{ backgroundImage: 'url(/nebula-bg.jpg)' }}>
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-black/85"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                midnight<span className="text-forest-300">Laundry</span>
              </h3>
              <p className="text-sm text-gray-400">
                briiite's creative universe
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-forest-300 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#music" className="text-gray-400 hover:text-forest-300 transition-colors">
                    Music
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-forest-300 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setLegalModalSlug('public-license-notice')}
                    className="text-gray-400 hover:text-forest-300 transition-colors text-left"
                  >
                    Public License Notice
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModalSlug('limited-creative-use-license')}
                    className="text-gray-400 hover:text-forest-300 transition-colors text-left"
                  >
                    Limited Creative Use License
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} midnightLaundry. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {legalModalSlug && (
        <LegalDocumentView
          slug={legalModalSlug}
          onClose={() => setLegalModalSlug(null)}
        />
      )}
    </>
  );
}
