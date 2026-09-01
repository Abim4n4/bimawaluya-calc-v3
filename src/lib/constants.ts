// Splitter Loss Standards (dB)
export const SPLITTER_STANDARDS = {
  "1:2": { loss: 3.5, name: "1:2 Splitter" },
  "1:4": { loss: 6, name: "1:4 Splitter" },
  "1:8": { loss: 9, name: "1:8 Splitter" },
  "1:16": { loss: 12, name: "1:16 Splitter" },
} as const;

// Wavelength Attenuation (dB/km)
export const WAVELENGTH_ATTENUATION = {
  "1310": 0.35,
  "1490": 0.25,
  "1550": 0.21,
} as const;

// Default component losses (dB)
export const DEFAULT_LOSSES = {
  splice: 0.1,
  connector: 0.5,
} as const;

// PON Technology Presets
export const PON_PRESETS = {
  "GPON_DS": {
    name: "GPON - Downstream (OLT → ONT)",
    txPower: 3,
    rxSensitivity: -30,
  },
  "GPON_US": {
    name: "GPON - Upstream (ONT → OLT)",
    txPower: 2,
    rxSensitivity: -28,
  },
  "XGPON_DS": {
    name: "XG-PON - Downstream",
    txPower: 3,
    rxSensitivity: -29,
  },
  "XGSPON": {
    name: "XGS-PON - Symmetric 10G",
    txPower: 3,
    rxSensitivity: -29,
  },
  "EPON_DS": {
    name: "EPON - Downstream",
    txPower: 2,
    rxSensitivity: -27,
  },
  "10G_EPON": {
    name: "10G-EPON - Downstream",
    txPower: 3,
    rxSensitivity: -29,
  },
} as const;

// Topology definitions
export const TOPOLOGIES = {
  TOPO_1: {
    id: "topo1",
    name: "OLT → OTB → ODC → ODP → ONT",
    description: "4-segment topology with splitter at ODC and ODP",
    segments: [
      { name: "OTB", label: "OTB", hasSplitter: false },
      { name: "ODC", label: "ODC (Optical Distribution Cabinet)", hasSplitter: true, splitterOptions: ["1:4", "1:8"] },
      { name: "ODP", label: "ODP (Optical Distribution Point)", hasSplitter: true, splitterOptions: ["1:8", "1:16"] },
    ],
  },
  TOPO_2: {
    id: "topo2",
    name: "OLT → OTB → ODP → ONT",
    description: "3-segment topology with splitter at OTB and ODP",
    segments: [
      { name: "OTB", label: "OTB (Optical Terminal Box)", hasSplitter: true, splitterOptions: ["1:8", "1:16"] },
      { name: "ODP", label: "ODP (Optical Distribution Point)", hasSplitter: true, splitterOptions: ["1:8", "1:16"] },
    ],
  },
} as const;

// Margin status thresholds (dB)
export const MARGIN_THRESHOLDS = {
  PASS: 3,          // >= 3dB
  WARNING: 1,       // 1-2.99dB
  FAIL: 0,          // < 1dB
} as const;
