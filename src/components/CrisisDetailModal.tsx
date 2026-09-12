import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  MapPin,
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  Radio,
} from 'lucide-react';
import { CrisisCluster, EmergencyReport } from '../types';

interface CrisisDetailModalProps {
  crisis: CrisisCluster | null;
  reports?: EmergencyReport[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResponse?: (crisisId: string) => void;
  onNavigateToMap?: (crisisId: string) => void;
  onAuthorizeAction?: (crisisId: string, actionId: string) => void;
}

type DetailTab = 'overview' | 'evidence' | 'timeline' | 'recommendation';

export const CrisisDetailModal: React.FC<CrisisDetailModalProps> = ({
  crisis,
  reports = [],
  isOpen,
  onClose,
  onNavigateToResponse,
  onNavigateToMap,
  onAuthorizeAction,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!isOpen || !crisis) return null;

  const isCritical = crisis.severity === 'Critical';
  const isHigh = crisis.severity === 'High';

  // Find related reports
  const relatedReports = reports.filter((r) =>
    crisis.reportIds ? crisis.reportIds.includes(r.id) : r.clusterId === crisis.id
  );

  return (
    <div
      id="crisis-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                CRISIS {crisis.code}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isCritical
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : isHigh
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}
              >
                {crisis.severity.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {crisis.relatedReportsCount} reports • {crisis.independentSourcesCount} sources
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{crisis.name}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{crisis.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Priority</div>
              <div
                className={`text-2xl font-bold font-mono ${
                  isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-slate-800'
                }`}
              >
                {crisis.priorityScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs: [ Overview ] [ Evidence ] [ Timeline ] [ Recommendation ] */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-1 bg-white">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'evidence', label: `Evidence (${relatedReports.length || crisis.relatedReportsCount})` },
              { id: 'timeline', label: 'Timeline' },
              { id: 'recommendation', label: 'Recommendation' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Why is this critical? */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Why is this {crisis.severity.toLowerCase()}?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Medical emergency reported</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Road blockage on primary route</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multiple independent sources ({crisis.independentSourcesCount})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Situation escalating (+18% surge rate)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <span className="font-medium text-slate-800">Summary: </span>
                  {crisis.explanation}
                </div>
              </div>

              {/* AI RECOMMENDATION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
                    AI Recommendation
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Advisory for human responders
                  </span>
                </div>

                <div className="space-y-2">
                  {crisis.recommendedActions.map((action, idx) => (
                    <div
                      key={action.id}
                      className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-medium text-slate-900 text-xs">
                            {action.title}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {action.rationale}
                          </p>
                          <div className="text-[10px] text-slate-400 mt-1 font-mono">
                            Unit: {action.targetTeam}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ${
                          action.status === 'Dispatched'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Corroborating incoming reports mapped into this crisis cluster:
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {(relatedReports.length > 0 ? relatedReports : reports.slice(0, 5)).map((rep) => (
                  <div key={rep.id} className="p-3 hover:bg-slate-50 transition-colors text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-slate-700">{rep.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-medium text-slate-800">{rep.source}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{rep.time}</span>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                          rep.severity === 'Critical'
                            ? 'bg-red-50 text-red-700'
                            : rep.severity === 'High'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rep.severity}
                      </span>
                    </div>
                    <p className="text-slate-600">{rep.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Chronological sequence of crisis telemetry and escalation:
              </div>
              <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-2">
                {crisis.timeline.map((event, idx) => (
                  <div key={idx} className="relative space-y-0.5 text-xs">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white" />
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <span>{event.time}</span>
                      <span>•</span>
                      <span>{event.source}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{event.event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RECOMMENDATION */}
          {activeTab === 'recommendation' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Actionable response dispatch protocols for human commanders:
              </div>
              <div className="space-y-3">
                {crisis.recommendedActions.map((action, idx) => (
                  <div
                    key={action.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900">
                        {idx + 1}. {action.title}
                      </div>
                      <button
                        onClick={() => onAuthorizeAction && onAuthorizeAction(crisis.id, action.id)}
                        className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          action.status === 'Dispatched'
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {action.status === 'Dispatched' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Dispatched</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch Team</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-slate-600">{action.rationale}</p>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Target Team: <span className="text-slate-800 font-medium">{action.targetTeam}</span> •
                      Personnel: {action.estimatedPersonnel}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onNavigateToResponse && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToResponse(crisis.id);
                }}
                className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Open Response Protocols</span>
              </button>
            )}
            {onNavigateToMap && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToMap(crisis.id);
                }}
                className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>View on Map</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
