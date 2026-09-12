import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  AlertCircle,
} from 'lucide-react';
import { PageId } from '../types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySimulationResults: () => void;
  onNavigateToCrisis: (crisisId: string, page: PageId) => void;
}

type SimStage =
  | 'idle'
  | 'receiving'
  | 'analyzing'
  | 'finding'
  | 'fusing'
  | 'calculating'
  | 'completed';

interface SimStepDef {
  id: SimStage;
  num: number;
  label: string;
  detail: string;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  onApplySimulationResults,
  onNavigateToCrisis,
}) => {
  const [stage, setStage] = useState<SimStage>('idle');
  const [progress, setProgress] = useState(0);

  const steps: SimStepDef[] = [
    {
      id: 'receiving',
      num: 1,
      label: 'Receiving reports',
      detail: 'Ingesting 20 multi-channel reports from citizens, 911 calls, and EMS dispatch...',
    },
    {
      id: 'analyzing',
      num: 2,
      label: 'Analyzing reports',
      detail: 'Extracting location entities, hazard categories, and life-safety markers...',
    },
    {
      id: 'finding',
      num: 3,
      label: 'Finding similar reports',
      detail: 'Matching cosine semantic vectors within a 450-meter geographic radius...',
    },
    {
      id: 'fusing',
      num: 4,
      label: 'Fusing reports',
      detail: 'Merging duplicates and synthesizing into a unified incident cluster...',
    },
    {
      id: 'calculating',
      num: 5,
      label: 'Calculating priority',
      detail: 'Evaluating life threat, escalation velocity, and infrastructure impact scores...',
    },
    {
      id: 'completed',
      num: 6,
      label: 'Updating dashboard',
      detail: 'Triage metrics refreshed: Sector 4 Flooding elevated to Priority #1 (Score: 94/100).',
    },
  ];

  const getStepIndex = (s: SimStage): number => {
    switch (s) {
      case 'idle':
        return 0;
      case 'receiving':
        return 1;
      case 'analyzing':
        return 2;
      case 'finding':
        return 3;
      case 'fusing':
        return 4;
      case 'calculating':
        return 5;
      case 'completed':
        return 6;
    }
  };

  const startSimulation = () => {
    setStage('receiving');
    setProgress(18);

    const t1 = setTimeout(() => {
      setStage('analyzing');
      setProgress(36);
    }, 1000);

    const t2 = setTimeout(() => {
      setStage('finding');
      setProgress(55);
    }, 2000);

    const t3 = setTimeout(() => {
      setStage('fusing');
      setProgress(74);
    }, 3000);

    const t4 = setTimeout(() => {
      setStage('calculating');
      setProgress(90);
    }, 4000);

    const t5 = setTimeout(() => {
      setStage('completed');
      setProgress(100);
      onApplySimulationResults();
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  };

  useEffect(() => {
    if (!isOpen) {
      setStage('idle');
      setProgress(0);
      return;
    }

    const cleanup = startSimulation();
    return cleanup;
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStepNum = getStepIndex(stage);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div
        id="simulation-modal-container"
        className="bg-white border border-slate-200 rounded-xl max-w-xl w-full shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Incident Simulation</h3>
              <p className="text-xs text-slate-500">
                Automated multi-stage report fusion and triage demonstration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                {stage === 'completed'
                  ? 'Simulation Completed'
                  : `Processing Step ${currentStepNum} of 6...`}
              </span>
              <span className="font-mono text-slate-500">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 6 Clean Visual Steps */}
          <div className="space-y-2 pt-1">
            {steps.map((step) => {
              const isPast = currentStepNum > step.num || stage === 'completed';
              const isCurrent = stage === step.id;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border text-xs transition-colors flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900'
                      : isPast
                      ? 'bg-white border-slate-200'
                      : 'bg-white border-slate-100 opacity-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{step.label}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-medium text-slate-600 animate-pulse">
                          Running...
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[10px] font-medium text-emerald-700">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcome banner when completed */}
          {stage === 'completed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Simulation Result: Crisis Priority #1 Detected</span>
              </div>
              <p className="text-slate-700 text-[11px]">
                <strong>Sector 4 Flooding</strong> has been synthesized from 20 reports across 7 independent sources. Priority score updated to <strong>94/100 (Critical)</strong> with 4 recommended response protocols.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => startSimulation()}
            className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rerun Simulation</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Close
            </button>

            {stage === 'completed' && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToCrisis('CRISIS-17', 'priority');
                }}
                className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>View Priority Ranking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
