import React, { useState } from 'react';
import { PageId, CrisisCluster, EmergencyReport, ActivityLog, ReportStatus } from './types';
import {
  INITIAL_CRISES,
  INITIAL_REPORTS,
  INITIAL_AI_ACTIVITIES,
  SIMULATION_RAW_BATCH,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenterView } from './components/CommandCenterView';
import { ReportsView } from './components/ReportsView';
import { FusionView } from './components/FusionView';
import { PriorityView } from './components/PriorityView';
import { MapView } from './components/MapView';
import { ResponseView } from './components/ResponseView';
import { AnalyticsView } from './components/AnalyticsView';
import { SimulationModal } from './components/SimulationModal';
import { CrisisDetailModal } from './components/CrisisDetailModal';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageId>('command-center');

  // Crisis and Reports state
  const [crises, setCrises] = useState<CrisisCluster[]>(INITIAL_CRISES);
  const [reports, setReports] = useState<EmergencyReport[]>(() => {
    // Ensure all initial reports have unique IDs
    const seen = new Set<string>();
    return INITIAL_REPORTS.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  });
  const [aiActivities, setAiActivities] = useState<ActivityLog[]>(INITIAL_AI_ACTIVITIES);
  const [selectedCrisisId, setSelectedCrisisId] = useState<string>('CRISIS-17');
  const [totalProcessedCount, setTotalProcessedCount] = useState<number>(248);

  // Modals state
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [detailModalCrisis, setDetailModalCrisis] = useState<CrisisCluster | null>(null);

  // Critical & High counts
  const criticalCount = crises.filter((c) => c.severity === 'Critical').length;
  const highCount = crises.filter((c) => c.severity === 'High').length;
  const topCrisis =
    [...crises].sort((a, b) => b.priorityScore - a.priorityScore)[0] || crises[0];

  // Handler to add report
  const handleAddReport = (newReportData: Partial<EmergencyReport>) => {
    const newReport: EmergencyReport = {
      id: `REP-${Math.floor(250 + Math.random() * 500)}`,
      source: newReportData.source || 'Citizen',
      time: newReportData.time || 'Just now',
      timestamp: Date.now(),
      location: newReportData.location || 'Sector 4',
      coordinates: { x: 34 + Math.random() * 4, y: 48 + Math.random() * 4 },
      text: newReportData.text || 'Urgent situation reported by civilian.',
      crisisType: newReportData.crisisType || 'Flooding',
      severity: newReportData.severity || 'High',
      status: 'Pending Analysis',
      entities: {
        victimsReported: 'Pending extraction',
        hazardLevel: 'Assessing',
        infrastructureAffected: newReportData.location || 'Local area',
        urgencyScore: 85,
        corroborationConfidence: 0.88,
      },
    };

    setReports((prev) => [newReport, ...prev]);
    setTotalProcessedCount((prev) => prev + 1);

    // Add activity log
    const newLog: ActivityLog = {
      id: `ACT-${Date.now()}`,
      time: 'Just now',
      message: `Inbound report ingested from ${newReport.source}: "${newReport.text.slice(0, 42)}..."`,
      type: 'ai',
      badge: 'Live Ingest',
    };
    setAiActivities((prev) => [newLog, ...prev.slice(0, 5)]);
  };

  // Handler to update report status (e.g., from operator review)
  const handleUpdateReportStatus = (reportId: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status, verifiedBy: 'Duty Officer' } : r))
    );
    const log: ActivityLog = {
      id: `ACT-${Date.now()}`,
      time: 'Just now',
      message: `Report ${reportId} marked as ${status} by operator`,
      type: 'dispatch',
      badge: 'Operator Triage',
    };
    setAiActivities((prev) => [log, ...prev.slice(0, 5)]);
  };

  // Handler to authorize response action
  const handleAuthorizeAction = (crisisId: string, actionId: string) => {
    setCrises((prev) =>
      prev.map((c) => {
        if (c.id !== crisisId) return c;
        return {
          ...c,
          recommendedActions: c.recommendedActions.map((act) => {
            if (act.id !== actionId) return act;
            const nextStatus = act.status === 'Pending' ? 'Approved' : 'Dispatched';
            return { ...act, status: nextStatus };
          }),
        };
      })
    );

    const log: ActivityLog = {
      id: `ACT-${Date.now()}`,
      time: 'Just now',
      message: `Action authorized for ${crisisId}: Dispatched emergency unit`,
      type: 'dispatch',
      badge: 'Commander Action',
    };
    setAiActivities((prev) => [log, ...prev.slice(0, 5)]);
  };

  // Handler to navigate directly to a crisis
  const handleNavigateToCrisis = (crisisId: string, page: PageId) => {
    setSelectedCrisisId(crisisId);
    setCurrentPage(page);
  };

  // Simulation execution handler: updates dashboard state
  const handleApplySimulationResults = () => {
    const runTimestamp = Date.now();
    const runSuffix = runTimestamp.toString().slice(-4);
    // Assign unique IDs for each simulation run to prevent key collisions across runs
    const freshBatch = SIMULATION_RAW_BATCH.map((item, idx) => ({
      ...item,
      id: `${item.id}-${runSuffix}-${idx + 1}`,
      timestamp: runTimestamp,
    }));

    // Add simulation batch to reports, replacing any older simulation batch
    setReports((prev) => {
      const nonSimPrev = prev.filter((r) => !r.id.startsWith('SIM-'));
      return [...freshBatch, ...nonSimPrev];
    });
    setTotalProcessedCount((prev) => prev + 20);

    // Update Sector 4 Flooding priority to 94 / 100 with fresh counts
    setCrises((prev) =>
      prev.map((c) => {
        if (c.id === 'CRISIS-17') {
          return {
            ...c,
            priorityScore: 94,
            relatedReportsCount: 20,
            independentSourcesCount: 7,
            severity: 'Critical',
            status: 'CRITICAL',
          };
        }
        return c;
      })
    );

    // Add high-priority activity
    const simLog: ActivityLog = {
      id: `ACT-${Date.now()}`,
      time: 'Just now',
      message: 'CRITICAL CRISIS DETECTED: Sector 4 Flooding (Priority 94/100) — Emergency dispatch recommended',
      type: 'alert',
      badge: 'Live Simulation',
    };
    setAiActivities((prev) => [simLog, ...prev.slice(0, 5)]);
  };

  return (
    <div id="crisislens-app-root" className="flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Persistent Left Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onNavigate={setCurrentPage}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        criticalCount={criticalCount}
        highCount={highCount}
        totalCrisesCount={crises.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50">
        {/* Persistent Top Telemetry Header with "Run Live Simulation" button */}
        <Header
          currentPage={currentPage}
          onOpenSimulation={() => setIsSimulationOpen(true)}
          onNavigate={setCurrentPage}
          criticalCount={criticalCount}
          highCount={highCount}
          totalReportsCount={totalProcessedCount}
        />

        {/* Scrollable Page Views Based on User PURPOSE */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {currentPage === 'command-center' && (
            <CommandCenterView
              crises={crises}
              topCrisis={topCrisis}
              recentReports={reports}
              aiActivities={aiActivities}
              totalReportsCount={totalProcessedCount}
              criticalCount={criticalCount}
              highCount={highCount}
              activeCrisesCount={crises.length}
              onNavigate={setCurrentPage}
              onSelectCrisis={(id) => {
                setSelectedCrisisId(id);
                const found = crises.find((c) => c.id === id);
                if (found) setDetailModalCrisis(found);
              }}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsView
              reports={reports}
              onAddReport={handleAddReport}
              onUpdateReportStatus={handleUpdateReportStatus}
              onNavigate={setCurrentPage}
              onSelectReportCluster={(clusterId) => {
                setSelectedCrisisId(clusterId);
                setCurrentPage('fusion');
              }}
            />
          )}

          {currentPage === 'fusion' && (
            <FusionView
              crises={crises}
              allReports={reports}
              selectedCrisisId={selectedCrisisId}
              onSelectCrisis={setSelectedCrisisId}
              onNavigateToPriority={(id) => {
                setSelectedCrisisId(id);
                setCurrentPage('priority');
              }}
              onOpenCrisisDetail={(crisis) => setDetailModalCrisis(crisis)}
            />
          )}

          {currentPage === 'priority' && (
            <PriorityView
              crises={crises}
              selectedCrisisId={selectedCrisisId}
              onSelectCrisis={setSelectedCrisisId}
              onNavigateToResponse={(id) => {
                setSelectedCrisisId(id);
                setCurrentPage('response');
              }}
              onNavigateToMap={(id) => {
                setSelectedCrisisId(id);
                setCurrentPage('map');
              }}
              onOpenCrisisDetail={(crisis) => setDetailModalCrisis(crisis)}
            />
          )}

          {currentPage === 'map' && (
            <MapView
              crises={crises}
              selectedCrisisId={selectedCrisisId}
              onSelectCrisis={setSelectedCrisisId}
              onNavigateToCrisis={handleNavigateToCrisis}
              onOpenCrisisDetail={(crisis) => setDetailModalCrisis(crisis)}
            />
          )}

          {currentPage === 'response' && (
            <ResponseView
              crises={crises}
              selectedCrisisId={selectedCrisisId}
              onSelectCrisis={setSelectedCrisisId}
              onAuthorizeAction={handleAuthorizeAction}
            />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsView
              totalReports={totalProcessedCount}
              uniqueCrises={crises.length}
            />
          )}
        </main>
      </div>

      {/* Live Emergency Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onApplySimulationResults={handleApplySimulationResults}
        onNavigateToCrisis={handleNavigateToCrisis}
      />

      {/* Reusable Crisis Detail Modal */}
      {detailModalCrisis && (
        <CrisisDetailModal
          crisis={detailModalCrisis}
          onClose={() => setDetailModalCrisis(null)}
          onNavigate={(page) => {
            setDetailModalCrisis(null);
            setSelectedCrisisId(detailModalCrisis.id);
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
}
