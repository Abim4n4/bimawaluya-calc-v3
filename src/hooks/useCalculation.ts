'use client';

import { useState, useCallback } from 'react';
import { LinkBudgetInput, LinkBudgetResult, TopologyId, SegmentData, WavelengthNm } from '@/lib/types';
import { calculator } from '@/lib/calculator';
import { validateFormInput } from '@/lib/utils';
import { TOPOLOGIES, PON_PRESETS } from '@/lib/constants';

export const useCalculation = () => {
  const [topology, setTopology] = useState<TopologyId | null>(null);
  const [result, setResult] = useState<LinkBudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<LinkBudgetInput>({
    topology: null,
    olt: {
      txPower: 3,
      rxSensitivity: -30,
    },
    segments: [],
    ont: {
      rxSensitivity: -30,
    },
    marginRequired: 3,
  });

  const selectTopology = useCallback((topoId: TopologyId) => {
    setTopology(topoId);
    const topoConfig = topoId === 'topo1' ? TOPOLOGIES.TOPO_1 : TOPOLOGIES.TOPO_2;
    
    const initialSegments: SegmentData[] = topoConfig.segments.map((seg) => ({
      name: seg.name,
      fiberLength: 5,
      wavelength: '1310' as WavelengthNm,
      splice: { count: 2, lossPerSplice: 0.1 },
      connector: { count: 1, lossPerConnector: 0.5 },
      ...(seg.hasSplitter && {
        splitter: {
          ratio: seg.splitterOptions[0] as any,
          isManual: false,
        },
      }),
    }));

    setFormData((prev) => ({
      ...prev,
      topology: topoId,
      segments: initialSegments,
    }));
    setResult(null);
    setError(null);
  }, []);

  const setOLTPreset = useCallback((presetKey: keyof typeof PON_PRESETS) => {
    const preset = PON_PRESETS[presetKey];
    setFormData((prev) => ({
      ...prev,
      olt: {
        txPower: preset.txPower,
        rxSensitivity: preset.rxSensitivity,
      },
      ont: {
        rxSensitivity: preset.rxSensitivity,
      },
    }));
  }, []);

  const updateSegment = useCallback(
    (segmentIndex: number, updates: Partial<SegmentData>) => {
      setFormData((prev) => {
        const newSegments = [...prev.segments];
        newSegments[segmentIndex] = {
          ...newSegments[segmentIndex],
          ...updates,
        };
        return {
          ...prev,
          segments: newSegments,
        };
      });
    },
    []
  );

  const updateOLT = useCallback((updates: Partial<LinkBudgetInput['olt']>) => {
    setFormData((prev) => ({
      ...prev,
      olt: { ...prev.olt, ...updates },
    }));
  }, []);

  const updateMargin = useCallback((margin: number) => {
    setFormData((prev) => ({
      ...prev,
      marginRequired: margin,
    }));
  }, []);

  const calculate = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      // Validate input
      const validation = validateFormInput(formData);
      if (!validation.valid) {
        setError(validation.errors.join('\n'));
        setLoading(false);
        return;
      }

      // Calculate
      const calcResult = calculator.calculateLinkBudget(formData);
      setResult(calcResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setTopology(null);
    setResult(null);
    setError(null);
    setFormData({
      topology: null,
      olt: {
        txPower: 3,
        rxSensitivity: -30,
      },
      segments: [],
      ont: {
        rxSensitivity: -30,
      },
      marginRequired: 3,
    });
  }, []);

  return {
    topology,
    formData,
    result,
    error,
    loading,
    selectTopology,
    setOLTPreset,
    updateSegment,
    updateOLT,
    updateMargin,
    calculate,
    reset,
  };
};
