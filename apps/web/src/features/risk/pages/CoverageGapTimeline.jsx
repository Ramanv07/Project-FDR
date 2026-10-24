import React, { useState, useEffect } from 'react';
import { riskApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import Select from '../../../components/ui/Select';
import Spinner from '../../../components/feedback/Spinner';
import { formatDate } from '../../../lib/format';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CoverageGapTimeline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstId, setSelectedInstId] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await riskApi.getCoverageGaps();
        setData(res);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  const displayedInstitutions =
    selectedInstId === 'all'
      ? data
      : data.filter((d) => d.institution.id === selectedInstId);

  return (
    <div>
      <PageHeader
        title="Coverage gap timeline"
        description="Auditing continuous FDR coverage without lapses or uncovered statutory periods"
        action={
          <div className="w-64">
            <Select
              value={selectedInstId}
              onChange={(val) => setSelectedInstId(val)}
              options={[
                { value: 'all', label: 'All institutions' },
                ...data.map((d) => ({
                  value: d.institution.id,
                  label: d.institution.name,
                })),
              ]}
            />
          </div>
        }
      />

      <div className="space-y-6">
        {displayedInstitutions.map((item) => {
          const { institution, gaps, covered, hasGaps, totalGapDays } = item;

          return (
            <div
              key={institution.id}
              className={`border rounded bg-white p-5 ${
                hasGaps ? 'border-status-red' : 'border-hairline'
              }`}
            >
              {/* Institution Header with Gap Alert Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-surface-200 gap-2 mb-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-900">{institution.name}</h2>
                  <p className="text-xs text-gray-500">
                    AICTE ID: {institution.aicteId} • {institution.state}
                  </p>
                </div>

                {hasGaps ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-status-red text-xs font-medium border border-red-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      {gaps.length} coverage gap ({totalGapDays} days uncovered)
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 text-status-green text-xs font-medium border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Continuous valid coverage</span>
                  </div>
                )}
              </div>

              {/* Validity Periods and Gap Visualization */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-gray-700">FDR validity timelines:</p>

                {covered.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No FDR records on ledger.</p>
                ) : (
                  <div className="space-y-2">
                    {covered.map((cov, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row md:items-center gap-3 text-xs bg-surface-50 p-2.5 rounded border border-surface-200"
                      >
                        <span className="font-mono font-medium text-navy-800 min-w-[130px]">
                          FDR #{cov.fdrNumber}
                        </span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-gray-500 text-[11px] min-w-[80px]">
                            {formatDate(cov.start)}
                          </span>
                          <div className="flex-1 h-3 bg-navy-700 rounded-sm" title={`Valid from ${formatDate(cov.start)} to ${formatDate(cov.end)}`} />
                          <span className="text-gray-500 text-[11px] min-w-[80px] text-right">
                            {formatDate(cov.end)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uncovered Gaps Highlighted in Red with Day Count */}
                {gaps.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-hairline space-y-2">
                    <p className="text-xs font-semibold text-status-red">
                      Identified statutory lapse periods:
                    </p>
                    {gaps.map((gap, gIdx) => (
                      <div
                        key={gIdx}
                        className="flex items-center justify-between p-2.5 bg-red-50 border border-status-red rounded text-xs text-status-red"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-status-red flex-shrink-0" />
                          <span>
                            Uncovered period from{' '}
                            <strong>{formatDate(gap.start)}</strong> to{' '}
                            <strong>{formatDate(gap.end)}</strong>
                          </span>
                        </div>
                        <span className="font-semibold text-xs tabular-nums">
                          {gap.days} {gap.days === 1 ? 'day' : 'days'} gap
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
