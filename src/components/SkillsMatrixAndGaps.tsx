import React, { useState } from 'react';
import { IdentifiedSkill, MissingSkill, OutdatedSkill, ATSKeywordMatch } from '../types/resume';
import { CheckCircle2, XCircle, AlertCircle, Copy, Check, Filter, Zap } from 'lucide-react';

interface SkillsMatrixAndGapsProps {
  identifiedHardSkills: IdentifiedSkill[];
  identifiedSoftSkills: Array<{ name: string; contextEvidence: string }>;
  missingSkills: MissingSkill[];
  outdatedSkills: OutdatedSkill[];
  atsKeywords: ATSKeywordMatch;
  targetRole: string;
}

export const SkillsMatrixAndGaps: React.FC<SkillsMatrixAndGapsProps> = ({
  identifiedHardSkills,
  identifiedSoftSkills,
  missingSkills,
  outdatedSkills,
  atsKeywords,
  targetRole,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'gaps' | 'identified' | 'ats_keywords' | 'weak_verbs'>('gaps');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const categories = ['All', ...Array.from(new Set(identifiedHardSkills.map((s) => s.category)))];

  const filteredHardSkills =
    selectedCategory === 'All'
      ? identifiedHardSkills
      : identifiedHardSkills.filter((s) => s.category === selectedCategory);

  const getImportanceBadge = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'critical':
        return {
          label: 'Critical Requirement',
          text: 'text-rose-700',
          bg: 'bg-rose-50 border-rose-200',
        };
      case 'high':
        return {
          label: 'High Priority',
          text: 'text-amber-800',
          bg: 'bg-amber-50 border-amber-200',
        };
      default:
        return {
          label: 'Recommended',
          text: 'text-indigo-700',
          bg: 'bg-indigo-50 border-indigo-200',
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Sub-navigation Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Skill Inventory & Gap Intelligence</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Compare candidate competencies against {targetRole} expectations to uncover missing keywords, critical technical gaps, and passive phrasing.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 p-1">
          <button
            onClick={() => setActiveSubTab('gaps')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'gaps'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Gaps ({missingSkills.length})
          </button>
          <button
            onClick={() => setActiveSubTab('identified')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'identified'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Identified Skills ({identifiedHardSkills.length + identifiedSoftSkills.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ats_keywords')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'ats_keywords'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ATS Keywords ({atsKeywords.matchPercentage}%)
          </button>
          <button
            onClick={() => setActiveSubTab('weak_verbs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'weak_verbs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weak Phrasings ({outdatedSkills.length})
          </button>
        </div>
      </div>

      {/* 1. Skill Gaps Tab */}
      {activeSubTab === 'gaps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <span className="text-slate-900 font-bold font-mono">{missingSkills.length} identified gaps</span> for{' '}
              <span className="text-indigo-600 font-semibold">{targetRole}</span>
            </span>
            <span className="hidden sm:inline text-slate-500">
              Prioritized by screening algorithm importance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missingSkills.map((gap, index) => {
              const badge = getImportanceBadge(gap.importance);
              return (
                <div
                  key={index}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {gap.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>{gap.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-semibold font-mono text-[11px] px-2 py-0.5 rounded border ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Why this matters */}
                    <div className="mt-3 text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-700 block mb-1">Why hiring teams filter for this:</span>
                      <p>{gap.reason}</p>
                    </div>

                    {/* How to bridge this gap */}
                    <div className="mt-4 rounded-xl bg-indigo-50/60 border border-indigo-100 p-3.5 text-xs leading-relaxed text-indigo-950">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-700 mb-1 text-[11px] uppercase tracking-wider">
                        <Zap className="h-3 w-3" />
                        <span>Actionable Resume Integration</span>
                      </div>
                      <p className="text-slate-700 text-xs">
                        {gap.howToAcquire}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Recommended action</span>
                    <button
                      onClick={() => copyToClipboard(`Skill to integrate: ${gap.name} - ${gap.howToAcquire}`, `gap-${index}`)}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                    >
                      {copiedKey === `gap-${index}` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Action Item</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Identified Skills Matrix */}
      {activeSubTab === 'identified' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="h-3.5 w-3.5" />
              Domain:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hard Skills Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Technical & Domain Competencies Detected ({filteredHardSkills.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredHardSkills.map((skill, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-sm">
                        {skill.name}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {skill.proficiency}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {skill.category}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                      {skill.contextEvidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft & Leadership Skills */}
          {identifiedSoftSkills.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Leadership & Collaborative Skills Detected ({identifiedSoftSkills.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {identifiedSoftSkills.map((soft, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs"
                  >
                    <span className="font-semibold text-slate-900 text-sm block">
                      {soft.name}
                    </span>
                    <p className="mt-1.5 text-[11px] text-slate-600 leading-relaxed">
                      {soft.contextEvidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ATS Keywords Gap Checklist */}
      {activeSubTab === 'ats_keywords' && (
        <div className="space-y-6">
          {/* Summary Metric Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ATS Keyword Density Score
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                {atsKeywords.matchPercentage}%
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Percentage of tier-1 screening keywords present in the resume for this position.
              </p>
            </div>
            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 text-xs">
              <div>
                <span className="text-emerald-700 font-bold font-mono text-base block tabular-nums">
                  {atsKeywords.matchedKeywords.length}
                </span>
                <span className="text-slate-500">Matched In Resume</span>
              </div>
              <div>
                <span className="text-rose-700 font-bold font-mono text-base block tabular-nums">
                  {atsKeywords.missingKeywords.length}
                </span>
                <span className="text-slate-500">Deficit Keywords</span>
              </div>
            </div>
          </div>

          {/* Missing Keywords (Deficit) */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
            <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-3">
              <XCircle className="h-4 w-4 text-rose-600" />
              <span>Missing Keywords (High ATS Filter Impact)</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              These terms appear frequently in top job descriptions for {targetRole}. Adding them to project bullet points and skills will significantly boost parse scores.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {atsKeywords.missingKeywords.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs shadow-xs"
                >
                  <span className="text-slate-800 font-mono font-medium">{kw}</span>
                  <button
                    onClick={() => copyToClipboard(kw, `kw-${i}`)}
                    className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer ml-2"
                    title="Copy Keyword"
                  >
                    {copiedKey === `kw-${i}` ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Matched Keywords */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5">
            <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Verified Matched Keywords</span>
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {atsKeywords.matchedKeywords.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-slate-700 font-mono shadow-xs"
                >
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span>{kw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Weak Verbs & Phrasings Tab */}
      {activeSubTab === 'weak_verbs' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Resumes that use passive or cooperative-only phrasing ("Helped", "Assisted with", "Responsible for") fail to communicate leadership and ownership.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outdatedSkills.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm mb-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>Identified Weak Phrasing: "{item.name}"</span>
                  </div>
                  <div className="text-xs leading-relaxed text-slate-600 mt-2">
                    <span className="font-semibold text-slate-700 block mb-1">Recommended Transformation:</span>
                    <p className="text-slate-800 bg-slate-50 rounded-xl p-3.5 border border-slate-200 leading-relaxed font-sans">
                      {item.suggestion}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(item.suggestion, `weak-${index}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {copiedKey === `weak-${index}` ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Suggestion</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
