export interface ScoringBreakdown {
  overallScore: number;
  atsCompatibilityScore: number;
  skillsAlignmentScore: number;
  impactQuantificationScore: number;
  brevityStructureScore: number;
  executivePresenceScore: number;
  summaryVerdict: string;
}

export interface IdentifiedSkill {
  name: string;
  category: 'Programming & Tech' | 'Frameworks & Libraries' | 'Cloud & DevOps' | 'Data & Databases' | 'Leadership & Management' | 'Methodologies & Architecture' | 'Other';
  proficiency: 'Advanced' | 'Proficient' | 'Familiar';
  contextEvidence: string;
}

export interface MissingSkill {
  name: string;
  category: 'Hard Skill' | 'Soft Skill' | 'Tool / Tech' | 'Certification';
  importance: 'Critical' | 'High' | 'Moderate';
  reason: string;
  howToAcquire: string;
}

export interface OutdatedSkill {
  name: string;
  suggestion: string;
}

export interface ATSKeywordMatch {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
}

export interface BulletPointAudit {
  id: string;
  originalBullet: string;
  roleCompany?: string;
  issueIdentified: string;
  formulaUsed: string;
  improvedBulletXYZ: string;
  alternateBulletExecutive: string;
  addedKeywords: string[];
}

export interface ActionableFix {
  title: string;
  description: string;
  impact: 'High' | 'Medium';
  section: 'Formatting' | 'Work Experience' | 'Skills Section' | 'Summary' | 'Education & Projects';
}

export interface StrategicUpskilling {
  skillName: string;
  recommendedProjectOrCert: string;
  estimatedWeeks: number;
}

export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  detectedExperienceYears: number;
}

export interface ResumeAnalysisResult {
  candidateInfo: CandidateInfo;
  scoring: ScoringBreakdown;
  skillsAnalysis: {
    identifiedHardSkills: IdentifiedSkill[];
    identifiedSoftSkills: Array<{ name: string; contextEvidence: string }>;
    missingCrucialSkills: MissingSkill[];
    outdatedOrWeakSkills: OutdatedSkill[];
    atsKeywords: ATSKeywordMatch;
  };
  bulletPointAudits: BulletPointAudit[];
  actionableRecommendations: {
    criticalFixes: ActionableFix[];
    quickWins: Array<{ title: string; description: string }>;
    strategicUpskilling: StrategicUpskilling[];
  };
  enhancedExecutiveSummary: string;
}

export interface AnalysisRequest {
  resumeText: string;
  targetRole?: string;
  targetJobDescription?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead_executive';
  focusAreas?: string[];
}

export interface BulletOptimizeRequest {
  bulletText: string;
  roleContext?: string;
  targetRole?: string;
  style?: 'xyz_metric' | 'leadership_scope' | 'technical_depth' | 'concise_ats';
}

export interface BulletOptimizeResponse {
  original: string;
  critique: string;
  variations: Array<{
    style: string;
    text: string;
    focus: string;
    quantificationExplanation: string;
  }>;
}

export interface RoadmapItem {
  weekRange: string;
  title: string;
  objective: string;
  skillsCovered: string[];
  concreteDeliverable: string;
  recommendedResources: string[];
}

export interface UpskillRoadmap {
  targetRole: string;
  overallStrategy: string;
  phases: RoadmapItem[];
}

export interface ResumeVersionSnapshot {
  id: string;
  versionLabel: string;
  timestamp: string;
  atsScore: number;
  overallScore: number;
  skillsScore: number;
  impactScore: number;
  brevityScore: number;
  changesSummary: string;
  appliedImprovements: string[];
  resumeText: string;
}

export interface StarGuide {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface BehavioralQuestion {
  id: string;
  question: string;
  category: 'Technical Gap Probe' | 'Scale & Production Failure' | 'Leadership & Conflict' | 'Cross-Team Ownership';
  targetedGap: string;
  triggerReason: string;
  interviewerIntent: string;
  starGuide: StarGuide;
  redFlags: string[];
  exemplaryAnswer: string;
  keyPointsToCover: string[];
}

export interface AnswerEvaluation {
  overallRating: 'Exceptional' | 'Strong Pass' | 'Borderline' | 'Needs Improvement';
  score: number;
  starScoreBreakdown: {
    situationTask: number;
    actionOwnership: number;
    quantifiedResult: number;
  };
  gapAddressedEffectively: boolean;
  strengths: string[];
  areasToImprove: string[];
  suggestedAnswerRefinement: string;
}

export interface LinkedInImportResponse {
  candidateName: string;
  currentTitle: string;
  targetRole: string;
  detectedExperienceYears: number;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead_executive';
  location: string;
  headlineSummary: string;
  resumeText: string;
  extractedSkills: string[];
  profileHandle: string;
}
