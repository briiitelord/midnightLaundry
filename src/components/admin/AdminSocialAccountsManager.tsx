import { useState, useEffect } from 'react';
import { Twitter, Instagram, Video, Linkedin, Facebook, Plus, Trash2, RefreshCw, ExternalLink, Power, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Platform = 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook';

type SocialAccount = {
  id: string;
  platform: Platform;
  account_name: string;
  account_url: string;
  is_active: boolean;
  auto_sync: boolean;
  last_synced_at: string | null;
  sync_frequency_minutes: number;
  created_at: string;
  updated_at: string;
};

const platformIcons: Record<Platform, any> = {
  twitter: Twitter,
  instagram: Instagram,
  tiktok: Video,
  youtube: Video,
  linkedin: Linkedin,
  facebook: Facebook,
};

const platformColors: Record<Platform, string> = {
  twitter: 'bg-sky-500',
  instagram: 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
  linkedin: 'bg-blue-700',
  facebook: 'bg-blue-600',
};

export default function AdminSocialAccountsManager() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [accountName, setAccountName] = useState('');
  const [accountUrl, setAccountUrl] = useState('');
  const [syncFrequency, setSyncFrequency] = useState(30);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching accounts:', error);
        setErrorMessage('Failed to load social accounts');
        return;
      }

      setAccounts(data || []);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to load social accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountName.trim() || !accountUrl.trim()) {
      setErrorMessage('Please provide account name and URL');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase
        .from('social_accounts')
        .insert({
          platform,
          account_name: accountName.trim(),
          account_url: accountUrl.trim(),
          sync_frequency_minutes: syncFrequency,
          is_active: true,
          auto_sync: true,
        });

      if (error) {
        console.error('Error adding account:', error);
        throw error;
      }

      setSuccessMessage('Social account added successfully!');
      setAccountName('');
      setAccountUrl('');
      setShowAddForm(false);
      await fetchAccounts();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add social account. It may already exist.');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling account:', error);
        setErrorMessage('Failed to update account');
        return;
      }

      setSuccessMessage(`Account ${!currentStatus ? 'activated' : 'deactivated'}`);
      await fetchAccounts();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update account');
    }
  };

  const toggleAutoSync = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ auto_sync: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling auto-sync:', error);
        setErrorMessage('Failed to update auto-sync');
        return;
      }

      setSuccessMessage(`Auto-sync ${!currentStatus ? 'enabled' : 'disabled'}`);
      await fetchAccounts();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update auto-sync');
    }
  };

  const handleDelete = async (id: string, accountName: string) => {
    if (!confirm(`Are you sure you want to delete @${accountName}?`)) return;

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting account:', error);
        setErrorMessage('Failed to delete account');
        return;
      }

      setSuccessMessage('Account deleted successfully');
      await fetchAccounts();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete account');
    }
  };

  const formatLastSynced = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-slate-500">Loading social accounts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Social Media Accounts</h2>
          <p className="text-slate-600 text-sm mt-1">Manage connected social media accounts for auto-sync</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Add Account Form */}
      {showAddForm && (
        <form onSubmit={handleAddAccount} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Add New Social Account</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            >
              <option value="twitter">Twitter/X</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Name/Handle</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              placeholder="@username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Profile URL</label>
            <input
              type="url"
              value={accountUrl}
              onChange={(e) => setAccountUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              placeholder="https://twitter.com/username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sync Frequency (minutes)</label>
            <input
              type="number"
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              min="5"
              max="1440"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Accounts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Connected Accounts ({accounts.length})
        </h3>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600">No social accounts connected yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const Icon = platformIcons[account.platform];
              const colorClass = platformColors[account.platform];

              return (
                <div
                  key={account.id}
                  className={`bg-white rounded-lg border-2 p-4 transition-colors ${
                    account.is_active ? 'border-green-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{account.account_name}</h4>
                          {account.is_active && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Active</span>
                          )}
                          {account.auto_sync && (
                            <span title="Auto-sync enabled">
                              <RefreshCw className="w-4 h-4 text-blue-500" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                          <span className="capitalize">{account.platform}</span>
                          <span>Sync: {account.sync_frequency_minutes}min</span>
                          <span>Last: {formatLastSynced(account.last_synced_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={account.account_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Open profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => toggleAutoSync(account.id, account.auto_sync)}
                        className={`p-2 rounded transition-colors ${
                          account.auto_sync
                            ? 'text-blue-600 hover:bg-blue-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={account.auto_sync ? 'Disable auto-sync' : 'Enable auto-sync'}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleActive(account.id, account.is_active)}
                        className={`p-2 rounded transition-colors ${
                          account.is_active
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={account.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(account.id, account.account_name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Auto-Sync Information:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Auto-sync requires API integration for each platform</li>
          <li>Currently, posts must be manually added via the Social Posts manager</li>
          <li>Future updates will enable automatic fetching from connected accounts</li>
          <li>Sync frequency determines how often posts are checked (when enabled)</li>
        </ul>
      </div>
    </div>
  );
}
