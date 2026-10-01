import React from 'react';
import { ScoringBreakdown, CandidateInfo } from '../types/resume';
import { CheckCircle2, AlertTriangle, XCircle, MapPin, TrendingUp, Users, Award, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface ScoreOverviewCardProps {
  scoring: ScoringBreakdown;
  candidateInfo: CandidateInfo;
  targetRole: string;
}

interface RoleBenchmarkData {
  roleCategory: string;
  applicantAverage: number;
  interviewCutoff: number;
  topDecileScore: number;
  atsParseabilityAvg: number;
  keywordMatchAvg: number;
  impactMetricsAvg: number;
  executivePresenceAvg: number;
  typicalRejectionRate: number;
  screeningNote: string;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({
  scoring,
  candidateInfo,
  targetRole,
}) => {
  // Dynamically calculate role benchmark based on target role
  const getRoleBenchmarks = (role: string): RoleBenchmarkData => {
    const r = role.toLowerCase();
    if (r.includes('staff') || r.includes('principal') || r.includes('architect') || r.includes('tech lead')) {
      return {
        roleCategory: 'Staff / Tech Lead',
        applicantAverage: 65,
        interviewCutoff: 82,
        topDecileScore: 90,
        atsParseabilityAvg: 70,
        keywordMatchAvg: 62,
        impactMetricsAvg: 54,
        executivePresenceAvg: 58,
        typicalRejectionRate: 78,
        screeningNote: 'Staff-level ATS filters heavily penalize missing architectural scope (RFCs, distributed systems) and lack of financial impact (FinOps).',
      };
    }
    if (r.includes('machine learning') || r.includes('mle') || r.includes('data scientist') || r.includes('ai')) {
      return {
        roleCategory: 'Machine Learning / AI',
        applicantAverage: 63,
        interviewCutoff: 80,
        topDecileScore: 88,
        atsParseabilityAvg: 68,
        keywordMatchAvg: 60,
        impactMetricsAvg: 50,
        executivePresenceAvg: 52,
        typicalRejectionRate: 76,
        screeningNote: 'ML screening algorithms filter out candidates who only list notebooks without production MLOps (Docker, Triton, latency profiling).',
      };
    }
    if (r.includes('director') || r.includes('head') || r.includes('executive') || r.includes('vp')) {
      return {
        roleCategory: 'Director / Executive',
        applicantAverage: 67,
        interviewCutoff: 84,
        topDecileScore: 92,
        atsParseabilityAvg: 72,
        keywordMatchAvg: 66,
        impactMetricsAvg: 60,
        executivePresenceAvg: 62,
        typicalRejectionRate: 82,
        screeningNote: 'Executive screens prioritize P&L ownership, multi-squad governance, and quantified EBITDA/ARR contributions over task lists.',
      };
    }
    if (r.includes('product') || r.includes('pm')) {
      return {
        roleCategory: 'Product Management',
        applicantAverage: 66,
        interviewCutoff: 81,
        topDecileScore: 89,
        atsParseabilityAvg: 71,
        keywordMatchAvg: 64,
        impactMetricsAvg: 56,
        executivePresenceAvg: 58,
        typicalRejectionRate: 75,
        screeningNote: 'Product applicant pools are dense; resumes with concrete user retention %, ARR growth, and experimentation scale pass first.',
      };
    }
    if (r.includes('devops') || r.includes('sre') || r.includes('cloud') || r.includes('infrastructure')) {
      return {
        roleCategory: 'DevOps / SRE / Cloud',
        applicantAverage: 64,
        interviewCutoff: 80,
        topDecileScore: 87,
        atsParseabilityAvg: 69,
        keywordMatchAvg: 63,
        impactMetricsAvg: 52,
        executivePresenceAvg: 54,
        typicalRejectionRate: 74,
        screeningNote: 'SRE filters search for Kubernetes, infrastructure as code (Terraform), CI/CD, and documented uptime SLA figures.',
      };
    }
    return {
      roleCategory: 'Software Engineering',
      applicantAverage: 64,
      interviewCutoff: 80,
      topDecileScore: 88,
      atsParseabilityAvg: 69,
      keywordMatchAvg: 62,
      impactMetricsAvg: 52,
      executivePresenceAvg: 55,
      typicalRejectionRate: 75,
      screeningNote: 'Average applicant score hovers at 64% due to passive verbs and unquantified bullets; 80%+ guarantees recruiter review.',
    };
  };

  const benchmark = getRoleBenchmarks(targetRole);

  const getScoreBadge = (score: number) => {
    if (score >= 85) {
      return {
        label: 'Interview Ready / Top 10%',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200',
        bar: 'bg-emerald-500',
      };
    }
    if (score >= 70) {
      return {
        label: 'Competitive / Minor Gaps',
        color: 'text-indigo-700',
        bg: 'bg-indigo-50 border-indigo-200',
        bar: 'bg-indigo-600',
      };
    }
    if (score >= 55) {
      return {
        label: 'Needs Optimization',
        color: 'text-amber-800',
        bg: 'bg-amber-50 border-amber-200',
        bar: 'bg-amber-500',
      };
    }
    return {
      label: 'High ATS Rejection Risk',
      color: 'text-rose-700',
      bg: 'bg-rose-50 border-rose-200',
      bar: 'bg-rose-500',
    };
  };

  const badge = getScoreBadge(scoring.overallScore);

  const atsScore = scoring.atsCompatibilityScore;
  const deltaFromAvg = atsScore - benchmark.applicantAverage;
  const isAboveAvg = deltaFromAvg >= 0;

  const calculatePercentile = (score: number, avg: number, top: number) => {
    if (score >= top) return 'Top 5%';
    if (score >= 80) return 'Top 15%';
    if (score >= avg + 5) return 'Top 30%';
    if (score >= avg) return 'Top 50% (Average)';
    if (score >= avg - 10) return 'Bottom 40%';
    return 'Bottom 20%';
  };

  const candidatePercentile = calculatePercentile(atsScore, benchmark.applicantAverage, benchmark.topDecileScore);
  const passProbability = Math.min(96, Math.max(18, Math.round(atsScore * 0.95 + (atsScore > benchmark.interviewCutoff ? 10 : -8))));

  const metricItems = [
    {
      title: 'ATS Parseability & Format',
      score: scoring.atsCompatibilityScore,
      roleAvg: benchmark.atsParseabilityAvg,
      benchmark: 'Target: 80+',
      description: 'Standard section headers, machine-readable contacts, layout hierarchy.',
    },
    {
      title: 'Skills Alignment & Density',
      score: scoring.skillsAlignmentScore,
      roleAvg: benchmark.keywordMatchAvg,
      benchmark: 'Target: 75+',
      description: `Domain match against ${targetRole} core requirements.`,
    },
    {
      title: 'Impact & Quantified Results',
      score: scoring.impactQuantificationScore,
      roleAvg: benchmark.impactMetricsAvg,
      benchmark: 'Target: 70+',
      description: 'Measurable metrics (%, $, latency, scale) vs task descriptions.',
    },
    {
      title: 'Brevity & Bullet Structure',
      score: scoring.brevityStructureScore,
      roleAvg: 68,
      benchmark: 'Target: 75+',
      description: 'Action verb vigor, concise single-line or 2-line cadence.',
    },
    {
      title: 'Executive Presence & Scope',
      score: scoring.executivePresenceScore,
      roleAvg: benchmark.executivePresenceAvg,
      benchmark: 'Target: 70+',
      description: 'Demonstrated ownership, cross-team impact, and strategic initiative.',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Candidate & Target Context */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Candidate Profile Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-base">
                {candidateInfo.name
                  ? candidateInfo.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'CD'}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {candidateInfo.name || 'Candidate Profile'}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="text-slate-700 font-medium">
                    {candidateInfo.currentTitle || 'Professional'}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-mono tabular-nums">
                    ~{candidateInfo.detectedExperienceYears} Years Experience
                  </span>
                  {candidateInfo.location && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {candidateInfo.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Target Role Tagline */}
            <div className="inline-flex items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="text-slate-500">Target Role:</span>
              <span className="font-semibold text-indigo-600 font-mono">
                {targetRole}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono text-[11px]">
                {benchmark.roleCategory} Benchmark Group
              </span>
            </div>
          </div>

          {/* Overall Score Circle / Pill */}
          <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-8">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
              <div className="text-center">
                <span className="block text-2xl font-black font-mono tabular-nums text-slate-900">
                  {scoring.overallScore}
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  / 100
                </span>
              </div>
            </div>

            <div>
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded border ${badge.bg} ${badge.color}`}>
                {badge.label}
              </span>
              <p className="mt-1.5 text-xs text-slate-500 max-w-xs leading-relaxed">
                Calculated across ATS algorithms, skill density, impact metrics, and role alignment.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Verdict Callout */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            Hiring Committee Diagnostic Verdict
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-sans">
            "{scoring.summaryVerdict}"
          </p>
        </div>
      </div>

      {/* Visual Role Benchmark Comparator (Current Score vs Role Average) */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/30 via-white to-slate-50/50 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>ATS Benchmark Analysis: {targetRole}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Comparing your current score against applicant averages and top-decile interview bars in this job category.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block tracking-wider">
                Screening Pass Probability
              </span>
              <span className={`font-mono text-sm font-bold tabular-nums ${passProbability >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                ~{passProbability}% Chance
              </span>
            </div>
          </div>
        </div>

        {/* Visual Benchmark Slider / Spectrum Bar */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-indigo-600 border border-white" />
                <span className="font-semibold text-slate-900">Your ATS Score:</span>
                <span className="font-mono font-bold text-indigo-600 tabular-nums">{atsScore}%</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                <span>Role Applicant Avg:</span>
                <span className="font-mono font-bold text-slate-700 tabular-nums">{benchmark.applicantAverage}%</span>
              </div>
            </div>

            {/* Delta badge */}
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border tabular-nums ${
                  isAboveAvg
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-amber-800 bg-amber-50 border-amber-200'
                }`}
              >
                {isAboveAvg ? `+${deltaFromAvg}% Above Role Average` : `${deltaFromAvg}% Below Role Average`}
              </span>
              <span className="text-xs text-slate-500 font-mono">({candidatePercentile})</span>
            </div>
          </div>

          {/* Spectrum Bar Container */}
          <div className="relative pt-6 pb-2">
            {/* The base spectrum bar */}
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex relative">
              {/* Zone 1: At-Risk (0 - 59%) */}
              <div className="h-full bg-rose-200 border-r border-white" style={{ width: '60%' }} title="At-Risk Zone (< 60%)" />
              {/* Zone 2: Competitive Range (60 - 79%) */}
              <div className="h-full bg-slate-300 border-r border-white" style={{ width: '20%' }} title="Competitive Applicant Range (60-79%)" />
              {/* Zone 3: Interview Threshold (80 - 100%) */}
              <div className="h-full bg-emerald-200" style={{ width: '20%' }} title="Top 10% Interview Zone (80-100%)" />
            </div>

            {/* Role Applicant Average Pin (Marker) */}
            <div
              className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all pointer-events-none"
              style={{ left: `${benchmark.applicantAverage}%` }}
            >
              <span className="text-[10px] font-mono font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-xs whitespace-nowrap mb-1">
                Avg: {benchmark.applicantAverage}%
              </span>
              <div className="h-4 w-0.5 bg-slate-500" />
            </div>

            {/* Top Decile / Interview Threshold Pin */}
            <div
              className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all pointer-events-none"
              style={{ left: `${benchmark.interviewCutoff}%` }}
            >
              <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shadow-xs whitespace-nowrap mb-1">
                Top 10%: {benchmark.interviewCutoff}%
              </span>
              <div className="h-4 w-0.5 bg-amber-500" />
            </div>

            {/* Candidate Current Score Indicator (Floating Diamond Marker) */}
            <div
              className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all z-10 pointer-events-none"
              style={{ left: `${Math.min(98, Math.max(2, atsScore))}%` }}
            >
              <span className="text-[11px] font-mono font-bold text-white bg-indigo-600 px-2 py-0.5 rounded shadow-sm border border-indigo-400 whitespace-nowrap mb-1 flex items-center gap-1">
                <span>You: {atsScore}%</span>
              </span>
              <div className="h-5 w-1 bg-indigo-600 rounded-full shadow-xs" />
            </div>
          </div>

          {/* Spectrum Legend Labels */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
            <span>0% (High Rejection Risk)</span>
            <span className="hidden sm:inline">60% (Screening Threshold)</span>
            <span>80% (Guaranteed Recruiter Review)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Comparative Metric Breakdown Grid (You vs. Role Average) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
            <span>Comparative Sub-Metric Performance vs. {benchmark.roleCategory} Averages</span>
            <span className="text-[11px] text-slate-500 normal-case font-normal hidden sm:inline">
              Based on industry ATS parsing benchmarks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {metricItems.slice(0, 4).map((m) => {
              const diff = m.score - m.roleAvg;
              const above = diff >= 0;
              return (
                <div
                  key={m.title}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 truncate pr-2" title={m.title}>
                        {m.title}
                      </span>
                    </div>

                    {/* Comparative Numbers */}
                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Your Score</span>
                        <span className="text-base font-bold font-mono text-indigo-600 tabular-nums">
                          {m.score}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Role Avg</span>
                        <span className="text-sm font-semibold font-mono text-slate-600 tabular-nums">
                          {m.roleAvg}%
                        </span>
                      </div>
                    </div>

                    {/* Dual Mini Bar */}
                    <div className="mt-2.5 space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${Math.min(100, Math.max(5, m.score))}%` }}
                        />
                      </div>
                      <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-400"
                          style={{ width: `${Math.min(100, Math.max(5, m.roleAvg))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Variance:</span>
                    <span className={`font-semibold ${above ? 'text-emerald-600' : 'text-amber-700'}`}>
                      {above ? `+${diff}%` : `${diff}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Screening Intelligence Callout */}
        <div className="rounded-xl bg-white border border-slate-200 p-3 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed shadow-xs">
          <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900">Algorithmic Screening Context for {targetRole}: </span>
            <span className="text-slate-600">{benchmark.screeningNote}</span>
          </div>
        </div>
      </div>

      {/* 5 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricItems.map((item) => {
          const itemBadge = getScoreBadge(item.score);
          return (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="font-semibold text-slate-800 truncate pr-2" title={item.title}>
                    {item.title}
                  </span>
                  <span className={`font-mono font-bold text-sm ${itemBadge.color} tabular-nums`}>
                    {item.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full ${itemBadge.bar} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(5, item.score))}%` }}
                  />
                </div>

                <p className="text-[11px] leading-normal text-slate-600 mt-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>{item.benchmark}</span>
                <span className="text-slate-500">Avg: {item.roleAvg}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
