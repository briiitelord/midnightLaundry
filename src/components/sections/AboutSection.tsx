import MediaCarousel from '../widgets/MediaCarousel';

export default function AboutSection() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 p-8 shadow-sm">
        <div className="space-y-6 text-gray-800">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About <span className="text-emerald-600">midnightLaundry</span>
            </h2>
            <p className="text-lg leading-relaxed">
              midnightLaundry is the creative universe of <a href="https://linktree.com/briiitelord" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">briiite</a>, and the many partnerships and collaborations to follow.
            </p>
          </div>

          <p className="text-lg leading-relaxed">
            Genuinely hope that in exploring the music, writing, and general vibes we can start to bring back safe digital third places where personality, projection, imagination, reality, and creativity converge.
          </p>

          <div className="pt-4 border-t border-gray-300">
            <p className="text-xl font-semibold text-emerald-600">
              Welcome…to midnightLaundry.
            </p>
          </div>
        </div>
      </div>

      {/* Media Carousel */}
      <MediaCarousel />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200 p-6">
          <h3 className="font-bold text-emerald-900 mb-2">Music</h3>
          <p className="text-sm text-emerald-800">Explore diverse sounds and creative expressions</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200 p-6">
          <h3 className="font-bold text-purple-900 mb-2">Writing</h3>
          <p className="text-sm text-purple-800">Discover poetry, stories, and creative prose</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-bold text-blue-900 mb-2">Community</h3>
          <p className="text-sm text-blue-800">Connect in a safe digital creative space</p>
        </div>
      </div>
    </div>
  );
}
