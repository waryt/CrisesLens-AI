export type PageId =
  | 'command-center'
  | 'reports'
  | 'fusion'
  | 'priority'
  | 'map'
  | 'response'
  | 'analytics';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ReportSource = 'Citizen' | 'Police' | 'Hospital' | 'Social Media' | 'Helpline';

export type CrisisType =
  | 'Flooding'
  | 'Fire'
  | 'Road Blockage'
  | 'Medical Emergency'
  | 'Power Grid Failure'
  | 'Hazardous Material';

export type ReportStatus =
  | 'Pending Analysis'
  | 'Fused into Crisis'
  | 'Duplicate Grouped'
  | 'Verified';

// Official TREC Incident Streams 2020-A (Task 2 Reduced Information Categories)
export type TrecInformationCategory =
  | 'SearchAndRescue'
  | 'MedicalNeeded'
  | 'RoadBlockage'
  | 'InfrastructureRelated'
  | 'GoodsServices'
  | 'CallToAction'
  | 'ReportUrgent'
  | 'CautionAdvice'
  | 'WeatherAlert'
  | 'ServiceDisruption'
  | 'CleanUp';

export interface EmergencyReport {
  id: string;
  source: ReportSource;
  time: string;
  timestamp: number;
  location: string;
  coordinates: { x: number; y: number }; // Percentage 0-100 on city sector grid
  text: string;
  crisisType: CrisisType;
  severity: SeverityLevel;
  status: ReportStatus;
  clusterId?: string;
  verifiedBy?: string;
  // Official TREC-IS 2020-A Task-2 & Evaluation Ground Truth
  trecEventId?: string; // e.g. "trecis2020-A-test.035"
  trecEventName?: string;
  informationCategory?: TrecInformationCategory; // Task-2 reduced category
  officialCategory?: TrecInformationCategory; // Ground truth label
  officialPriority?: SeverityLevel; // Ground truth priority
  isCategoryMatch?: boolean;
  isPriorityMatch?: boolean;
  isCorrectlyClustered?: boolean;
  entities?: {
    victimsReported?: string;
    hazardLevel?: string;
    infrastructureAffected?: string;
    urgencyScore: number;
    corroborationConfidence: number;
  };
}

export interface ScoreFactor {
  name: string;
  points: number;
  description: string;
  category: 'life_safety' | 'infrastructure' | 'corroboration' | 'escalation';
}

export interface RecommendedAction {
  id: string;
  step: number;
  title: string;
  rationale: string;
  targetTeam: string;
  status: 'Pending' | 'Approved' | 'Dispatched';
  estimatedPersonnel: number;
}

export interface TimelineEvent {
  time: string;
  event: string;
  source: string;
  severity?: SeverityLevel;
}

export interface CrisisCluster {
  id: string;
  code: string;
  name: string;
  location: string;
  sector: string;
  coordinates: { x: number; y: number };
  type: CrisisType;
  priorityScore: number;
  severity: SeverityLevel;
  status: 'CRITICAL' | 'ESCALATING' | 'CONTAINED' | 'DISPATCHED';
  relatedReportsCount: number;
  independentSourcesCount: number;
  reportIds: string[];
  scoreFactors: ScoreFactor[];
  totalScore: number;
  explanation: string;
  recommendedActions: RecommendedAction[];
  timeline: TimelineEvent[];
  // TREC-IS 2020-A Linkage
  trecEventId?: string; // e.g. "trecis2020-A-test.035"
  trecEventName?: string;
  officialGroundTruthSeverity?: SeverityLevel;
  officialGroundTruthScore?: number;
  primaryCategory?: TrecInformationCategory;
  fusionDetails: {
    semanticSimilarity: number;
    spatialRadiusMeters: number;
    duplicateReportsFiltered: number;
    firstReportTime: string;
    latestReportTime: string;
    dominantKeywords: string[];
  };
}

export interface TrecEventMeta {
  id: string; // e.g. "trecis2020-A-test.035"
  name: string;
  eventType: string;
  eventNumber: number; // 35 to 49
  location: string;
  groundTruthSeverity: SeverityLevel;
  groundTruthPriorityScore: number;
  primaryTask2Category: TrecInformationCategory;
  reportsCount: number;
}

export interface DatasetEvaluationReport {
  datasetName: string;
  clientSpecification: string;
  requestKey: string;
  eventsRange: string;
  totalMessagesAnalyzed: number;
  uniqueEvents: number;
  activeTacticalClusters: number;
  clusteringAccuracy: number;
  priorityClassificationAccuracy: number;
  withinOneTierAccuracy: number;
  criticalRecall: number;
  criticalPrecision: number;
  correctlyClusteredCount: number;
  categoryMetrics: {
    category: TrecInformationCategory;
    count: number;
    precision: number;
    recall: number;
    f1: number;
  }[];
  eventComparison: {
    trecEventId: string;
    eventName: string;
    officialSeverity: SeverityLevel;
    predictedSeverity: SeverityLevel;
    officialScore: number;
    predictedScore: number;
    reportsCount: number;
    clusteringPrecision: number;
    status: 'MATCH' | 'HIGH_ALIGNMENT';
  }[];
}

export interface ActivityLog {
  id: string;
  time: string;
  message: string;
  type: 'ai' | 'alert' | 'dispatch' | 'fusion';
  badge?: string;
}

export interface SimulationState {
  isActive: boolean;
  stageIndex: number;
  stageName:
    | 'idle'
    | 'receiving'
    | 'analyzing'
    | 'finding_similar'
    | 'fusing'
    | 'calculating_priority'
    | 'completed';
  stageText: string;
  rawReportsCount: number;
  relatedGroupsCount: number;
  uniqueCrisesCount: number;
  detectedCrisis: CrisisCluster | null;
}
