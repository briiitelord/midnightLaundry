import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  isLoading?: boolean;
}

export default function AdminLogin({ onLogin, isLoading = false }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter a password');
      return;
    }
    setError('');
    onLogin(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-emerald-600/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              midnight<span className="text-emerald-500">Laundry</span>
            </h1>
            <p className="text-gray-400 mt-2">Web Manager Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition"
            >
              {isLoading ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            This is a secure admin area. Please use your admin credentials to proceed.
          </p>
        </div>
      </div>
    </div>
  );
}
