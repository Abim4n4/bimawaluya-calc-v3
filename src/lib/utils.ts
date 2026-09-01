import { LinkBudgetResult, LinkBudgetInput } from './types';

/**
 * Format number to 2 decimal places
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

/**
 * Format date to readable string (Indo)
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
};

/**
 * Validate form input
 */
export const validateFormInput = (input: LinkBudgetInput): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!input.topology) {
    errors.push('Pilih topologi jaringan terlebih dahulu');
  }

  if (input.olt.txPower < -20 || input.olt.txPower > 10) {
    errors.push('Tx Power harus antara -20 hingga +10 dBm');
  }

  if (input.olt.rxSensitivity > 0 || input.olt.rxSensitivity < -40) {
    errors.push('Rx Sensitivity harus antara -40 hingga 0 dBm');
  }

  input.segments.forEach((segment, idx) => {
    if (segment.fiberLength < 0 || segment.fiberLength > 100) {
      errors.push(`Segment ${segment.name}: Panjang serat harus 0-100 km`);
    }

    if (segment.splice.count < 0 || segment.splice.count > 50) {
      errors.push(`Segment ${segment.name}: Jumlah splice tidak realistis`);
    }

    if (segment.connector.count < 0 || segment.connector.count > 20) {
      errors.push(`Segment ${segment.name}: Jumlah konektor tidak realistis`);
    }
  });

  if (input.marginRequired < 0 || input.marginRequired > 10) {
    errors.push('Margin keamanan harus 0-10 dB');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Generate text report
 */
export const generateTextReport = (input: LinkBudgetInput, result: LinkBudgetResult): string => {
  const lines: string[] = [
    '═══════════════════════════════════════════════════════════',
    '          LINK BUDGET FTTH CALCULATION REPORT',
    '═══════════════════════════════════════════════════════════',
    '',
    `Timestamp: ${formatDate(result.timestamp)}`,
    `Topology: ${input.topology === 'topo1' ? 'OLT → OTB → ODC → ODP → ONT' : 'OLT → OTB → ODP → ONT'}`,
    '',
    '─── TRANSMITTER (OLT) ───',
    `Tx Power:        ${input.olt.txPower} dBm`,
    `Rx Sensitivity:  ${input.olt.rxSensitivity} dBm`,
    '',
    '─── BUDGET CALCULATION ───',
    `Budget Available: ${formatNumber(result.budgetAvailable)} dB`,
    `Total Attenuation: ${formatNumber(result.totalAttenuation)} dB`,
    `Margin Remaining:  ${formatNumber(result.marginRemaining)} dB`,
    `Margin Required:   ${result.marginRequired} dB`,
    '',
    '─── SEGMENT BREAKDOWN ───',
  ];

  result.segmentCalculations.forEach((seg) => {
    lines.push(`\n${seg.name}:`);
    lines.push(`  Fiber Loss:      ${formatNumber(seg.fiberLoss)} dB`);
    lines.push(`  Splice Loss:     ${formatNumber(seg.spliceLoss)} dB`);
    lines.push(`  Connector Loss:  ${formatNumber(seg.connectorLoss)} dB`);
    if (seg.splitterInfo) {
      lines.push(`  Splitter (${seg.splitterInfo.ratio}): ${formatNumber(seg.splitterInfo.loss)} dB`);
    }
    lines.push(`  ─────────────────────────────`);
    lines.push(`  Subtotal:        ${formatNumber(seg.segmentTotal)} dB`);
  });

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push(`STATUS: ${result.status} - ${result.status === 'PASS' ? '✅ AMAN' : result.status === 'WARNING' ? '⚠️ HATI-HATI' : '❌ TIDAK AMAN'}`);
  lines.push('═══════════════════════════════════════════════════════════');

  return lines.join('\n');
};

/**
 * Export calculation as CSV
 */
export const generateCSVReport = (input: LinkBudgetInput, result: LinkBudgetResult): string => {
  const rows: string[] = [
    'Link Budget FTTH Report',
    `Generated: ${formatDate(result.timestamp)}`,
    `Topology: ${input.topology}`,
    '',
    'Segment,Fiber Loss (dB),Splice Loss (dB),Connector Loss (dB),Splitter Loss (dB),Total (dB)',
  ];

  result.segmentCalculations.forEach((seg) => {
    rows.push(
      `"${seg.name}",${formatNumber(seg.fiberLoss)},${formatNumber(seg.spliceLoss)},${formatNumber(seg.connectorLoss)},${formatNumber(seg.splitterLoss)},${formatNumber(seg.segmentTotal)}`
    );
  });

  rows.push('');
  rows.push('Summary');
  rows.push(`Budget Available (dB),${formatNumber(result.budgetAvailable)}`);
  rows.push(`Total Attenuation (dB),${formatNumber(result.totalAttenuation)}`);
  rows.push(`Margin Remaining (dB),${formatNumber(result.marginRemaining)}`);
  rows.push(`Status,${result.status}`);

  return rows.join('\n');
};
