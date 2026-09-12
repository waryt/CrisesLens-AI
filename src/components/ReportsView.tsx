import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  X,
  Send,
  Eye,
  Check,
  Layers,
  Copy,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Tag,
  FileText,
  Sparkles,
} from 'lucide-react';
import { EmergencyReport, ReportSource, CrisisType, SeverityLevel, ReportStatus } from '../types';
import { WorkflowBar, WorkflowStep } from './WorkflowBar';

interface ReportsViewProps {
  reports: EmergencyReport[];
  onAddReport: (report: Partial<EmergencyReport>) => void;
  onUpdateReportStatus?: (reportId: string, status: ReportStatus) => void;
  onSelectReportCluster?: (clusterId: string) => void;
  onNavigate?: (page: string) => void;
}

type ReportsWorkflowStep = 'incoming' | 'analyze' | 'review';

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onAddReport,
  onUpdateReportStatus,
  onSelectReportCluster,
  onNavigate,
}) => {
  const [activeStep, setActiveStep] = useState<ReportsWorkflowStep>('incoming');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Selected report ID for Analyze & Review workflows
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Derive the active selected report from the current reports prop
  const selectedReport = useMemo(() => {
    return reports.find((r) => r.id === selectedReportId) || reports[0] || null;
  }, [reports, selectedReportId]);

  // Backward compatibility alias for any existing code referencing inspectReport
  const inspectReport = selectedReport;
  const setInspectReport = (report: EmergencyReport | null) => {
    if (report) setSelectedReportId(report.id);
  };

  // New report modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReportText, setNewReportText] = useState('');
  const [newReportSource, setNewReportSource] = useState<ReportSource>('Citizen');
  const [newReportLocation, setNewReportLocation] = useState('Sector 4');
  const [newReportType, setNewReportType] = useState<CrisisType>('Flooding');
  const [newReportSeverity, setNewReportSeverity] = useState<SeverityLevel>('High');

  // Workflow steps: [ Incoming ] → [ Analyze ] → [ Review ]
  const workflowSteps: WorkflowStep<ReportsWorkflowStep>[] = [
    { id: 'incoming', label: 'Incoming', count: reports.length, description: 'Inbound reports feed' },
    { id: 'analyze', label: 'Analyze', description: 'AI Entity extraction & categorization' },
    { id: 'review', label: 'Review', description: 'Human operator validation' },
  ];

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch =
        searchQuery === '' ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSource = selectedSource === 'All' || r.source === selectedSource;
      const matchSeverity = selectedSeverity === 'All' || r.severity === selectedSeverity;
      const matchType = selectedType === 'All' || r.crisisType === selectedType;

      return matchSearch && matchSource && matchSeverity && matchType;
    });
  }, [reports, searchQuery, selectedSource, selectedSeverity, selectedType]);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportText.trim()) return;

    onAddReport({
      source: newReportSource,
      location: newReportLocation,
      text: newReportText.trim(),
      crisisType: newReportType,
      severity: newReportSeverity,
      status: 'Pending Analysis',
      time: 'Just now',
    });

    setNewReportText('');
    setShowAddModal(false);
  };

  return (
    <div id="reports-view" className="flex flex-col min-h-full">
      {/* Top Horizontal Workflow: [ Incoming ] → [ Analyze ] → [ Review ] */}
      <WorkflowBar<ReportsWorkflowStep>
        title="Emergency Reports Intake"
        subtitle="Multi-channel citizen, police, hospital, and helpline reports"
        steps={workflowSteps}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />

      {/* Main Content Area */}
      <div className="p-6 space-y-5 max-w-6xl mx-auto w-full flex-1">
        {/* WORKFLOW 1: INCOMING REPORTS (TABLE / LIST) */}
        {activeStep === 'incoming' && (
          <div className="space-y-4">
            {/* Search, Filter & Action Bar */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by keywords, location, or report ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white placeholder:text-slate-400"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Source Filter */}
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Sources</option>
                  <option value="Citizen">Citizen</option>
                  <option value="Police">Police</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Helpline">Helpline</option>
                </select>

                {/* Severity Filter */}
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {/* Crisis Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Crisis Types</option>
                  <option value="Flooding">Flooding</option>
                  <option value="Fire">Fire</option>
                  <option value="Road Blockage">Road Blockage</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Power Grid Failure">Power Grid Failure</option>
                </select>

                {/* Reset Filters button */}
                {(selectedSource !== 'All' || selectedSeverity !== 'All' || selectedType !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSource('All');
                      setSelectedSeverity('All');
                      setSelectedType('All');
                    }}
                    className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Reset
                  </button>
                )}

                {/* Add Report Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ml-auto shadow-2xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Report</span>
                </button>
              </div>
            </div>

            {/* Clean Table / List of Reports */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 min-w-[280px]">Report Text</th>
                      <th className="py-3 px-4">Crisis Type</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredReports.map((report, idx) => (
                      <tr key={`${report.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                        {/* Source */}
                        <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                          {report.source}
                        </td>

                        {/* Time */}
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {report.time}
                        </td>

                        {/* Location */}
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {report.location}
                        </td>

                        {/* Report Text */}
                        <td className="py-3 px-4 text-slate-800">
                          <p className="line-clamp-2 max-w-xl">{report.text}</p>
                        </td>

                        {/* Crisis Type */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-slate-600 font-medium">
                            {report.crisisType}
                          </span>
                        </td>

                        {/* Severity (Status Highlighted) */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              report.severity === 'Critical'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : report.severity === 'High'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : report.severity === 'Medium'
                                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {report.severity}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              report.status === 'Fused into Crisis'
                                ? 'bg-slate-100 text-slate-800 font-medium'
                                : report.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedReportId(report.id);
                                setActiveStep('analyze');
                              }}
                              className="text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
                            >
                              Analyze
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReportId(report.id);
                                setActiveStep('review');
                              }}
                              className="text-xs text-slate-900 hover:text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors cursor-pointer"
                            >
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredReports.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No reports matched your search or filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORKFLOW 2: ANALYZE REPORTS */}
        {activeStep === 'analyze' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Entity & Intent Extraction</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    TREC Incident Streams NLP extraction from inbound message
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">
                    Report {selectedReport ? selectedReport.id : 'None'}
                  </span>
                  <button
                    onClick={() => setActiveStep('incoming')}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    ← Back to incoming reports
                  </button>
                </div>
              </div>

              {selectedReport ? (
                <div className="space-y-4">
                  {/* Selected report banner */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{selectedReport.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-medium text-slate-900">{selectedReport.source}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{selectedReport.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            selectedReport.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {selectedReport.status}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            selectedReport.severity === 'Critical'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : selectedReport.severity === 'High'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {selectedReport.severity}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">"{selectedReport.text}"</p>
                  </div>

                  {/* Extracted Entities Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white border border-slate-200 rounded-md">
                      <div className="text-[11px] text-slate-500">Extracted Category</div>
                      <div className="font-semibold text-slate-900 mt-0.5">
                        {selectedReport.informationCategory || selectedReport.crisisType}
                      </div>
                      <div className="text-[10px] text-emerald-600 mt-1">Confidence: 94.8%</div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-md">
                      <div className="text-[11px] text-slate-500">Hazard / Infrastructure</div>
                      <div className="font-semibold text-slate-900 mt-0.5">
                        {selectedReport.entities?.infrastructureAffected || selectedReport.location}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Hazard Level: {selectedReport.entities?.hazardLevel || 'Severe'}
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-md">
                      <div className="text-[11px] text-slate-500">Urgency Assessment</div>
                      <div className="font-semibold text-slate-900 mt-0.5 font-mono">
                        {selectedReport.entities?.urgencyScore || 90}/100
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Corroboration: {Math.round((selectedReport.entities?.corroborationConfidence || 0.9) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      Step 2 of 3 • Proceed to review to confirm status or adjust classification
                    </span>
                    <button
                      onClick={() => setActiveStep('review')}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Proceed to Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">
                  Select a report to view entity analysis.
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORKFLOW 3: REVIEW REPORTS */}
        {activeStep === 'review' && (
          <div className="space-y-5">
            {/* Status notice toast */}
            {statusNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800 shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{statusNotice}</span>
                </div>
                <button
                  onClick={() => setStatusNotice(null)}
                  className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Selected Report Detailed Review Card */}
            {selectedReport ? (
              <div className="bg-white rounded-lg border-2 border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white">
                        Selected Report for Review
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {selectedReport.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600">{selectedReport.source}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600">{selectedReport.location}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Timestamp: {selectedReport.time} • Coordinates: Grid ({Math.round(selectedReport.coordinates.x)}, {Math.round(selectedReport.coordinates.y)})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${
                        selectedReport.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : selectedReport.status === 'Fused into Crisis'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {selectedReport.status === 'Verified' && '✓ '}
                      {selectedReport.status}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${
                        selectedReport.severity === 'Critical'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : selectedReport.severity === 'High'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {selectedReport.severity}
                    </span>
                  </div>
                </div>

                {/* Quoted Civilian / Origin Message */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Inbound Transmission Text
                  </div>
                  <p className="text-xs text-slate-900 font-medium leading-relaxed">
                    "{selectedReport.text}"
                  </p>
                </div>

                {/* AI Extracted Entities & Corroboration Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-1">
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Category Classification</span>
                      <Tag className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="font-semibold text-slate-900 text-xs">
                      {selectedReport.informationCategory || selectedReport.crisisType}
                    </div>
                    <div className="text-[10px] text-emerald-600">
                      NLP Confidence: {Math.round((selectedReport.entities?.corroborationConfidence || 0.94) * 100)}%
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-1">
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Assessed Urgency</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedReport.entities?.urgencyScore || 85}/100
                      </span>
                    </div>
                    {/* Urgency meter */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (selectedReport.entities?.urgencyScore || 85) >= 80
                            ? 'bg-red-500'
                            : (selectedReport.entities?.urgencyScore || 85) >= 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${selectedReport.entities?.urgencyScore || 85}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Severity: {selectedReport.severity} Level
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-1">
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Hazard & Infrastructure</span>
                      <MapPin className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="font-semibold text-slate-900 text-xs truncate">
                      {selectedReport.entities?.infrastructureAffected || selectedReport.location}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Cluster: {selectedReport.clusterId ? selectedReport.clusterId : 'Pending cluster assignment'}
                    </div>
                  </div>
                </div>

                {/* Operator Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    {selectedReport.status === 'Verified' ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified by {selectedReport.verifiedBy || 'Duty Officer'} • Status confirmed
                      </span>
                    ) : (
                      <span>Awaiting human operator confirmation to finalize report verification</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveStep('analyze')}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium cursor-pointer transition-colors"
                    >
                      ← Re-inspect NLP
                    </button>

                    {selectedReport.status !== 'Verified' ? (
                      <button
                        onClick={() => {
                          if (onUpdateReportStatus) {
                            onUpdateReportStatus(selectedReport.id, 'Verified');
                          }
                          setStatusNotice(`Report ${selectedReport.id} confirmed and verified.`);
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Confirm & Verify Report</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (onUpdateReportStatus) {
                            onUpdateReportStatus(selectedReport.id, 'Pending Analysis');
                          }
                          setStatusNotice(`Report ${selectedReport.id} reset to pending analysis.`);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium cursor-pointer transition-colors"
                      >
                        Re-open Analysis
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (onUpdateReportStatus) {
                          onUpdateReportStatus(selectedReport.id, 'Fused into Crisis');
                        }
                        setStatusNotice(`Report ${selectedReport.id} marked as Fused.`);
                        if (selectedReport.clusterId && onSelectReportCluster) {
                          onSelectReportCluster(selectedReport.clusterId);
                        } else {
                          onNavigate?.('fusion');
                        }
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>Send to Crisis Fusion</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onUpdateReportStatus) {
                          onUpdateReportStatus(selectedReport.id, 'Duplicate Grouped');
                        }
                        setStatusNotice(`Report ${selectedReport.id} marked as duplicate.`);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark Duplicate</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-xs text-slate-500">
                No report selected. Select a report from the queue below to review.
              </div>
            )}

            {/* Operator Review Queue & Switcher */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Operator Review Queue</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any report to load its AI extraction and confirm or adjust status
                  </p>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                      reviewFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({reports.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('pending')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                      reviewFilter === 'pending'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending ({reports.filter((r) => r.status === 'Pending Analysis').length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('verified')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                      reviewFilter === 'verified'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Verified ({reports.filter((r) => r.status === 'Verified').length})
                  </button>
                </div>
              </div>

              {/* Reports list in review queue */}
              <div className="space-y-2.5">
                {reports
                  .filter((report) => {
                    if (reviewFilter === 'pending') return report.status === 'Pending Analysis';
                    if (reviewFilter === 'verified') return report.status === 'Verified';
                    return true;
                  })
                  .slice(0, 10)
                  .map((report, idx) => {
                    const isSelected = selectedReport?.id === report.id;
                    return (
                      <div
                        key={`${report.id}-${idx}`}
                        onClick={() => setSelectedReportId(report.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                          isSelected
                            ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900/15'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-slate-900">{report.id}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-medium text-slate-800">{report.source}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{report.location}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400">{report.time}</span>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-900 text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 line-clamp-1">{report.text}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              report.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : report.status === 'Fused into Crisis'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {report.status}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReportId(report.id);
                            }}
                            className={`px-2.5 py-1 rounded font-medium text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isSelected ? 'Reviewing' : 'Review'}
                          </button>

                          {report.status !== 'Verified' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onUpdateReportStatus) {
                                  onUpdateReportStatus(report.id, 'Verified');
                                }
                                setStatusNotice(`Report ${report.id} confirmed and verified.`);
                              }}
                              className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1"
                              title="Quick confirm"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Verify</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Simulate Inbound Report</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Report Message</label>
                <textarea
                  required
                  rows={3}
                  value={newReportText}
                  onChange={(e) => setNewReportText(e.target.value)}
                  placeholder="e.g. Water rapidly rising over 4 feet on 4th Ave, civilians stranded..."
                  className="w-full p-2.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Source</label>
                  <select
                    value={newReportSource}
                    onChange={(e) => setNewReportSource(e.target.value as ReportSource)}
                    className="w-full p-2 rounded-md border border-slate-200 bg-white"
                  >
                    <option value="Citizen">Citizen</option>
                    <option value="Police">Police</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Helpline">Helpline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Severity</label>
                  <select
                    value={newReportSeverity}
                    onChange={(e) => setNewReportSeverity(e.target.value as SeverityLevel)}
                    className="w-full p-2 rounded-md border border-slate-200 bg-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newReportLocation}
                    onChange={(e) => setNewReportLocation(e.target.value)}
                    className="w-full p-2 rounded-md border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Crisis Type</label>
                  <select
                    value={newReportType}
                    onChange={(e) => setNewReportType(e.target.value as CrisisType)}
                    className="w-full p-2 rounded-md border border-slate-200 bg-white"
                  >
                    <option value="Flooding">Flooding</option>
                    <option value="Fire">Fire</option>
                    <option value="Road Blockage">Road Blockage</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Power Grid Failure">Power Grid Failure</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
