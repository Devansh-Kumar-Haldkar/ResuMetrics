import React, { useState } from 'react';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';
import { LinkedInProfileImporter } from './LinkedInProfileImporter';
import {
  Upload,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface ResumeInputPanelProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  targetJobDescription: string;
  setTargetJobDescription: (jd: string) => void;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead_executive';
  setExperienceLevel: (lvl: 'entry' | 'mid' | 'senior' | 'lead_executive') => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const ResumeInputPanel: React.FC<ResumeInputPanelProps> = ({
  resumeText,
  setResumeText,
  targetRole,
  setTargetRole,
  targetJobDescription,
  setTargetJobDescription,
  experienceLevel,
  setExperienceLevel,
  onAnalyze,
  isLoading,
}) => {
  const [showJdAccordion, setShowJdAccordion] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'linkedin' | 'samples'>('editor');
  const [fileError, setFileError] = useState<string | null>(null);

  // LinkedIn Import Success State
  const [importedCandidate, setImportedCandidate] = useState<{
    candidateName: string;
    currentTitle: string;
    targetRole: string;
    detectedExperienceYears: number;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
        setActiveTab('editor');
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please paste text directly.');
    };
    reader.readAsText(file);
  };

  const loadSample = (sample: SampleResume) => {
    setResumeText(sample.resumeText);
    setTargetRole(sample.targetRole);
    setTargetJobDescription(sample.targetJobDescription);
    setExperienceLevel(sample.experienceLevel);
    setActiveTab('editor');
    if (sample.targetJobDescription) {
      setShowJdAccordion(true);
    }
  };

  const commonRoleSuggestions = [
    'Staff Software Engineer',
    'Senior Frontend Engineer',
    'Senior Backend Engineer',
    'Machine Learning Engineer',
    'Director of Product',
    'Senior DevOps / SRE',
    'Engineering Manager',
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-xs">
      {/* Top Banner / Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Resume Diagnostic & Skill Gap Ingestion
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Paste your resume, import directly from a LinkedIn profile URL, or load a curated test scenario.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Input
          </button>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'linkedin'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="font-black text-indigo-600 text-xs">in</span>
            <span>Import LinkedIn</span>
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curated Samples ({SAMPLE_RESUMES.length})
          </button>
        </div>
      </div>

      {/* Imported LinkedIn Success Notification Banner */}
      {importedCandidate && (
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5 shadow-xs">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Profile Imported: {importedCandidate.candidateName}
                </span>
                <span className="text-[10px] font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {importedCandidate.currentTitle}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Auto-populated resume text (~{importedCandidate.detectedExperienceYears} YOE), set target role to{' '}
                <strong className="text-slate-900">{importedCandidate.targetRole}</strong>, and configured seniority.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Run Diagnostic Now</span>
            </button>
          </div>
        </div>
      )}

      {/* LinkedIn Import Tab View */}
      {activeTab === 'linkedin' && (
        <div className="mt-6">
          <LinkedInProfileImporter
            onProfileImported={(profile) => {
              setResumeText(profile.resumeText);
              setTargetRole(profile.targetRole);
              setExperienceLevel(profile.experienceLevel);
              setImportedCandidate({
                candidateName: profile.candidateName,
                currentTitle: profile.targetRole,
                targetRole: profile.targetRole,
                detectedExperienceYears: profile.experienceLevel === 'lead_executive' ? 10 : 7,
              });
              setActiveTab('editor');
            }}
            onAutoAnalyze={() => {
              onAnalyze();
            }}
            onClose={() => setActiveTab('editor')}
          />
        </div>
      )}

      {/* Samples Drawer */}
      {activeTab === 'samples' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          {SAMPLE_RESUMES.map((sample) => (
            <div
              key={sample.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-slate-900">{sample.name}</span>
                  <span className="text-indigo-600 font-mono text-[11px] font-semibold capitalize bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {sample.experienceLevel}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-700">
                  Current: {sample.role}
                </div>
                <div className="text-xs font-semibold text-indigo-700 mt-0.5">
                  Target: {sample.targetRole}
                </div>
                <p className="mt-2.5 text-[11px] leading-relaxed text-slate-600">
                  {sample.description}
                </p>
              </div>
              <button
                onClick={() => loadSample(sample)}
                className="mt-4 w-full rounded-lg bg-white border border-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
              >
                Load This Resume
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Direct Input Form */}
      {activeTab === 'editor' && (
        <div className="mt-6 space-y-5">
          {/* Target Role & Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Job Title / Role
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Staff Software Engineer, Senior Data Analyst, Product Manager..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
                />
              </div>

              {/* Suggestions & LinkedIn quick trigger */}
              <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-slate-400">Quick set:</span>
                  {commonRoleSuggestions.slice(0, 4).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('linkedin')}
                  className="text-indigo-700 font-semibold hover:text-indigo-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span className="font-black bg-indigo-100 text-indigo-700 rounded px-1 text-[10px]">in</span>
                  <span>Import from LinkedIn URL</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Seniority Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
              >
                <option value="entry">Entry Level (0-2 YOE)</option>
                <option value="mid">Mid Level (3-5 YOE)</option>
                <option value="senior">Senior Level (6-9 YOE)</option>
                <option value="lead_executive">Staff / Lead / Director (10+ YOE)</option>
              </select>
            </div>
          </div>

          {/* Target Job Description (Optional Accordion) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowJdAccordion(!showJdAccordion)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-600" />
                <span>Target Job Description / Specific Requirements (Optional)</span>
                {targetJobDescription && (
                  <span className="text-[10px] text-emerald-700 font-mono font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Configured ({targetJobDescription.length} chars)
                  </span>
                )}
              </div>
              {showJdAccordion ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </button>

            {showJdAccordion && (
              <div className="p-4 pt-1 border-t border-slate-200 bg-white">
                <p className="text-[11px] text-slate-500 mb-2">
                  Paste the requirements or description from LinkedIn, Greenhouse, or Lever to measure precise keyword match rates and specific missing competencies.
                </p>
                <textarea
                  rows={4}
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  placeholder="Paste target job requirements, qualifications, and core responsibilities here..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                />
              </div>
            )}
          </div>

          {/* Resume Text Editor / Upload Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Resume Content (Text, Markdown, or Plain Copy)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload File (.txt, .md)</span>
                  <input
                    type="file"
                    accept=".txt,.md,.text"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {resumeText && (
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </span>
                )}
              </div>
            </div>

            {fileError && (
              <div className="mb-2 flex items-center gap-2 rounded-md bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{fileError}</span>
              </div>
            )}

            <div className="relative">
              <textarea
                rows={12}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here (Work Experience, Technical Skills, Education, Summary, Projects)...

Tip: Include bullet points with numbers and tools so the ATS parser can test impact scoring accurately."
                className="w-full rounded-xl border border-slate-300 bg-slate-50/40 p-4 text-xs font-mono leading-relaxed text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              Evaluates <span className="text-slate-800 font-semibold">ATS compatibility</span>,{' '}
              <span className="text-slate-800 font-semibold">skill deficiencies</span>, and{' '}
              <span className="text-slate-800 font-semibold">quantifiable metrics</span>.
            </div>

            <button
              onClick={onAnalyze}
              disabled={isLoading || resumeText.trim().length < 20}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all shadow-xs cursor-pointer ${
                isLoading || resumeText.trim().length < 20
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-200'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Auditing Resume & Gaps...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Resume & Detect Gaps</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
