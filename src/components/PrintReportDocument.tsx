import React from 'react';
import { ResumeAnalysisResult } from '../types/resume';
import { CheckCircle2, XCircle, Award, Briefcase, FileText, Check } from 'lucide-react';

interface PrintReportDocumentProps {
  analysis: ResumeAnalysisResult;
  resumeText: string;
  targetRole: string;
  experienceLevel: string;
}

export const PrintReportDocument: React.FC<PrintReportDocumentProps> = ({
  analysis,
  resumeText,
  targetRole,
  experienceLevel,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const { candidateInfo, scoring, skillsAnalysis, bulletPointAudits, actionableRecommendations } = analysis;

  return (
    <div className="only-print print-container text-slate-900 bg-white p-0 m-0 w-full space-y-6">
      {/* 1. Formal Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase text-indigo-700 font-mono">
              ResuMetrics Career Intelligence
            </span>
            <span className="text-slate-400 font-mono">·</span>
            <span className="text-xs text-slate-500 font-mono">Official Diagnostic Report</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {candidateInfo.name || 'Candidate'} - Resume & ATS Analysis
          </h1>
          <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
            <span><strong>Target Role:</strong> {targetRole} ({experienceLevel} level)</span>
            <span><strong>Experience:</strong> ~{candidateInfo.detectedExperienceYears} Years</span>
            {candidateInfo.location && <span><strong>Location:</strong> {candidateInfo.location}</span>}
            {candidateInfo.email && <span><strong>Email:</strong> {candidateInfo.email}</span>}
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block bg-slate-100 border border-slate-300 rounded-lg p-3 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Overall ATS Score
            </span>
            <span className="text-3xl font-black font-mono text-indigo-700">
              {scoring.overallScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/100</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            Date: {currentDate}
          </div>
        </div>
      </div>

      {/* 2. Executive Verdict & Summary */}
      <div className="print-avoid-break bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-800">
          Executive Diagnostic Verdict
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed italic">
          "{scoring.summaryVerdict}"
        </p>

        <div className="pt-2 border-t border-slate-200 mt-2">
          <span className="text-[11px] font-bold text-slate-800 uppercase block mb-1">
            Recommended Value-Proposition Summary:
          </span>
          <p className="text-xs text-slate-800 font-medium leading-relaxed">
            "{analysis.enhancedExecutiveSummary}"
          </p>
        </div>
      </div>

      {/* 3. Sub-Metric Scores & Industry Benchmarks */}
      <div className="print-avoid-break space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
          ATS Dimension Breakdown vs. Industry Standards
        </h2>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-500 block">ATS Parseability</span>
            <span className="text-lg font-bold font-mono text-slate-900">{scoring.atsCompatibilityScore}%</span>
            <span className="text-[9px] text-slate-500 block">Benchmark: 80%+</span>
          </div>
          <div className="p-2.5 rounded border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-500 block">Skills Density</span>
            <span className="text-lg font-bold font-mono text-slate-900">{scoring.skillsAlignmentScore}%</span>
            <span className="text-[9px] text-slate-500 block">Benchmark: 75%+</span>
          </div>
          <div className="p-2.5 rounded border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-500 block">Impact Metrics</span>
            <span className="text-lg font-bold font-mono text-slate-900">{scoring.impactQuantificationScore}%</span>
            <span className="text-[9px] text-slate-500 block">Benchmark: 70%+</span>
          </div>
          <div className="p-2.5 rounded border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-500 block">Brevity / Structure</span>
            <span className="text-lg font-bold font-mono text-slate-900">{scoring.brevityStructureScore}%</span>
            <span className="text-[9px] text-slate-500 block">Benchmark: 75%+</span>
          </div>
          <div className="p-2.5 rounded border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-500 block">Executive Presence</span>
            <span className="text-lg font-bold font-mono text-slate-900">{scoring.executivePresenceScore}%</span>
            <span className="text-[9px] text-slate-500 block">Benchmark: 70%+</span>
          </div>
        </div>
      </div>

      {/* 4. Critical Skill Deficits & ATS Keywords */}
      <div className="print-avoid-break space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
          Identified Skill Gaps for {targetRole} ({skillsAnalysis.missingCrucialSkills.length} Deficits)
        </h2>

        <div className="space-y-2">
          {skillsAnalysis.missingCrucialSkills.slice(0, 4).map((gap, i) => (
            <div key={i} className="p-2.5 rounded border border-slate-200 bg-white text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">{gap.name}</span>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {gap.importance} Priority
                </span>
              </div>
              <p className="text-slate-600 text-[11px] mb-1"><strong>Screening Reason:</strong> {gap.reason}</p>
              <p className="text-indigo-900 text-[11px] bg-indigo-50/60 p-1.5 rounded">
                <strong>Proof Action:</strong> {gap.howToAcquire}
              </p>
            </div>
          ))}
        </div>

        {/* Keywords Summary */}
        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
          <div className="flex justify-between mb-1.5 font-bold">
            <span>ATS Keyword Match Rate: {skillsAnalysis.atsKeywords.matchPercentage}%</span>
            <span className="text-slate-500">{skillsAnalysis.atsKeywords.matchedKeywords.length} Matched · {skillsAnalysis.atsKeywords.missingKeywords.length} Deficits</span>
          </div>
          <div className="text-[11px] text-slate-600">
            <strong>Missing Tier-1 Keywords:</strong> {skillsAnalysis.atsKeywords.missingKeywords.slice(0, 8).join(', ')}
          </div>
        </div>
      </div>

      {/* 5. Bullet Point Transformations (Google XYZ Formula) */}
      <div className="print-avoid-break space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
          High-Impact Bullet Point Transformations (Google XYZ Formula)
        </h2>

        <div className="space-y-2.5">
          {bulletPointAudits.slice(0, 3).map((audit, idx) => (
            <div key={idx} className="p-3 rounded border border-slate-200 bg-white text-xs space-y-1.5">
              <div className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded border border-rose-100">
                <strong>Before (Task-Oriented):</strong> "{audit.originalBullet}"
              </div>
              <div className="text-[11px] text-indigo-950 bg-indigo-50/70 p-2 rounded border border-indigo-200 font-medium">
                <strong>After (Google XYZ - Accomplished [X] by doing [Z], measured by [Y]):</strong> "{audit.improvedBulletXYZ}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Page Break: Candidate Full Resume Content */}
      <div className="print-page-break pt-4 space-y-3">
        <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Full Resume Document (Optimized Text)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {resumeText.split(/\s+/).filter(Boolean).length} Words
          </span>
        </div>

        <div className="font-mono text-[10pt] leading-relaxed text-slate-800 whitespace-pre-wrap p-4 bg-slate-50 rounded border border-slate-200">
          {resumeText}
        </div>
      </div>

      {/* 7. Action Plan & Roadmap */}
      <div className="print-avoid-break space-y-3 pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
          High-Leverage Strategic Action Plan
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <span className="font-bold text-rose-800 block mb-1">Critical Fixes:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
              {actionableRecommendations.criticalFixes.map((f, i) => (
                <li key={i}>{f.title}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <span className="font-bold text-emerald-800 block mb-1">Upskilling Deliverables:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
              {actionableRecommendations.strategicUpskilling.map((p, i) => (
                <li key={i}>{p.skillName}: {p.recommendedProjectOrCert}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Report Footer */}
      <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between font-mono">
        <span>Generated by ResuMetrics AI · Document Version: Final</span>
        <span>Candidate: {candidateInfo.name || 'Anonymous'}</span>
      </div>
    </div>
  );
};
