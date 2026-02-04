import { useState, useEffect } from 'react';
import { AlertTriangle, Download, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type ErrorLog = Database['public']['Tables']['error_logs']['Row'];

export default function AdminSiteFailManager() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
    
    // Real-time subscription for new errors
    const subscription = supabase
      .channel('error_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'error_logs',
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete ALL error logs? This cannot be undone.')) {
      const { error } = await supabase
        .from('error_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (!error) {
        fetchLogs();
      }
    }
  };

  const handleDeleteOne = async (id: string) => {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchLogs();
    }
  };

  const handleDownloadLogs = () => {
    // Create RTF content
    let rtfContent = '{\\rtf1\\ansi\\deff0\n';
    rtfContent += '{\\fonttbl{\\f0 Courier New;}}\n';
    rtfContent += '{\\colortbl;\\red255\\green0\\blue0;\\red0\\green0\\blue255;}\n';
    rtfContent += '\\f0\\fs20\n';
    rtfContent += '{\\b\\fs32 midnightLaundry Site Error Log Report}\\par\n';
    rtfContent += `{\\i Generated: ${new Date().toLocaleString()}}\\par\\par\n`;
    rtfContent += `{\\b Total Errors:} ${logs.length}\\par\\par\n`;
    rtfContent += '\\line\\line\n';

    logs.forEach((log, index) => {
      const timestamp = new Date(log.created_at).toLocaleString();
      rtfContent += `{\\b\\cf1 [ERROR ${index + 1}]}\\par\n`;
      rtfContent += `{\\b Timestamp:} ${timestamp}\\par\n`;
      if (log.error_type) {
        rtfContent += `{\\b Type:} ${log.error_type}\\par\n`;
      }
      rtfContent += `{\\b Message:} ${log.error_message.replace(/[\\{}]/g, '')}\\par\n`;
      if (log.page_url) {
        rtfContent += `{\\b Page URL:} {\\cf2 ${log.page_url}}\\par\n`;
      }
      if (log.error_stack) {
        rtfContent += `{\\b Stack Trace:}\\par\n`;
        rtfContent += `${log.error_stack.replace(/[\\{}]/g, '').substring(0, 500)}...\\par\n`;
      }
      if (log.user_agent) {
        rtfContent += `{\\b User Agent:} ${log.user_agent.substring(0, 100)}\\par\n`;
      }
      rtfContent += '\\line\\line\n';
    });

    rtfContent += '}';

    // Create blob and download
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-errors-${new Date().toISOString().split('T')[0]}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.error_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.page_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Site Fail Logs</h2>
          <p className="text-gray-400 text-sm mt-1">
            Track and manage site errors ({logs.length} total)
          </p>
        </div>
        <div className="flex gap-3">
          {logs.length > 0 && (
            <>
              <button
                onClick={handleDownloadLogs}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Download RTF
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by error message, type, or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">
              {searchTerm ? 'No matching error logs found.' : 'No error logs recorded yet. 🎉'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-xs text-red-300">
                      {formatTimestamp(log.created_at)}
                    </span>
                    {log.error_type && (
                      <span className="text-xs px-2 py-0.5 bg-red-800/50 text-red-300 rounded">
                        {log.error_type}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white font-medium mb-2 break-words">
                    {log.error_message}
                  </p>

                  {log.page_url && (
                    <p className="text-xs text-gray-400 mb-1 break-all">
                      <span className="font-semibold">Page:</span> {log.page_url}
                    </p>
                  )}

                  {log.error_stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                        View Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs bg-black/30 p-3 rounded overflow-x-auto text-gray-300">
                        {log.error_stack}
                      </pre>
                    </details>
                  )}

                  {log.user_agent && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      <span className="font-semibold">User Agent:</span> {log.user_agent}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteOne(log.id)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
