import { demoConfig } from '../config';

/**
 * LatencySimulator - Add realistic network delays to mock operations
 *
 * Purpose:
 * - Simulate network latency for more realistic demos
 * - Show loading states and skeletons
 * - Test error handling with configurable failure rate
 *
 * Usage:
 *   await latencySimulator.simulate(300, 800); // 300-800ms delay
 *   await latencySimulator.maybeSimulateError('Operation failed');
 */
export class LatencySimulator {
  /**
   * Simulate network delay
   * Uses configured latency if set, otherwise random delay in range
   */
  async simulate(minMs: number = 0, maxMs: number = 0): Promise<void> {
    const baseLatency = demoConfig.latencyMs;
    const delay =
      baseLatency > 0 ? baseLatency : minMs + Math.random() * (maxMs - minMs);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  /**
   * Maybe throw an error based on configured error rate
   * Useful for testing error boundaries and error handling
   */
  async maybeSimulateError(errorMessage: string = 'Operation failed'): Promise<void> {
    if (Math.random() < demoConfig.errorRate) {
      throw new Error(errorMessage);
    }
  }
}

export const latencySimulator = new LatencySimulator();
