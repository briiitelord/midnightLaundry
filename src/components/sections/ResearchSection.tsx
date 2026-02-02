import { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
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
                    <a
                      href={paper.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm"
                    >
                      View PDF
                    </a>

                    {paper.citations.length > 0 && (
                      <button
                        onClick={() => toggleCitations(paper.id)}
                        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm flex items-center space-x-2"
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
    </div>
  );
}
