'use client';

import { LinkBudgetResult, LinkBudgetInput } from '@/lib/types';
import { formatNumber, formatDate, generateTextReport, copyToClipboard } from '@/lib/utils';
import { calculator } from '@/lib/calculator';
import { FieldValidation } from './FieldValidation';
import { useState } from 'react';

interface ResultDisplayProps {
  result: LinkBudgetResult;
  input: LinkBudgetInput;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, input }) => {
  const [copied, setCopied] = useState(false);
  const recommendations = calculator.getRecommendation(result);

  const handleCopy = async () => {
    const text = generateTextReport(input, result);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusEmoji = {
    PASS: '🟢',
    WARNING: '🟡',
    FAIL: '🔴',
  };

  const statusText = {
    PASS: 'AMAN',
    WARNING: 'HATI-HATI',
    FAIL: 'TIDAK AMAN',
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div
        className={`p-6 rounded-lg border-2 ${
          result.statusColor === 'green'
            ? 'bg-green-50 dark:bg-green-950 border-green-500'
            : result.statusColor === 'yellow'
              ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500'
              : 'bg-red-50 dark:bg-red-950 border-red-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statusEmoji[result.status]} {result.status} - {statusText[result.status]}
            </div>
            <div className="text-lg mt-2 text-gray-700 dark:text-gray-300">
              Margin Tersisa: <span className="font-semibold">{formatNumber(result.marginRemaining)} dB</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {((result.marginRemaining / result.budgetAvailable) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">of Budget</div>
              </div>
            </div>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                className="dark:stroke-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={
                  result.statusColor === 'green'
                    ? '#10b981'
                    : result.statusColor === 'yellow'
                      ? '#f59e0b'
                      : '#ef4444'
                }
                strokeWidth="2"
                strokeDasharray={`${(result.marginRemaining / result.budgetAvailable) * 282.7} 282.7`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Tx Power" value={`${result.budgetAvailable > 0 ? '+' : ''}${input.olt.txPower}`} unit="dBm" />
        <SummaryCard label="Rx Sensitivity" value={input.ont.rxSensitivity} unit="dBm" />
        <SummaryCard label="Budget Available" value={formatNumber(result.budgetAvailable)} unit="dB" />
        <SummaryCard label="Total Attenuation" value={formatNumber(result.totalAttenuation)} unit="dB" />
      </div>

      {/* Segment Breakdown */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          📋 Rincian Redaman Per Segment
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Komponen</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">Redaman (dB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {result.segmentCalculations.map((seg, idx) => (
                <React.Fragment key={idx}>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td colSpan={2} className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                      {seg.name} Segment
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">├─ Fiber Loss</td>
                    <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                      {formatNumber(seg.fiberLoss)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">├─ Splice Loss</td>
                    <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                      {formatNumber(seg.spliceLoss)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">├─ Connector Loss</td>
                    <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                      {formatNumber(seg.connectorLoss)}
                    </td>
                  </tr>
                  {seg.splitterInfo && (
                    <tr>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        ├─ Splitter ({seg.splitterInfo.ratio})
                      </td>
                      <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                        {formatNumber(seg.splitterInfo.loss)}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-blue-50 dark:bg-blue-950">
                    <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                      └─ Subtotal {seg.name}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                      {formatNumber(seg.segmentTotal)}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              <tr className="bg-gray-100 dark:bg-gray-800 font-bold">
                <td className="px-4 py-2 text-gray-900 dark:text-white">TOTAL ATTENUATION</td>
                <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                  {formatNumber(result.totalAttenuation)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          💡 Analisis & Rekomendasi
        </h3>

        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono"
            >
              {rec}
            </div>
          ))}
        </div>
      </div>

      {/* Field Validation */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <FieldValidation calculatedResult={result} input={input} />
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>⏰ Timestamp: {formatDate(result.timestamp)}</div>
          <div>📊 Topologi: {input.topology === 'topo1' ? 'OLT → OTB → ODC → ODP → ONT' : 'OLT → OTB → ODP → ONT'}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {copied ? '✅ Tersalin!' : '📋 Copy Hasil'}
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: string | number;
  unit: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, unit }) => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</div>
    <div className="text-xl font-bold text-gray-900 dark:text-white">
      {value}
      <span className="text-sm ml-1">{unit}</span>
    </div>
  </div>
);

import React from 'react';
