import { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, X, Download, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type ResearchPaper = Database['public']['Tables']['research_papers']['Row'];
type ResearchCitation = Database['public']['Tables']['research_citations']['Row'];

interface PaperWithCitations extends ResearchPaper {
  citations: ResearchCitation[];
}

export default function ResearchSection() {
  const [papers, setPapers] = useState<PaperWithCitations[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPapers, setExpandedPapers] = useState<Set<string>>(new Set());
  const [viewingPaper, setViewingPaper] = useState<ResearchPaper | null>(null);

  useEffect(() => {
    fetchResearchPapers();
  }, []);

  const fetchResearchPapers = async () => {
    setLoading(true);

    const { data: papersData, error: papersError } = await supabase
      .from('research_papers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!papersError && papersData) {
      const papersWithCitations = await Promise.all(
        papersData.map(async (paper) => {
          const { data: citationsData } = await supabase
            .from('research_citations')
            .select('*')
            .eq('research_paper_id', paper.id)
            .order('order_index', { ascending: true });

          return {
            ...paper,
            citations: citationsData || [],
          };
        })
      );

      setPapers(papersWithCitations);
    }
    setLoading(false);
  };

  const toggleCitations = (paperId: string) => {
    setExpandedPapers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(paperId)) {
        newSet.delete(paperId);
      } else {
        newSet.add(paperId);
      }
      return newSet;
    });
  };

  const handleDownload = async (paper: ResearchPaper) => {
    if (!paper.file_url) return;

    try {
      // Fetch the file
      const response = await fetch(paper.file_url);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from title (sanitize for filesystem) and preserve extension
      const urlPath = new URL(paper.file_url).pathname;
      const extension = urlPath.substring(urlPath.lastIndexOf('.'));
      const filename = `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${extension}`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(paper.file_url, '_blank');
    }
  };

  const isPDF = (url: string | null): boolean => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.pdf') || lowerUrl.includes('.pdf?');
  };

  const handleViewClick = (paper: ResearchPaper) => {
    if (isPDF(paper.file_url)) {
      // Only open viewer modal for PDFs
      setViewingPaper(paper);
    } else {
      // For non-PDF files (.doc, .docx, etc.), download directly
      handleDownload(paper);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-6 border border-emerald-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Archive</h2>
        <p className="text-gray-700">
          Academic works, studies, and research documents with complete citations
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading research papers...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No research papers available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => {
            const isExpanded = expandedPapers.has(paper.id);
            return (
              <div
                key={paper.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {paper.title}
                      </h3>
                      {paper.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {paper.description}
                        </p>
                      )}
                    </div>
                    <FileText className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleViewClick(paper)}
                      className="px-5 py-2 bg-forest bg-cover text-white rounded-lg border-2 border-forest-800 hover:opacity-90 transition-all font-semibold text-sm shadow-lg flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isPDF(paper.file_url) ? 'View PDF' : 'View Document'}</span>
                    </button>

                    {paper.file_url && isPDF(paper.file_url) && (
                      <button
                        onClick={() => handleDownload(paper)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg border-2 border-emerald-700 transition-all font-semibold text-sm shadow-lg flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    )}

                    {paper.citations.length > 0 && (
                      <button
                        onClick={() => toggleCitations(paper.id)}
                        className="px-5 py-2 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-forest-600 hover:text-forest-700 transition-all font-semibold text-sm flex items-center space-x-2"
                      >
                        <span>Citations ({paper.citations.length})</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {isExpanded && paper.citations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">
                        Citations
                      </h4>
                      <ol className="space-y-3 list-decimal list-inside">
                        {paper.citations.map((citation, index) => (
                          <li
                            key={citation.id}
                            className="text-sm text-gray-700 leading-relaxed pl-2"
                          >
                            <span className="font-medium">[{index + 1}]</span>{' '}
                            {citation.citation_text}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingPaper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {viewingPaper.title}
                </h3>
                {viewingPaper.description && (
                  <p className="text-sm text-gray-600 truncate">
                    {viewingPaper.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleDownload(viewingPaper)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex-shrink-0 text-white"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                {viewingPaper.file_url && (
                  <a
                    href={viewingPaper.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={() => setViewingPaper(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  title="Close"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-100 relative">
              {viewingPaper.file_url ? (
                <>
                  <iframe
                    src={`${viewingPaper.file_url}#view=FitH`}
                    className="w-full h-full border-0"
                    title={viewingPaper.title}
                  />
                  {/* Fallback message for browsers that don't support PDF embedding */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
                      <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-700 mb-4">
                        If the PDF doesn't display, you can:
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleDownload(viewingPaper)}
                          className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download PDF</span>
                        </button>
                        <a
                          href={viewingPaper.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-center"
                        >
                          Open in New Tab
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">PDF not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                💡 Tip: Use the controls above to download or open in a new tab
              </p>
              <button
                onClick={() => setViewingPaper(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-semibold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
