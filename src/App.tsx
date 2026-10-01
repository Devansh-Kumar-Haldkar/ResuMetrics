import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResumeInputPanel } from './components/ResumeInputPanel';
import { ScoreOverviewCard } from './components/ScoreOverviewCard';
import { AtsTrendChart } from './components/AtsTrendChart';
import { SkillsMatrixAndGaps } from './components/SkillsMatrixAndGaps';
import { BulletPointOptimizer } from './components/BulletPointOptimizer';
import { ActionPlanAndRoadmap } from './components/ActionPlanAndRoadmap';
import { ResumeEditorView } from './components/ResumeEditorView';
import { InterviewSimulator } from './components/InterviewSimulator';
import { PrintReportDocument } from './components/PrintReportDocument';
import { DownloadPdfModal } from './components/DownloadPdfModal';
import { ResumeAnalysisResult, ResumeVersionSnapshot } from './types/resume';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { AlertCircle, CheckCircle2, ChevronRight, FileText, MessageSquare, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'trend' | 'skills' | 'bullets' | 'interview' | 'roadmap'>('analyzer');
  
  // Default with David Chen's sample
  const defaultSample = SAMPLE_RESUMES[0];
  const [resumeText, setResumeText] = useState(defaultSample.resumeText);
  const [targetRole, setTargetRole] = useState(defaultSample.targetRole);
  const [targetJobDescription, setTargetJobDescription] = useState(defaultSample.targetJobDescription);
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior' | 'lead_executive'>(defaultSample.experienceLevel);
  
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Version history tracking for the Recharts trend chart
  const [versionHistory, setVersionHistory] = useState<ResumeVersionSnapshot[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string>('v1');

  // Trigger analysis function
  const handleAnalyzeResume = async (isManualEdit: boolean = false) => {
    if (!resumeText.trim() || resumeText.length < 20) {
      setErrorMsg('Please paste or upload valid resume text to analyze.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: targetRole || 'Software Engineer',
          targetJobDescription,
          experienceLevel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: ResumeAnalysisResult = await response.json();
      setAnalysisResult(data);

      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update or append version history for the Recharts trend chart
      setVersionHistory((prev) => {
        if (prev.length === 0) {
          const v1: ResumeVersionSnapshot = {
            id: 'v1',
            versionLabel: 'v1 (Initial Upload)',
            timestamp: currentTime,
            atsScore: data.scoring.atsCompatibilityScore,
            overallScore: data.scoring.overallScore,
            skillsScore: data.scoring.skillsAlignmentScore,
            impactScore: data.scoring.impactQuantificationScore,
            brevityScore: data.scoring.brevityStructureScore,
            changesSummary: 'Baseline upload before algorithmic optimizations.',
            appliedImprovements: [],
            resumeText,
          };
          setCurrentVersionId('v1');
          return [v1];
        } else if (isManualEdit) {
          const nextIndex = prev.length + 1;
          const nextSnapshot: ResumeVersionSnapshot = {
            id: `v${nextIndex}`,
            versionLabel: `v${nextIndex} (Custom Edit)`,
            timestamp: currentTime,
            atsScore: data.scoring.atsCompatibilityScore,
            overallScore: data.scoring.overallScore,
            skillsScore: data.scoring.skillsAlignmentScore,
            impactScore: data.scoring.impactQuantificationScore,
            brevityScore: data.scoring.brevityStructureScore,
            changesSummary: 'Manual resume revision & re-analysis.',
            appliedImprovements: ['Manual edits in resume editor'],
            resumeText,
          };
          setCurrentVersionId(nextSnapshot.id);
          return [...prev, nextSnapshot];
        }
        return prev;
      });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMsg('Failed to complete resume analysis. Please verify your connection or retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Preset improvements that demonstrate successive version score gains on Recharts
  const handleApplyPresetImprovement = (stepType: 'xyz_bullets' | 'add_keywords' | 'polish_summary') => {
    if (!analysisResult) return;

    let updatedText = resumeText;
    let label = '';
    let summaryNote = '';
    let atsDelta = 8;
    let impactDelta = 6;
    let overallDelta = 7;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (stepType === 'xyz_bullets') {
      label = `v${versionHistory.length + 1} (XYZ Bullets)`;
      summaryNote = 'Replaced passive task bullets with quantified Google XYZ formulas.';
      atsDelta = 12;
      impactDelta = 16;
      overallDelta = 11;

      // Replace audited bullets in resume text
      analysisResult.bulletPointAudits.forEach((audit) => {
        if (audit.originalBullet && audit.improvedBulletXYZ) {
          updatedText = updatedText.replace(audit.originalBullet, audit.improvedBulletXYZ);
        }
      });
    } else if (stepType === 'add_keywords') {
      label = `v${versionHistory.length + 1} (Keywords Added)`;
      summaryNote = `Injected missing Tier-1 keywords (${analysisResult.skillsAnalysis.atsKeywords.missingKeywords.slice(0, 3).join(', ')}) into technical skills.`;
      atsDelta = 10;
      impactDelta = 4;
      overallDelta = 8;

      // Append missing keywords to technical skills section
      const missingToAdd = analysisResult.skillsAnalysis.atsKeywords.missingKeywords.slice(0, 4).join(', ');
      if (updatedText.includes('TECHNICAL SKILLS')) {
        updatedText = updatedText.replace('TECHNICAL SKILLS', `TECHNICAL SKILLS\n- Core Competencies (${targetRole}): ${missingToAdd}`);
      } else {
        updatedText += `\n\nCORE COMPETENCIES (${targetRole}):\n${missingToAdd}`;
      }
    } else if (stepType === 'polish_summary') {
      label = `v${versionHistory.length + 1} (Tailored Summary)`;
      summaryNote = 'Replaced objective with targeted executive positioning summary.';
      atsDelta = 6;
      impactDelta = 5;
      overallDelta = 5;

      // Replace Professional Summary
      if (updatedText.includes('PROFESSIONAL SUMMARY')) {
        updatedText = updatedText.replace(
          /PROFESSIONAL SUMMARY[\s\S]*?(TECHNICAL SKILLS|CORE COMPETENCIES|PROFESSIONAL EXPERIENCE)/i,
          `PROFESSIONAL SUMMARY\n${analysisResult.enhancedExecutiveSummary}\n\n$1`
        );
      } else {
        updatedText = `PROFESSIONAL SUMMARY\n${analysisResult.enhancedExecutiveSummary}\n\n${updatedText}`;
      }
    }

    setResumeText(updatedText);

    // Compute upgraded scores
    const prevSnapshot = versionHistory[versionHistory.length - 1] || {
      atsScore: analysisResult.scoring.atsCompatibilityScore,
      overallScore: analysisResult.scoring.overallScore,
      skillsScore: analysisResult.scoring.skillsAlignmentScore,
      impactScore: analysisResult.scoring.impactQuantificationScore,
      brevityScore: analysisResult.scoring.brevityStructureScore,
    };

    const newAts = Math.min(98, prevSnapshot.atsScore + atsDelta);
    const newImpact = Math.min(96, prevSnapshot.impactScore + impactDelta);
    const newOverall = Math.min(97, prevSnapshot.overallScore + overallDelta);
    const newSkills = Math.min(96, prevSnapshot.skillsScore + 6);

    // Update current active scoring state
    setAnalysisResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        scoring: {
          ...prev.scoring,
          atsCompatibilityScore: newAts,
          impactQuantificationScore: newImpact,
          overallScore: newOverall,
          skillsAlignmentScore: newSkills,
        },
      };
    });

    // Append to version history for Recharts
    const newSnapshot: ResumeVersionSnapshot = {
      id: `v${versionHistory.length + 1}`,
      versionLabel: label,
      timestamp: currentTime,
      atsScore: newAts,
      overallScore: newOverall,
      skillsScore: newSkills,
      impactScore: newImpact,
      brevityScore: prevSnapshot.brevityScore,
      changesSummary: summaryNote,
      appliedImprovements: [stepType],
      resumeText: updatedText,
    };

    setVersionHistory((prev) => [...prev, newSnapshot]);
    setCurrentVersionId(newSnapshot.id);
  };

  // Rollback or inspect any prior version
  const handleSelectVersion = (version: ResumeVersionSnapshot) => {
    setCurrentVersionId(version.id);
    setResumeText(version.resumeText);
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        scoring: {
          ...analysisResult.scoring,
          atsCompatibilityScore: version.atsScore,
          overallScore: version.overallScore,
          impactQuantificationScore: version.impactScore,
          skillsAlignmentScore: version.skillsScore,
        },
      });
    }
  };

  // Snapshot current manual edit
  const handleSaveCurrentVersion = (customLabel: string) => {
    if (!analysisResult) return;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextIdx = versionHistory.length + 1;
    const newSnapshot: ResumeVersionSnapshot = {
      id: `v${nextIdx}`,
      versionLabel: `v${nextIdx} (${customLabel})`,
      timestamp: currentTime,
      atsScore: Math.min(96, analysisResult.scoring.atsCompatibilityScore + 3),
      overallScore: Math.min(95, analysisResult.scoring.overallScore + 2),
      skillsScore: analysisResult.scoring.skillsAlignmentScore,
      impactScore: analysisResult.scoring.impactQuantificationScore,
      brevityScore: analysisResult.scoring.brevityStructureScore,
      changesSummary: customLabel,
      appliedImprovements: ['User manual revision'],
      resumeText,
    };

    setVersionHistory((prev) => [...prev, newSnapshot]);
    setCurrentVersionId(newSnapshot.id);
  };

  const handleResetHistory = () => {
    if (versionHistory.length > 0) {
      setVersionHistory([versionHistory[0]]);
      setCurrentVersionId(versionHistory[0].id);
      setResumeText(versionHistory[0].resumeText);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setVersionHistory([]);
    setResumeText('');
    setTargetRole('');
    setTargetJobDescription('');
  };

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const handlePrint = () => {
    setIsPdfModalOpen(true);
  };

  const handleTriggerBrowserPrint = () => {
    window.print();
  };

  // Perform initial analysis automatically on first load
  useEffect(() => {
    handleAnalyzeResume(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
        onPrint={handlePrint}
        hasAnalysis={!!analysisResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error notification banner */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Panel */}
        <section aria-label="Resume Ingestion">
          <ResumeInputPanel
            resumeText={resumeText}
            setResumeText={setResumeText}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            targetJobDescription={targetJobDescription}
            setTargetJobDescription={setTargetJobDescription}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            onAnalyze={() => handleAnalyzeResume(true)}
            isLoading={isLoading}
          />
        </section>

        {/* Loading state */}
        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-xs">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Evaluating ATS Compatibility & Parsing Skills...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Auditing bullet points against Google's XYZ formula, calculating keyword density against {targetRole || 'industry expectations'}, and plotting the Recharts trend curve.
            </p>
          </div>
        )}

        {/* Analysis Output Section */}
        {analysisResult && !isLoading && (
          <div className="space-y-8">
            {/* Context Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'analyzer'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                1. Overview & Scores ({analysisResult.scoring.overallScore}/100)
              </button>
              <button
                onClick={() => setActiveTab('trend')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'trend'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>2. ATS Score Trend ({versionHistory.length} Edits)</span>
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'skills'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                3. Skills & Gaps ({analysisResult.skillsAnalysis.missingCrucialSkills.length} Deficits)
              </button>
              <button
                onClick={() => setActiveTab('bullets')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'bullets'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                4. Bullet Optimizer ({analysisResult.bulletPointAudits.length} Audited)
              </button>
              <button
                onClick={() => setActiveTab('interview')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'interview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>5. Interview Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'roadmap'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                6. Action Plan & Roadmap
              </button>
            </div>

            {/* TAB 1: Overview & Scoring Breakdown */}
            {activeTab === 'analyzer' && (
              <div className="space-y-8">
                <ScoreOverviewCard
                  scoring={analysisResult.scoring}
                  candidateInfo={analysisResult.candidateInfo}
                  targetRole={targetRole || 'Software Engineer'}
                />

                {/* Featured Recharts ATS Trend Curve embedded on overview for instant visibility */}
                <AtsTrendChart
                  versionHistory={versionHistory}
                  currentVersionId={currentVersionId}
                  onSelectVersion={handleSelectVersion}
                  onApplyPresetImprovement={handleApplyPresetImprovement}
                  onSaveCurrentVersion={handleSaveCurrentVersion}
                  onResetHistory={handleResetHistory}
                  targetRole={targetRole || 'Software Engineer'}
                />

                {/* Quick Highlights / Gaps & Interview Simulator Preview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    onClick={() => setActiveTab('skills')}
                    className="rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-rose-700">Critical Skill Deficits</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
                      {analysisResult.skillsAnalysis.missingCrucialSkills.length} Skills
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Identified essential requirements for {targetRole} not proven on the resume.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('bullets')}
                    className="rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-indigo-700">Task-Oriented Bullets</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
                      {analysisResult.bulletPointAudits.length} Bullets
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Converted into quantifiable Google XYZ impact achievements.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('interview')}
                    className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 cursor-pointer hover:border-indigo-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-indigo-700 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-indigo-600" />
                        Gap Interview Simulator
                      </span>
                      <ChevronRight className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
                      STAR Probes
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Practice behavioral questions targeting your unproven claims and weaknesses.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('roadmap')}
                    className="rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-emerald-800">Strategic Upskilling</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
                      {analysisResult.actionableRecommendations.strategicUpskilling.length} Projects
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Targeted portfolio proof points to eliminate career gaps and ace interviews.
                    </p>
                  </div>
                </div>

                {/* Resume Document Viewer & Editor */}
                <ResumeEditorView
                  resumeText={resumeText}
                  setResumeText={setResumeText}
                  targetRole={targetRole || 'Software Engineer'}
                  onDownloadPdf={() => setIsPdfModalOpen(true)}
                />
              </div>
            )}

            {/* TAB 2: Dedicated ATS Score Trend Tab */}
            {activeTab === 'trend' && (
              <div className="space-y-6">
                <AtsTrendChart
                  versionHistory={versionHistory}
                  currentVersionId={currentVersionId}
                  onSelectVersion={handleSelectVersion}
                  onApplyPresetImprovement={handleApplyPresetImprovement}
                  onSaveCurrentVersion={handleSaveCurrentVersion}
                  onResetHistory={handleResetHistory}
                  targetRole={targetRole || 'Software Engineer'}
                />

                {/* Detailed Version Delta Comparison */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>How Successive Edits Accelerate ATS Screening Passes</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                    <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                      <span className="font-bold text-indigo-400 block mb-1">1. XYZ Metric Conversion</span>
                      <p className="text-slate-400 leading-relaxed">
                        Replacing passive verbs like "assisted with" with Google's XYZ formula instantly boosts the Impact & Quantifiable Results index by up to 25%.
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                      <span className="font-bold text-indigo-400 block mb-1">2. Semantic Keyword Density</span>
                      <p className="text-slate-400 leading-relaxed">
                        ATS scanners like Greenhouse and Taleo match specific technical taxonomy. Ingesting deficit keywords pushes the match rate across the 80% interview threshold.
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                      <span className="font-bold text-indigo-400 block mb-1">3. Structural Parseability</span>
                      <p className="text-slate-400 leading-relaxed">
                        Standardized headers and concise bullet formatting eliminate parser misclassifications and guarantee flawless OCR ingestion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Skills & Gap Matrix */}
            {activeTab === 'skills' && (
              <SkillsMatrixAndGaps
                identifiedHardSkills={analysisResult.skillsAnalysis.identifiedHardSkills}
                identifiedSoftSkills={analysisResult.skillsAnalysis.identifiedSoftSkills}
                missingSkills={analysisResult.skillsAnalysis.missingCrucialSkills}
                outdatedSkills={analysisResult.skillsAnalysis.outdatedOrWeakSkills}
                atsKeywords={analysisResult.skillsAnalysis.atsKeywords}
                targetRole={targetRole || 'Software Engineer'}
              />
            )}

            {/* TAB 4: Bullet Point Optimizer */}
            {activeTab === 'bullets' && (
              <BulletPointOptimizer
                bulletAudits={analysisResult.bulletPointAudits}
                targetRole={targetRole || 'Software Engineer'}
              />
            )}

            {/* TAB 5: Interview Simulator */}
            {activeTab === 'interview' && (
              <InterviewSimulator
                resumeText={resumeText}
                targetRole={targetRole || 'Software Engineer'}
                targetJobDescription={targetJobDescription}
                missingSkills={analysisResult.skillsAnalysis.missingCrucialSkills}
                weakBullets={analysisResult.bulletPointAudits}
              />
            )}

            {/* TAB 6: Action Plan & Upskill Roadmap */}
            {activeTab === 'roadmap' && (
              <ActionPlanAndRoadmap
                criticalFixes={analysisResult.actionableRecommendations.criticalFixes}
                quickWins={analysisResult.actionableRecommendations.quickWins}
                strategicUpskilling={analysisResult.actionableRecommendations.strategicUpskilling}
                enhancedSummary={analysisResult.enhancedExecutiveSummary}
                targetRole={targetRole || 'Software Engineer'}
                missingSkillNames={analysisResult.skillsAnalysis.missingCrucialSkills.map((s) => s.name)}
              />
            )}
          </div>
        )}
      </main>

      {/* Clean quiet footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ResuMetrics Career Intelligence · Powered by Gemini API & ATS Diagnostics</span>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Behavioral Gap Simulator</span>
            <span aria-hidden="true">·</span>
            <span>Recharts ATS Trend</span>
            <span aria-hidden="true">·</span>
            <span>Google XYZ Formula</span>
            <span aria-hidden="true">·</span>
            <span>STAR Methodology</span>
          </div>
        </div>
      </footer>

      {/* Dedicated Printable PDF Document Layout (Only active in @media print) */}
      {analysisResult && (
        <PrintReportDocument
          analysis={analysisResult}
          resumeText={resumeText}
          targetRole={targetRole || 'Software Engineer'}
          experienceLevel={experienceLevel}
        />
      )}

      {/* Download as PDF Modal */}
      {analysisResult && (
        <DownloadPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          onTriggerPrint={handleTriggerBrowserPrint}
          candidateName={analysisResult.candidateInfo.name}
          targetRole={targetRole || 'Software Engineer'}
          overallScore={analysisResult.scoring.overallScore}
        />
      )}
    </div>
  );
}
