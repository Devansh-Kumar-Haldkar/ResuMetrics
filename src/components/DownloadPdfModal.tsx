import React from 'react';
import { Download, FileText, CheckCircle2, Printer, X, ShieldCheck } from 'lucide-react';

interface DownloadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerPrint: () => void;
  candidateName: string;
  targetRole: string;
  overallScore: number;
}

export const DownloadPdfModal: React.FC<DownloadPdfModalProps> = ({
  isOpen,
  onClose,
  onTriggerPrint,
  candidateName,
  targetRole,
  overallScore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 no-print">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Download as PDF
              </h3>
              <p className="text-xs text-slate-500">
                Generate a professionally formatted PDF report using your browser's print engine.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Report Overview Preview Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5 text-xs text-slate-700">
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-500">Document Type:</span>
            <span className="font-semibold text-slate-900">Executive ATS Diagnostic & Resume</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-500">Candidate:</span>
            <span className="font-semibold text-slate-900">{candidateName || 'Candidate'}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-500">Target Role:</span>
            <span className="font-semibold text-indigo-700">{targetRole}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-500">Overall ATS Score:</span>
            <span className="font-mono font-bold text-indigo-600">{overallScore}/100</span>
          </div>
        </div>

        {/* PDF Instructions Box */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-indigo-950 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>Browser Print Dialog Tips:</span>
          </div>
          <ul className="space-y-1.5 text-slate-700 pl-1">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Set <strong>Destination</strong> to <strong>Save as PDF</strong>.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Enable <strong>Background graphics</strong> in print options to preserve colored badges and benchmark charts.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Headers and footers are automatically optimized for a crisp multi-page document layout.</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              setTimeout(() => onTriggerPrint(), 150);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Open Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
