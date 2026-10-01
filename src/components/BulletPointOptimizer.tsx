import React, { useState } from 'react';
import { BulletPointAudit } from '../types/resume';
import { Sparkles, Copy, Check, Zap, Target } from 'lucide-react';

interface BulletPointOptimizerProps {
  bulletAudits: BulletPointAudit[];
  targetRole: string;
}

export const BulletPointOptimizer: React.FC<BulletPointOptimizerProps> = ({
  bulletAudits,
  targetRole,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Live Studio State
  const [customBullet, setCustomBullet] = useState('');
  const [customRole, setCustomRole] = useState(targetRole);
  const [isRewriting, setIsRewriting] = useState(false);
  const [liveResult, setLiveResult] = useState<{
    original: string;
    critique: string;
    variations: Array<{
      style: string;
      text: string;
      focus: string;
      quantificationExplanation: string;
    }>;
  } | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLiveRewrite = async () => {
    if (!customBullet.trim()) return;

    setIsRewriting(true);
    try {
      const res = await fetch('/api/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText: customBullet,
          targetRole: customRole || targetRole,
        }),
      });
      const data = await res.json();
      setLiveResult(data);
    } catch (err) {
      console.error('Failed to rewrite bullet point:', err);
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span>Actionable Bullet Point Transformations</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Transform passive task descriptions into quantified achievements using Google's XYZ formula (Accomplished [X] as measured by [Y] by doing [Z]).
        </p>
      </div>

      {/* 1. Analyzed Resume Audits */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Identified Weak Bullets in Your Resume ({bulletAudits.length})
        </h3>

        {bulletAudits.map((item, idx) => (
          <div
            key={item.id || idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs"
          >
            {/* Context & Original */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-800 font-mono">
                  {item.roleCompany || `Audit #${idx + 1}`}
                </span>
                <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Issue Detected
                </span>
              </div>

              {/* Original Bullet */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-950">
                <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider block mb-1">
                  Original (Weak):
                </span>
                "{item.originalBullet}"
              </div>

              {/* Critique */}
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-1">
                <span className="font-semibold text-slate-800">Screening Flaw:</span> {item.issueIdentified}
              </p>
            </div>

            {/* Transformations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Option A: Google XYZ */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" />
                      Google XYZ Formula
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-indigo-100">
                      Metrics Heavy
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 font-sans leading-relaxed font-medium">
                    "{item.improvedBulletXYZ}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.addedKeywords?.slice(0, 2).map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-medium">
                        +{kw}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopy(item.improvedBulletXYZ, `audit-xyz-${idx}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    {copiedId === `audit-xyz-${idx}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy XYZ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Option B: Executive Leadership */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-indigo-600" />
                      Executive Leadership Alternate
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                      Scale & Scope
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                    "{item.alternateBulletExecutive}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-end">
                  <button
                    onClick={() => handleCopy(item.alternateBulletExecutive, `audit-exec-${idx}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {copiedId === `audit-exec-${idx}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Executive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Interactive Live Bullet Rewriter Studio */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/30 to-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Live Bullet Optimizer Studio
              </h3>
              <p className="text-xs text-slate-500">
                Paste any single accomplishment or draft bullet point to produce three production-grade rewrites.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={customBullet}
                onChange={(e) => setCustomBullet(e.target.value)}
                placeholder="e.g. Worked on migrating database and improving query speed..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Target Role (e.g. Staff Engineer)"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleLiveRewrite}
              disabled={isRewriting || customBullet.trim().length < 5}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs ${
                isRewriting || customBullet.trim().length < 5
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isRewriting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Generating Rewrites...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Rewrite Bullet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Studio Output */}
        {liveResult && (
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-indigo-700 block mb-1">Algorithmic Critique:</span>
              <p className="leading-relaxed">{liveResult.critique}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {liveResult.variations.map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700 mb-1.5">
                      <span>{v.style}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{v.focus}</span>
                    </div>
                    <p className="text-xs text-slate-900 leading-relaxed font-sans mt-2 font-medium">
                      "{v.text}"
                    </p>
                    <p className="mt-2 text-[10px] text-slate-500 leading-normal border-t border-slate-100 pt-2">
                      {v.quantificationExplanation}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleCopy(v.text, `live-${i}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {copiedId === `live-${i}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
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
    </div>
  );
};
