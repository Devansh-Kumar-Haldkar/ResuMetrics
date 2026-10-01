import React, { useState, useEffect } from 'react';
import { BehavioralQuestion, AnswerEvaluation } from '../types/resume';
import {
  MessageSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ShieldAlert,
  Award,
  Filter,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

interface InterviewSimulatorProps {
  resumeText: string;
  targetRole: string;
  targetJobDescription: string;
  missingSkills: any[];
  weakBullets: any[];
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({
  resumeText,
  targetRole,
  targetJobDescription,
  missingSkills,
  weakBullets,
}) => {
  const [questions, setQuestions] = useState<BehavioralQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User Practice & Evaluation State
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);

  // Expanded STAR Guides toggle
  const [expandedStarId, setExpandedStarId] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setEvaluation(null);
    try {
      const res = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole,
          targetJobDescription,
          missingSkills,
          weakBullets,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setSelectedQuestionId(data.questions[0].id);
        setExpandedStarId(data.questions[0].id);
      }
    } catch (err) {
      console.error('Failed to generate interview questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [targetRole]);

  const handleEvaluateAnswer = async (question: BehavioralQuestion) => {
    if (!practiceAnswer.trim() || practiceAnswer.length < 15) return;

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          targetedGap: question.targetedGap,
          userAnswer: practiceAnswer,
          targetRole,
        }),
      });
      const data: AnswerEvaluation = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error('Failed to evaluate interview answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Technical Gap Probe', 'Scale & Production Failure', 'Leadership & Conflict', 'Cross-Team Ownership'];

  const filteredQuestions =
    selectedCategory === 'All'
      ? questions
      : questions.filter((q) => q.category === selectedCategory);

  const activeQuestion = questions.find((q) => q.id === selectedQuestionId) || questions[0];

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Exceptional':
        return { text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
      case 'Strong Pass':
        return { text: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' };
      case 'Borderline':
        return { text: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
      default:
        return { text: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <span>Behavioral Interview Simulator</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Hiring managers specifically formulate behavioral questions to probe the gaps, unquantified claims, and missing competencies on your resume.
          </p>
        </div>

        <button
          onClick={fetchQuestions}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Questions</span>
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Synthesizing Targeted Interview Questions...</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Cross-referencing {missingSkills.length} identified resume gaps against {targetRole} bar-raiser rubrics.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="h-3.5 w-3.5" />
              Category:
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

          {/* Dual Panel Layout: Question Selector & Deep Practice Arena */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Questions List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
                Generated Gap Questions ({filteredQuestions.length})
              </span>

              <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                {filteredQuestions.map((q, idx) => {
                  const isSelected = q.id === selectedQuestionId;
                  return (
                    <div
                      key={q.id || idx}
                      onClick={() => {
                        setSelectedQuestionId(q.id);
                        setEvaluation(null);
                        setPracticeAnswer('');
                      }}
                      className={`rounded-2xl p-4 transition-all cursor-pointer border text-left flex flex-col justify-between shadow-xs ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-mono text-indigo-700 font-semibold truncate pr-2">
                            {q.category}
                          </span>
                          <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0 font-medium">
                            Probes Gap
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          "{q.question}"
                        </h4>

                        <div className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                          <span className="text-slate-700 font-semibold">Target Gap:</span> {q.targetedGap}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[200px]" title={q.triggerReason}>
                          Trigger: {q.triggerReason}
                        </span>
                        {isSelected && <span className="text-indigo-600 font-bold shrink-0">Active</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Question Deep Dive & Practice Arena (7 cols) */}
            {activeQuestion && (
              <div className="lg:col-span-7 space-y-5">
                {/* Active Question Spotlight Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
                  {/* Category & Probed Gap Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {activeQuestion.category}
                      </span>
                      <span className="text-xs text-rose-700 font-semibold">
                        Probing: {activeQuestion.targetedGap}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(activeQuestion.question, 'q-copy')}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === 'q-copy' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === 'q-copy' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* The Big Question */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    "{activeQuestion.question}"
                  </h3>

                  {/* Why this is being asked (Trigger Reason & Hidden Intent) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="rounded-xl bg-rose-50/70 border border-rose-200 p-3 text-rose-950">
                      <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider block mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-rose-600" />
                        Why Your Resume Triggered This:
                      </span>
                      <p className="leading-relaxed text-slate-700">{activeQuestion.triggerReason}</p>
                    </div>

                    <div className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-3 text-indigo-950">
                      <span className="font-bold text-indigo-700 uppercase text-[10px] tracking-wider block mb-1 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3 text-indigo-600" />
                        Interviewer's Hidden Intent:
                      </span>
                      <p className="leading-relaxed text-slate-700">{activeQuestion.interviewerIntent}</p>
                    </div>
                  </div>

                  {/* Key Points To Cover */}
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2">
                      Must-Mention Talking Points to Neutralize Gap:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                      {activeQuestion.keyPointsToCover?.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags to Avoid */}
                  <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-xs text-amber-950">
                    <span className="font-bold text-amber-800 uppercase text-[10px] tracking-wider block mb-1 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3 text-amber-600" />
                      Critical Red Flags to Avoid:
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {activeQuestion.redFlags?.map((flag, fIdx) => (
                        <li key={fIdx}>✕ {flag}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Accordion: Recommended STAR Framework Guide */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedStarId(expandedStarId === activeQuestion.id ? null : activeQuestion.id)}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        <span>Recommended STAR Answer Blueprint</span>
                      </span>
                      {expandedStarId === activeQuestion.id ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </button>

                    {expandedStarId === activeQuestion.id && (
                      <div className="p-4 pt-1 border-t border-slate-200 bg-white space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-indigo-700 block mb-0.5">S · Situation:</span>
                            <p className="text-slate-700 leading-relaxed">{activeQuestion.starGuide.situation}</p>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-indigo-700 block mb-0.5">T · Task:</span>
                            <p className="text-slate-700 leading-relaxed">{activeQuestion.starGuide.task}</p>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-indigo-700 block mb-0.5">A · Action:</span>
                            <p className="text-slate-700 leading-relaxed">{activeQuestion.starGuide.action}</p>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-indigo-700 block mb-0.5">R · Result:</span>
                            <p className="text-slate-700 leading-relaxed">{activeQuestion.starGuide.result}</p>
                          </div>
                        </div>

                        {/* Exemplary Model Answer */}
                        <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3.5 mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider">
                              Exemplary High-Scoring Response:
                            </span>
                            <button
                              onClick={() => handleCopy(activeQuestion.exemplaryAnswer, 'model-ans')}
                              className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold cursor-pointer"
                            >
                              {copiedId === 'model-ans' ? 'Copied' : 'Copy Response'}
                            </button>
                          </div>
                          <p className="text-slate-800 leading-relaxed font-sans italic text-xs">
                            "{activeQuestion.exemplaryAnswer}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Practice & AI Response Evaluator */}
                <div className="rounded-2xl border border-indigo-200 bg-white p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-indigo-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Practice Your Answer (STAR Assessment)
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Evaluates STAR completeness & gap mitigation
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Type your draft answer below using the STAR method. Ensure you include concrete numbers (%, $, latency, scale) and explain your personal ownership.
                  </p>

                  <textarea
                    rows={5}
                    value={practiceAnswer}
                    onChange={(e) => setPracticeAnswer(e.target.value)}
                    placeholder="Draft your response here... (e.g. In my previous role at [Company], we faced a challenge where... My specific responsibility was to... I architected... As a result, we reduced latency by 45% and...)"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 leading-relaxed font-sans"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {practiceAnswer.split(/\s+/).filter(Boolean).length} words
                    </span>

                    <button
                      onClick={() => handleEvaluateAnswer(activeQuestion)}
                      disabled={isEvaluating || practiceAnswer.trim().length < 15}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs ${
                        isEvaluating || practiceAnswer.trim().length < 15
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                    >
                      {isEvaluating ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Evaluating STAR Delivery...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Evaluate My Answer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Evaluation Result Card */}
                  {evaluation && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                      {/* Top score & rating */}
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                            Evaluator Assessment
                          </span>
                          <span className={`text-sm font-bold ${getRatingBadge(evaluation.overallRating).text}`}>
                            {evaluation.overallRating}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                            Interview Score
                          </span>
                          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                            {evaluation.score}
                            <span className="text-xs text-slate-500 font-normal">/100</span>
                          </span>
                        </div>
                      </div>

                      {/* STAR Sub-scores */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                          <span className="text-[10px] text-slate-500 block">Situation & Task</span>
                          <span className="font-mono font-bold text-indigo-700 tabular-nums">
                            {evaluation.starScoreBreakdown.situationTask}%
                          </span>
                        </div>
                        <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                          <span className="text-[10px] text-slate-500 block">Action & Ownership</span>
                          <span className="font-mono font-bold text-indigo-700 tabular-nums">
                            {evaluation.starScoreBreakdown.actionOwnership}%
                          </span>
                        </div>
                        <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                          <span className="text-[10px] text-slate-500 block">Quantified Result</span>
                          <span className="font-mono font-bold text-indigo-700 tabular-nums">
                            {evaluation.starScoreBreakdown.quantifiedResult}%
                          </span>
                        </div>
                      </div>

                      {/* Strengths & Improvement Points */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-emerald-50/50 p-3 border border-emerald-200">
                          <span className="font-bold text-emerald-800 block mb-1.5">What Worked Well:</span>
                          <ul className="space-y-1 text-slate-700">
                            {evaluation.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl bg-amber-50/50 p-3 border border-amber-200">
                          <span className="font-bold text-amber-800 block mb-1.5">How to Strengthen:</span>
                          <ul className="space-y-1 text-slate-700">
                            {evaluation.areasToImprove.map((a, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-600 shrink-0 font-bold">·</span>
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* AI Refinement Version */}
                      <div className="rounded-xl bg-indigo-50/60 p-3.5 border border-indigo-200 text-xs">
                        <span className="font-bold text-indigo-800 block mb-1">
                          Suggested Polished Refinement:
                        </span>
                        <p className="text-slate-800 leading-relaxed font-sans italic">
                          "{evaluation.suggestedAnswerRefinement}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
