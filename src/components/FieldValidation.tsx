'use client';

import { LinkBudgetResult, LinkBudgetInput } from '@/lib/types';
import { formatNumber, formatDate } from '@/lib/utils';
import { useState } from 'react';

interface FieldValidationProps {
  calculatedResult: LinkBudgetResult;
  input: LinkBudgetInput;
}

export const FieldValidation: React.FC<FieldValidationProps> = ({
  calculatedResult,
  input,
}) => {
  const [showValidation, setShowValidation] = useState(false);
  const [actualMargin, setActualMargin] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [validated, setValidated] = useState(false);

  const handleValidate = () => {
    if (actualMargin === null) {
      alert('Masukkan actual margin dari OPM measurement');
      return;
    }

    setValidated(true);
  };

  const discrepancy = actualMargin !== null 
    ? actualMargin - calculatedResult.marginRemaining 
    : null;

  const discrepancyPercent = actualMargin !== null && calculatedResult.marginRemaining !== 0
    ? ((discrepancy! / calculatedResult.marginRemaining) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Toggle Validation */}
      <button
        onClick={() => setShowValidation(!showValidation)}
        className="w-full p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex items-center justify-between"
      >
        <span className="font-medium">📊 Validasi Dengan OPM Measurement</span>
        <span>{showValidation ? '▼' : '▶'}</span>
      </button>

      {/* Validation Form */}
      {showValidation && (
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-4">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              ℹ️ <strong>Langkah:</strong>
            </p>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-decimal">
              <li>Buka OPM (Optical Power Meter)</li>
              <li>Ukur Tx power di OLT → catat nilai</li>
              <li>Ukur Rx power di ONT → catat nilai</li>
              <li>Hitung margin: Tx - Rx = Actual Margin (dalam dB)</li>
              <li>Input actual margin di bawah</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Actual Margin dari OPM (dB):
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Contoh: 4.5"
              value={actualMargin ?? ''}
              onChange={(e) => setActualMargin(parseFloat(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Calculated: {formatNumber(calculatedResult.marginRemaining)} dB
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan Lapangan (opsional):
            </label>
            <textarea
              placeholder="Contoh: Kabel rusak di tiang 5, splitter basah, dsb"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <button
            onClick={handleValidate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            ✓ Validasi Measurement
          </button>
        </div>
      )}

      {/* Validation Results */}
      {validated && actualMargin !== null && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            📈 Hasil Validasi
          </h4>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">
                    Metrik
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">
                    Calculated
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">
                    Actual (OPM)
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">
                    Diff
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">Margin (dB)</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900 dark:text-white">
                    {formatNumber(calculatedResult.marginRemaining)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900 dark:text-white">
                    {formatNumber(actualMargin)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono font-semibold ${
                      discrepancy! > 0
                        ? 'text-green-600 dark:text-green-400'
                        : discrepancy! < -1
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {discrepancy! > 0 ? '+' : ''}{formatNumber(discrepancy!)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Accuracy Assessment */}
          <div
            className={`p-3 rounded-lg border ${
              Math.abs(discrepancyPercent) <= 10
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                : Math.abs(discrepancyPercent) <= 20
                  ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                  : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
            }`}
          >
            <div
              className={`text-sm font-semibold ${
                Math.abs(discrepancyPercent) <= 10
                  ? 'text-green-700 dark:text-green-300'
                  : Math.abs(discrepancyPercent) <= 20
                    ? 'text-yellow-700 dark:text-yellow-300'
                    : 'text-red-700 dark:text-red-300'
              }`}
            >
              {Math.abs(discrepancyPercent) <= 10
                ? '✅ Akurasi Tinggi'
                : Math.abs(discrepancyPercent) <= 20
                  ? '⚠️ Akurasi Sedang'
                  : '❌ Akurasi Rendah'}
            </div>
            <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">
              Perbedaan: {discrepancyPercent > 0 ? '+' : ''}{formatNumber(discrepancyPercent)}%
            </p>
          </div>

          {/* Interpretation & Recommendations */}
          <div className="space-y-2">
            <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
              💡 Interpretasi:
            </h5>

            {discrepancy! > 0 && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>✅ <strong>Actual lebih baik dari calculated</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  → Ini bagus! Mungkin component lebih baik dari expected atau
                  penyambungan lebih rapi.
                </p>
              </div>
            )}

            {discrepancy! < -1 && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>⚠️ <strong>Actual lebih buruk dari calculated</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  → Ada faktor lapangan yang tidak dihitung:
                </p>
                <ul className="text-xs list-disc ml-4 mt-1 text-gray-600 dark:text-gray-400">
                  <li>Connector/splice berkualitas rendah</li>
                  <li>Serat terlalu banyak ditekuk (bending loss)</li>
                  <li>Kondisi kelembaban tinggi (moisture)</li>
                  <li>Connector kotor atau tidak sesuai standar</li>
                  <li>Pengukuran OPM tidak akurat?</li>
                </ul>
              </div>
            )}

            {discrepancy! >= -1 && discrepancy! <= 0 && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>✓ <strong>Actual sesuai dengan calculated</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  → Model calculation akurat untuk kondisi lapangan ini
                </p>
              </div>
            )}
          </div>

          {notes && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Catatan Lapangan:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          )}

          {/* Export Validation Data */}
          <button
            onClick={() => {
              const data = `
BimaWaluya LinkBug - Field Validation Report
Generated: ${formatDate(new Date())}

CALCULATED vs ACTUAL:
- Calculated Margin: ${formatNumber(calculatedResult.marginRemaining)} dB
- Actual Margin (OPM): ${formatNumber(actualMargin)} dB
- Difference: ${discrepancy! > 0 ? '+' : ''}${formatNumber(discrepancy!)} dB (${formatNumber(discrepancyPercent)}%)

FIELD NOTES:
${notes || '(No notes)'}

TOPOLOGY: ${input.topology === 'topo1' ? 'OLT→OTB→ODC→ODP→ONT' : 'OLT→OTB→ODP→ONT'}
              `.trim();
              navigator.clipboard.writeText(data);
              alert('✅ Validation data copied!');
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            📋 Copy Validation Report
          </button>
        </div>
      )}
    </div>
  );
};
