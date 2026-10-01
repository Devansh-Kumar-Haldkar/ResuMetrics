import React, { useState } from 'react';
import { Copy, Check, Download, Edit3, Eye, Printer } from 'lucide-react';

interface ResumeEditorViewProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  targetRole: string;
  onDownloadPdf?: () => void;
}

export const ResumeEditorView: React.FC<ResumeEditorViewProps> = ({
  resumeText,
  setResumeText,
  targetRole,
  onDownloadPdf,
}) => {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([resumeText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Optimized_Resume_${targetRole.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const estimatedReadingTime = Math.ceil(wordCount / 200);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Resume Document View & Export</span>
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="font-mono tabular-nums">{wordCount} words</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">~{estimatedReadingTime} min recruiter read time</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 mr-2 border border-slate-200">
            <button
              onClick={() => setMode('preview')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="h-3 w-3 inline mr-1" />
              Preview
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="h-3 w-3 inline mr-1" />
              Edit Text
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 bg-white transition-colors cursor-pointer shadow-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 bg-white transition-colors cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export .MD</span>
          </button>

          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Download as PDF</span>
            </button>
          )}
        </div>
      </div>

      {mode === 'preview' ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
          {resumeText}
        </div>
      ) : (
        <textarea
          rows={16}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
      )}
    </div>
  );
};
