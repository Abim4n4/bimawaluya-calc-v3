import { 
  LinkBudgetInput, 
  LinkBudgetResult, 
  SegmentCalculation,
  StatusType,
  StatusColor 
} from './types';
import { 
  SPLITTER_STANDARDS, 
  WAVELENGTH_ATTENUATION,
  MARGIN_THRESHOLDS 
} from './constants';

export class LinkBudgetCalculator {
  /**
   * Calculate attenuation for a single segment
   */
  calculateSegmentAttenuation(segment: LinkBudgetInput['segments'][0]): SegmentCalculation {
    // Fiber loss = distance (km) × attenuation per km
    const fiberLoss = segment.fiberLength * WAVELENGTH_ATTENUATION[segment.wavelength];

    // Splice loss = count × loss per splice
    const spliceLoss = segment.splice.count * segment.splice.lossPerSplice;

    // Connector loss = count × loss per connector
    const connectorLoss = segment.connector.count * segment.connector.lossPerConnector;

    // Splitter loss
    let splitterLoss = 0;
    let splitterInfo = undefined;

    if (segment.splitter) {
      if (segment.splitter.isManual && segment.splitter.manualLoss !== undefined) {
        splitterLoss = segment.splitter.manualLoss;
      } else {
        splitterLoss = SPLITTER_STANDARDS[segment.splitter.ratio].loss;
      }
      splitterInfo = {
        ratio: segment.splitter.ratio,
        loss: splitterLoss,
      };
    }

    const segmentTotal = fiberLoss + spliceLoss + connectorLoss + splitterLoss;

    return {
      name: segment.name,
      fiberLoss,
      spliceLoss,
      connectorLoss,
      splitterLoss,
      splitterInfo,
      segmentTotal,
    };
  }

  /**
   * Determine status based on margin remaining
   */
  determineStatus(marginRemaining: number, marginRequired: number): { status: StatusType; color: StatusColor } {
    if (marginRemaining >= marginRequired) {
      return { status: 'PASS', color: 'green' };
    } else if (marginRemaining >= marginRequired - 2) {
      return { status: 'WARNING', color: 'yellow' };
    } else {
      return { status: 'FAIL', color: 'red' };
    }
  }

  /**
   * Calculate complete link budget
   */
  calculateLinkBudget(input: LinkBudgetInput): LinkBudgetResult {
    // Budget available = Tx Power - Rx Sensitivity
    const budgetAvailable = input.olt.txPower - input.ont.rxSensitivity;

    // Calculate each segment
    const segmentCalculations = input.segments.map((segment) =>
      this.calculateSegmentAttenuation(segment)
    );

    // Total attenuation = sum of all segment attenuations
    const totalAttenuation = segmentCalculations.reduce(
      (sum, calc) => sum + calc.segmentTotal,
      0
    );

    // Margin remaining = Budget - Total Attenuation
    const marginRemaining = budgetAvailable - totalAttenuation;

    // Determine status
    const { status, color: statusColor } = this.determineStatus(
      marginRemaining,
      input.marginRequired
    );

    return {
      topology: input.topology,
      budgetAvailable,
      segmentCalculations,
      totalAttenuation,
      marginRemaining,
      marginRequired: input.marginRequired,
      status,
      statusColor,
      isPassable: status === 'PASS',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get calculation recommendation
   */
  getRecommendation(result: LinkBudgetResult): string[] {
    const recommendations: string[] = [];

    if (result.status === 'FAIL') {
      recommendations.push('❌ Link budget TIDAK AMAN - Terjadi kegagalan atenuasi');
      recommendations.push(`   Margin negatif: ${Math.abs(result.marginRemaining).toFixed(2)} dB`);
      recommendations.push('   Perbaikan yang dapat dilakukan:');
      recommendations.push('   • Kurangi panjang serat');
      recommendations.push('   • Kurangi jumlah splice/konektor');
      recommendations.push('   • Gunakan splitter dengan loss lebih rendah (jika tersedia)');
    } else if (result.status === 'WARNING') {
      recommendations.push('⚠️ Link budget TERBATAS - Margin minimal');
      recommendations.push(`   Margin tersisa: ${result.marginRemaining.toFixed(2)} dB (< ${result.marginRequired} dB)`);
      recommendations.push('   Disarankan untuk optimalisasi:');
      recommendations.push('   • Verifikasi kondisi lapangan');
      recommendations.push('   • Cek kualitas penyambungan');
      recommendations.push('   • Monitor performa secara berkala');
    } else {
      recommendations.push('✅ Link budget AMAN');
      recommendations.push(`   Margin tersisa: ${result.marginRemaining.toFixed(2)} dB`);
      recommendations.push('   Status: Layak operasional');
    }

    // Find most critical segment
    const criticalSegment = result.segmentCalculations.reduce((prev, curr) =>
      curr.segmentTotal > prev.segmentTotal ? curr : prev
    );
    recommendations.push(`\n   Segment paling kritis: ${criticalSegment.name} (${criticalSegment.segmentTotal.toFixed(2)} dB)`);

    return recommendations;
  }
}

export const calculator = new LinkBudgetCalculator();
