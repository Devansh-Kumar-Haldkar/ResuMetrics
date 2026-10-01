import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ResumeVersionSnapshot } from '../types/resume';
import {
  TrendingUp,
  History,
  PlusCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface AtsTrendChartProps {
  versionHistory: ResumeVersionSnapshot[];
  currentVersionId: string;
  onSelectVersion: (version: ResumeVersionSnapshot) => void;
  onApplyPresetImprovement: (stepType: 'xyz_bullets' | 'add_keywords' | 'polish_summary') => void;
  onSaveCurrentVersion: (label: string) => void;
  onResetHistory: () => void;
  targetRole: string;
}

export const AtsTrendChart: React.FC<AtsTrendChartProps> = ({
  versionHistory,
  currentVersionId,
  onSelectVersion,
  onApplyPresetImprovement,
  onSaveCurrentVersion,
  onResetHistory,
  targetRole,
}) => {
  const [metricView, setMetricView] = useState<'ats' | 'combined'>('ats');
  const [newVersionNote, setNewVersionNote] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Compute gain metrics
  const firstVersion = versionHistory[0];
  const latestVersion = versionHistory[versionHistory.length - 1];
  const initialAts = firstVersion ? firstVersion.atsScore : 60;
  const currentAts = latestVersion ? latestVersion.atsScore : 60;
  const netGain = currentAts - initialAts;
  const percentGain = initialAts > 0 ? Math.round((netGain / initialAts) * 100) : 0;

  // Custom Recharts Tooltip in Light Theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ResumeVersionSnapshot = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md max-w-xs text-xs">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <span className="font-bold text-slate-900 font-mono">{data.versionLabel}</span>
            <span className="text-[10px] text-slate-500 font-mono">{data.timestamp}</span>
          </div>

          <div className="space-y-1 mb-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                ATS Compatibility:
              </span>
              <span className="font-mono font-bold text-indigo-700 tabular-nums">
                {data.atsScore}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Overall Match Score:
              </span>
              <span className="font-mono font-bold text-emerald-700 tabular-nums">
                {data.overallScore}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-600" />
                Impact & Metrics:
              </span>
              <span className="font-mono font-bold text-cyan-700 tabular-nums">
                {data.impactScore}%
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800 block mb-0.5">Key Changes:</span>
            <p className="line-clamp-2 leading-relaxed">{data.changesSummary}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-6">
      {/* Chart Header & KPIs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                ATS Compatibility Evolution & Improvement Trend
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing score progression across successive edits and applied keyword/metric optimizations.
              </p>
            </div>
          </div>
        </div>

        {/* High-Level Progress KPIs */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
              Initial Baseline (v1)
            </span>
            <span className="text-base font-bold font-mono text-slate-800 tabular-nums">
              {initialAts}%
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
              Current Score
            </span>
            <span className="text-base font-bold font-mono text-indigo-600 tabular-nums">
              {currentAts}%
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
              Net Improvement
            </span>
            <div className="flex items-center gap-1.5 font-mono text-base font-bold tabular-nums">
              <span className={netGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {netGain >= 0 ? `+${netGain}` : netGain} pts
              </span>
              <span className="text-[11px] text-emerald-700 font-normal">
                ({netGain >= 0 ? `+${percentGain}%` : `${percentGain}%`})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Switcher & Benchmark Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Chart Display:</span>
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setMetricView('ats')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                metricView === 'ats'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ATS Score Focus
            </button>
            <button
              onClick={() => setMetricView('combined')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                metricView === 'combined'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Multi-Metric Overlay
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span>ATS Compatibility</span>
          </div>
          {metricView === 'combined' && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                <span>Overall Match</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
                <span>Impact & Scale</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5 text-amber-700 font-mono text-[11px]">
            <span className="h-0.5 w-3 border-t-2 border-dashed border-amber-500" />
            <span>80% Filter Passline</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Area Chart in Light Mode */}
      <div className="w-full h-72 sm:h-80 -ml-2 sm:ml-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={versionHistory}
            margin={{ top: 15, right: 25, left: -15, bottom: 5 }}
          >
            <defs>
              <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

            <XAxis
              dataKey="versionLabel"
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />

            <YAxis
              domain={[40, 100]}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Benchmark line for ATS screening */}
            <ReferenceLine
              y={80}
              stroke="#d97706"
              strokeDasharray="4 4"
              label={{
                value: 'Top ATS Tier (80%)',
                fill: '#b45309',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            {/* Primary Area: ATS Compatibility */}
            <Area
              type="monotone"
              dataKey="atsScore"
              name="ATS Score"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#atsGradient)"
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* Optional Multi-Metric Overlays */}
            {metricView === 'combined' && (
              <>
                <Area
                  type="monotone"
                  dataKey="overallScore"
                  name="Overall Score"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#overallGradient)"
                  activeDot={{ r: 5, fill: '#10b981' }}
                />
                <Area
                  type="monotone"
                  dataKey="impactScore"
                  name="Impact Score"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#impactGradient)"
                  activeDot={{ r: 5, fill: '#06b6d4' }}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Optimization Triggers & Quick Apply Actions */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-600" />
              <span>Simulate Next Successive Edit (Instant Re-score)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Apply high-priority improvements directly to your resume text to see how the ATS score trends upward.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-300 shadow-xs cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5 text-indigo-600" />
              <span>Snapshot Current Edit</span>
            </button>
            {versionHistory.length > 1 && (
              <button
                onClick={onResetHistory}
                className="text-xs text-slate-500 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                title="Reset Version History"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Transformation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => onApplyPresetImprovement('xyz_bullets')}
            className="flex flex-col text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                Apply XYZ Formula Bullets
              </span>
              <span className="text-emerald-700 font-mono text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                +12 pts ATS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Replaces weak task descriptions with quantified metric achievements.
            </p>
          </button>

          <button
            onClick={() => onApplyPresetImprovement('add_keywords')}
            className="flex flex-col text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                Inject Deficit Keywords
              </span>
              <span className="text-emerald-700 font-mono text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                +10 pts ATS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Organically adds missing Tier-1 keywords for {targetRole}.
            </p>
          </button>

          <button
            onClick={() => onApplyPresetImprovement('polish_summary')}
            className="flex flex-col text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                Adopt Tailored Summary
              </span>
              <span className="text-emerald-700 font-mono text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                +6 pts ATS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Updates summary header with high-impact executive positioning.
            </p>
          </button>
        </div>
      </div>

      {/* Version History Log Timeline */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span>Successive Versions Log ({versionHistory.length})</span>
          </span>
          <span>Click any revision to inspect or rollback</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {versionHistory.map((ver) => {
            const isSelected = ver.id === currentVersionId;
            return (
              <div
                key={ver.id}
                onClick={() => onSelectVersion(ver)}
                className={`flex flex-col justify-between rounded-xl p-3 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-900 text-xs">{ver.versionLabel}</span>
                    <span className="font-mono font-bold text-indigo-600 text-xs tabular-nums">
                      {ver.atsScore}% ATS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {ver.changesSummary}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{ver.timestamp}</span>
                  {isSelected && <span className="text-indigo-600 font-semibold">Active</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Version Modal in Light Theme */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Save Current Edit Snapshot</h4>
            <p className="text-xs text-slate-500">
              Give this edit a label so you can track your successive progress on the Recharts trend curve.
            </p>
            <input
              type="text"
              value={newVersionNote}
              onChange={(e) => setNewVersionNote(e.target.value)}
              placeholder="e.g. Revised experience section with metrics & Docker"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSaveCurrentVersion(newVersionNote || `Revision #${versionHistory.length + 1}`);
                  setNewVersionNote('');
                  setShowSaveModal(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
              >
                Save Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
