import React from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyzer' | 'trend' | 'skills' | 'bullets' | 'interview' | 'roadmap';
  setActiveTab: (tab: 'analyzer' | 'trend' | 'skills' | 'bullets' | 'interview' | 'roadmap') => void;
  onReset: () => void;
  onPrint: () => void;
  hasAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  onPrint,
  hasAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 shadow-xs backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            className="text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-indigo-600"
          >
            ResuMetrics
          </a>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-500 border-l border-slate-200 pl-3">
            Resume & Skill Gap Intelligence
          </span>
        </div>

        {/* Zone 2: clean text navigation links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'analyzer'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'trend'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ATS Trend
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Skills & Gaps
          </button>
          <button
            onClick={() => setActiveTab('bullets')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'bullets'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Bullet Optimizer
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'interview'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Interview Simulator
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Upskill Roadmap
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasAnalysis && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 bg-white transition-colors cursor-pointer"
              title="New Analysis"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          )}
          {hasAnalysis && (
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download as PDF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
