import { useState, useEffect } from 'react';
import { Users, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type SocialPost = Database['public']['Tables']['social_posts']['Row'];

export default function SocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialPosts();

    const subscription = supabase
      .channel('social_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_posts',
        },
        () => {
          fetchSocialPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSocialPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('posted_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

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

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No social posts available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {post.platform.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 capitalize">
                        {post.platform}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(post.posted_at)}
                      </div>
                    </div>
                  </div>

                  <a
                    href={post.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                <a
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
                >
                  View on {post.platform} →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
