import React, { useState } from 'react';
import { LinkedInImportResponse } from '../types/resume';
import {
  Link2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase,
  Code2,
  User,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface LinkedInProfileImporterProps {
  onProfileImported: (profile: {
    resumeText: string;
    targetRole: string;
    experienceLevel: 'entry' | 'mid' | 'senior' | 'lead_executive';
    candidateName: string;
  }) => void;
  onAutoAnalyze?: () => void;
  onClose?: () => void;
}

export const LinkedInProfileImporter: React.FC<LinkedInProfileImporterProps> = ({
  onProfileImported,
  onAutoAnalyze,
  onClose,
}) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<LinkedInImportResponse | null>(null);

  const sampleProfiles = [
    {
      title: 'Staff SRE / Cloud Architect',
      url: 'https://www.linkedin.com/in/alex-morrison-staff-devops',
      role: 'Staff SRE / Cloud Engineer',
      yoe: '11 YOE',
    },
    {
      title: 'Senior ML & AI Architect',
      url: 'https://www.linkedin.com/in/sarah-chen-ml-architect',
      role: 'Senior Machine Learning Engineer',
      yoe: '8 YOE',
    },
    {
      title: 'Director of Product Management',
      url: 'https://www.linkedin.com/in/david-ross-director-product',
      role: 'Director of Product',
      yoe: '10 YOE',
    },
    {
      title: 'Senior Distributed Systems Engineer',
      url: 'https://www.linkedin.com/in/marcus-vance-backend-go',
      role: 'Senior Backend Engineer',
      yoe: '7 YOE',
    },
  ];

  const handleFetchProfile = async (targetUrlOverride?: string) => {
    const urlToFetch = (targetUrlOverride || profileUrl).trim();

    if (!urlToFetch) {
      setError('Please enter or select a LinkedIn profile URL.');
      return;
    }

    if (!urlToFetch.toLowerCase().includes('linkedin.com/in/')) {
      setError('Invalid format: URL must include "linkedin.com/in/username".');
      return;
    }

    setError(null);
    setIsLoading(true);
    setImportedData(null);

    // Simulate multi-stage API extraction progress
    setLoadingStep('Connecting to public LinkedIn profile endpoint...');
    
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Parsing work experience history, company tenures & milestones...');
    }, 600);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Extracting technical skills, domain tools & credentials...');
    }, 1200);

    try {
      const res = await fetch('/api/import-linkedin-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: urlToFetch }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch public profile data.');
      }

      const data: LinkedInImportResponse = await res.json();
      setImportedData(data);
    } catch (err: any) {
      console.error('LinkedIn extraction failed:', err);
      setError(err.message || 'Network error while fetching LinkedIn profile data.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleApplyToResume = (triggerAnalysis: boolean = false) => {
    if (!importedData) return;

    onProfileImported({
      resumeText: importedData.resumeText,
      targetRole: importedData.targetRole,
      experienceLevel: importedData.experienceLevel,
      candidateName: importedData.candidateName,
    });

    if (triggerAnalysis && onAutoAnalyze) {
      setTimeout(() => {
        onAutoAnalyze();
      }, 250);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 shadow-xs space-y-6">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg shadow-xs">
            in
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>LinkedIn Profile Importer & Fast-Track Auditor</span>
              <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Simulated API
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Fetch public profile experience and skills to pre-populate resume analysis fields instantly.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer self-start sm:self-auto"
          >
            Close ✕
          </button>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* URL Input Form */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Paste Candidate LinkedIn Profile URL
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-indigo-600">
            <Link2 className="h-4 w-4" />
          </span>
          <input
            type="url"
            value={profileUrl}
            onChange={(e) => {
              setProfileUrl(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFetchProfile();
            }}
            placeholder="https://www.linkedin.com/in/username"
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-36 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-xs transition-colors"
          />
          <button
            type="button"
            onClick={() => handleFetchProfile()}
            disabled={isLoading || !profileUrl.trim()}
            className={`absolute right-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isLoading || !profileUrl.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Fetching...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Fetch Profile</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Simulated Multi-Stage Loading Progress */}
      {isLoading && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <span>{loadingStep || 'Querying LinkedIn Public Data...'}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-indigo-100 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Preset Fast-Track Sample Profiles */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          One-Click Test Profiles (Instant Auto-Populate):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {sampleProfiles.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setProfileUrl(sample.url);
                handleFetchProfile(sample.url);
              }}
              disabled={isLoading}
              className="flex flex-col text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all cursor-pointer shadow-xs group"
            >
              <span className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {sample.title}
              </span>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span className="truncate max-w-[120px]">{sample.role}</span>
                <span className="font-mono text-indigo-700 font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                  {sample.yoe}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Profile Preview Card */}
      {importedData && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/50 p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs">
                {importedData.candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{importedData.candidateName}</span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Public Data
                  </span>
                </h4>
                <div className="text-xs text-slate-600">
                  {importedData.currentTitle} · {importedData.location}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">
                Detected Experience
              </span>
              <span className="text-sm font-mono font-bold text-indigo-700">
                ~{importedData.detectedExperienceYears} Years ({importedData.experienceLevel})
              </span>
            </div>
          </div>

          {/* Quick Data Grid (Extracted Skills & Experience Preview) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Extracted Skills */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                <Code2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Extracted Technical Competencies ({importedData.extractedSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {importedData.extractedSkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Inferred Target Role & Resume Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Target Role & Analysis Mapping</span>
                </div>
                <div className="mt-2 text-xs text-slate-700">
                  <span className="text-slate-500">Auto-configured Role:</span>{' '}
                  <strong className="text-indigo-700 font-semibold">{importedData.targetRole}</strong>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  Generated {importedData.resumeText.split(/\s+/).filter(Boolean).length}-word structured resume with quantifiable accomplishments.
                </p>
              </div>

              <div className="pt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Ready to pre-populate Experience and Skills</span>
              </div>
            </div>
          </div>

          {/* Action Buttons to Pre-populate */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-indigo-100">
            <button
              type="button"
              onClick={() => handleApplyToResume(false)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            >
              Pre-Populate Resume Fields
            </button>

            <button
              type="button"
              onClick={() => handleApplyToResume(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs shadow-indigo-100"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Pre-Populate & Run Audit Now</span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
