import React, { useState } from 'react';
import { ActionableFix, StrategicUpskilling, UpskillRoadmap } from '../types/resume';
import { CheckCircle2, Calendar, Copy, Check, Sparkles, AlertCircle, Wrench } from 'lucide-react';

interface ActionPlanAndRoadmapProps {
  criticalFixes: ActionableFix[];
  quickWins: Array<{ title: string; description: string }>;
  strategicUpskilling: StrategicUpskilling[];
  enhancedSummary: string;
  targetRole: string;
  missingSkillNames: string[];
}

export const ActionPlanAndRoadmap: React.FC<ActionPlanAndRoadmapProps> = ({
  criticalFixes,
  quickWins,
  strategicUpskilling,
  enhancedSummary,
  targetRole,
  missingSkillNames,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Dynamic roadmap state
  const [roadmap, setRoadmap] = useState<UpskillRoadmap | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(enhancedSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateCustomRoadmap = async () => {
    setIsLoadingRoadmap(true);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingSkills: missingSkillNames,
          targetRole,
        }),
      });
      const data = await res.json();
      setRoadmap(data);
    } catch (err) {
      console.error('Failed to generate upskilling roadmap:', err);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Tailored Executive Summary Card */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/50 via-white to-slate-50/60 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recommended Executive Summary for {targetRole}
            </h3>
          </div>
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            {copiedSummary ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Replaces generic objective statements with a targeted value proposition highlighting your scope, years of experience, and primary technical contributions.
        </p>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-xs font-medium">
          "{enhancedSummary}"
        </div>
      </div>

      {/* 2. Immediate Prioritized Action Plan */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Prioritized Improvement Action Plan
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Fix these high-impact deficiencies before submitting to your next target company application.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Critical Fixes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>High Impact Corrections ({criticalFixes.length})</span>
            </div>

            <div className="space-y-3">
              {criticalFixes.map((fix, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{fix.title}</span>
                    <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                      {fix.section}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fix.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Wins */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Quick Wins (&lt; 15 Minutes)</span>
            </div>

            <div className="space-y-3">
              {quickWins.map((win, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5"
                >
                  <span className="font-semibold text-slate-900 text-xs block">{win.title}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {win.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Strategic Upskilling & Gap-Closing Roadmap */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span>Strategic Skill Acquisition & Portfolio Roadmap</span>
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Build credible, high-leverage portfolio projects and obtain industry-recognized certifications to close your identified skill gaps.
            </p>
          </div>

          <button
            onClick={handleGenerateCustomRoadmap}
            disabled={isLoadingRoadmap}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            {isLoadingRoadmap ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Wrench className="h-3.5 w-3.5" />
                <span>{roadmap ? 'Regenerate Roadmap' : 'Generate 8-Week Roadmap'}</span>
              </>
            )}
          </button>
        </div>

        {/* Static Strategic Projects (Always Available) */}
        {!roadmap && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategicUpskilling.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-indigo-700 truncate pr-2">
                      {item.skillName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-medium shrink-0">
                      ~{item.estimatedWeeks} wks
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {item.recommendedProjectOrCert}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Resume Proof Point</span>
                  <button
                    onClick={() => handleCopyText(item.recommendedProjectOrCert, `proj-${idx}`)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium cursor-pointer"
                  >
                    {copiedIndex === `proj-${idx}` ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic 8-Week Roadmap (When generated) */}
        {roadmap && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 text-xs text-indigo-950">
              <span className="font-bold text-indigo-900 block mb-1">Target Strategy:</span>
              <p>{roadmap.overallStrategy}</p>
            </div>

            <div className="space-y-4">
              {roadmap.phases.map((phase, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition-colors hover:border-slate-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded border border-indigo-200">
                        {phase.weekRange}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{phase.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">{phase.objective}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                    <div className="rounded-lg bg-white p-3 border border-slate-200 shadow-xs">
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider mb-1">
                        Concrete Deliverable / Proof:
                      </span>
                      <p className="text-slate-800 font-mono text-[11px]">{phase.concreteDeliverable}</p>
                    </div>

                    <div className="rounded-lg bg-white p-3 border border-slate-200 shadow-xs">
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider mb-1">
                        Study & Execution Resources:
                      </span>
                      <ul className="text-slate-600 space-y-0.5 text-[11px]">
                        {phase.recommendedResources?.map((res, rIdx) => (
                          <li key={rIdx} className="truncate" title={res}>
                            · {res}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
