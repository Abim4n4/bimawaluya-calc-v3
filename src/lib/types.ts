export type TopologyId = "topo1" | "topo2";
export type WavelengthNm = "1310" | "1490" | "1550";
export type SplitterRatio = "1:2" | "1:4" | "1:8" | "1:16";
export type StatusType = "PASS" | "WARNING" | "FAIL";
export type StatusColor = "green" | "yellow" | "red";

export interface OLTData {
  txPower: number; // dBm
  rxSensitivity: number; // dBm
}

export interface SegmentData {
  name: string;
  fiberLength: number; // km
  wavelength: WavelengthNm;
  splice: {
    count: number;
    lossPerSplice: number; // dB
  };
  connector: {
    count: number;
    lossPerConnector: number; // dB
  };
  splitter?: {
    ratio: SplitterRatio;
    isManual: boolean;
    manualLoss?: number; // dB
  };
}

export interface ONTData {
  rxSensitivity: number; // dBm
}

export interface LinkBudgetInput {
  topology: TopologyId | null;
  olt: OLTData;
  segments: SegmentData[];
  ont: ONTData;
  marginRequired: number; // dB
  gpsLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export interface SegmentCalculation {
  name: string;
  fiberLoss: number;
  spliceLoss: number;
  connectorLoss: number;
  splitterLoss: number;
  splitterInfo?: {
    ratio: SplitterRatio;
    loss: number;
  };
  segmentTotal: number;
}

export interface LinkBudgetResult {
  topology: TopologyId | null;
  budgetAvailable: number; // dBm
  segmentCalculations: SegmentCalculation[];
  totalAttenuation: number; // dB
  marginRemaining: number; // dB
  marginRequired: number; // dB
  status: StatusType;
  statusColor: StatusColor;
  isPassable: boolean;
  timestamp: string;
}

export interface FormState {
  topology: TopologyId | null;
  olt: OLTData;
  segments: SegmentData[];
  ont: ONTData;
  marginRequired: number;
  gpsLocation?: {
    latitude: number;
    longitude: number;
  };
}
