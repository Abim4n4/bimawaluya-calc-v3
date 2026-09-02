'use client';

import { LinkBudgetInput, SegmentData, TopologyId } from '@/lib/types';
import { PON_PRESETS, SPLITTER_STANDARDS, WAVELENGTH_ATTENUATION, TOPOLOGIES } from '@/lib/constants';

interface SegmentInputFormProps {
  topology: TopologyId;
  formData: LinkBudgetInput;
  onOLTChange: (updates: Partial<LinkBudgetInput['olt']>) => void;
  onSegmentChange: (index: number, updates: Partial<SegmentData>) => void;
  onMarginChange: (margin: number) => void;
  onCalculate: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const SegmentInputForm: React.FC<SegmentInputFormProps> = ({
  topology,
  formData,
  onOLTChange,
  onSegmentChange,
  onMarginChange,
  onCalculate,
  onReset,
  isLoading,
}) => {
  const topoConfig = topology === 'topo1' ? TOPOLOGIES.TOPO_1 : TOPOLOGIES.TOPO_2;

  return (
    <div className="space-y-6">
      {/* OLT Section */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          📡 OLT (TRANSMITTER)
        </h3>

        <div className="space-y-4">
          {/* Preset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preset Teknologi:
            </label>
            <select
              onChange={(e) => {
                const key = e.target.value as keyof typeof PON_PRESETS;
                if (key) {
                  const preset = PON_PRESETS[key];
                  onOLTChange({
                    txPower: preset.txPower,
                    rxSensitivity: preset.rxSensitivity,
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">-- Pilih Preset --</option>
              {Object.entries(PON_PRESETS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tx Power */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tx Power (dBm):
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.olt.txPower}
                onChange={(e) => onOLTChange({ txPower: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Rx Sensitivity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rx Sensitivity (dBm):
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.olt.rxSensitivity}
                onChange={(e) => onOLTChange({ rxSensitivity: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Segments */}
      {formData.segments.map((segment, index) => (
        <SegmentCard
          key={index}
          index={index}
          segment={segment}
          topoConfig={topoConfig}
          onChange={(updates) => onSegmentChange(index, updates)}
        />
      ))}

      {/* Margin Section */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          🛡️ Margin Keamanan
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min Margin (dB):
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.marginRequired}
            onChange={(e) => onMarginChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ℹ️ Untuk proteksi aging, penyambungan ulang, dan variasi suhu
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCalculate}
          disabled={isLoading || !formData.topology}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isLoading ? 'Menghitung...' : '🧮 Hitung Link Budget'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

interface SegmentCardProps {
  index: number;
  segment: SegmentData;
  topoConfig: any;
  onChange: (updates: Partial<SegmentData>) => void;
}

const SegmentCard: React.FC<SegmentCardProps> = ({
  index,
  segment,
  topoConfig,
  onChange,
}) => {
  const hasSplitter = topoConfig.segments[index]?.hasSplitter;
  const splitterOptions = topoConfig.segments[index]?.splitterOptions;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        🟡 Segment {index + 1}: {segment.name}
      </h3>

      <div className="space-y-4">
        {/* Fiber Length */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Panjang Serat (km):
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={segment.fiberLength}
              onChange={(e) => onChange({ fiberLength: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Wavelength */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Wavelength (nm):
            </label>
            <select
              value={segment.wavelength}
              onChange={(e) => onChange({ wavelength: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {Object.entries(WAVELENGTH_ATTENUATION).map(([wl, att]) => (
                <option key={wl} value={wl}>
                  {wl} nm ({att} dB/km)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Splice */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jumlah Splice:
            </label>
            <input
              type="number"
              min="0"
              value={segment.splice.count}
              onChange={(e) =>
                onChange({
                  splice: { ...segment.splice, count: parseInt(e.target.value) },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loss per Splice (dB):
            </label>
            <input
              type="number"
              step="0.01"
              value={segment.splice.lossPerSplice}
              onChange={(e) =>
                onChange({
                  splice: { ...segment.splice, lossPerSplice: parseFloat(e.target.value) },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Connector */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jumlah Konektor:
            </label>
            <input
              type="number"
              min="0"
              value={segment.connector.count}
              onChange={(e) =>
                onChange({
                  connector: { ...segment.connector, count: parseInt(e.target.value) },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loss per Konektor (dB):
            </label>
            <input
              type="number"
              step="0.01"
              value={segment.connector.lossPerConnector}
              onChange={(e) =>
                onChange({
                  connector: { ...segment.connector, lossPerConnector: parseFloat(e.target.value) },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Splitter (conditional) */}
        {hasSplitter && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Splitter:
            </label>

            <div className="space-y-2">
              {splitterOptions?.map((ratio: string) => (
                <label key={ratio} className="flex items-center">
                  <input
                    type="radio"
                    name={`splitter-${index}`}
                    value={ratio}
                    checked={
                      segment.splitter && segment.splitter.ratio === ratio && !segment.splitter.isManual
                    }
                    onChange={() =>
                      onChange({
                        splitter: { ratio: ratio as any, isManual: false },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {ratio} ({SPLITTER_STANDARDS[ratio as keyof typeof SPLITTER_STANDARDS]?.loss} dB)
                  </span>
                </label>
              ))}

              <label className="flex items-center">
                <input
                  type="radio"
                  name={`splitter-${index}`}
                  checked={segment.splitter?.isManual || false}
                  onChange={() =>
                    onChange({
                      splitter: { ratio: '1:8', isManual: true, manualLoss: 9 },
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Manual:</span>
                {segment.splitter?.isManual && (
                  <input
                    type="number"
                    step="0.1"
                    value={segment.splitter.manualLoss || 0}
                    onChange={(e) =>
                      onChange({
                        splitter: {
                          ...segment.splitter!,
                          manualLoss: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="ml-2 w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                )}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
