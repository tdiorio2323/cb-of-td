import seedrandom from 'seedrandom';

/**
 * DemoConfig - Central configuration for demo mode
 *
 * Controls:
 * - Deterministic random number generation via seed
 * - Simulated network latency
 * - Error injection for testing
 * - Real-time features toggle
 *
 * Usage:
 *   import { demoConfig } from '@/mocks/config';
 *   const randomValue = demoConfig.random();
 */
export class DemoConfig {
  private static instance: DemoConfig;
  private rng: seedrandom.PRNG;

  seed: string = 'creatorhub-demo-2025';
  latencyMs: number = 0; // No delay by default for smooth demos
  errorRate: number = 0; // 0% errors by default
  enableRealtime: boolean = true; // Simulated messages enabled

  private constructor() {
    this.rng = seedrandom(this.seed);
  }

  static getInstance(): DemoConfig {
    if (!DemoConfig.instance) {
      DemoConfig.instance = new DemoConfig();
    }
    return DemoConfig.instance;
  }

  /**
   * Get a deterministic random number [0, 1)
   * Same seed always produces same sequence
   */
  random(): number {
    return this.rng();
  }

  /**
   * Update the seed and regenerate RNG
   * Use this to get different demo data sets
   */
  setSeed(seed: string): void {
    this.seed = seed;
    this.rng = seedrandom(seed);
  }

  /**
   * Reset all config to defaults
   */
  reset(): void {
    this.setSeed('creatorhub-demo-2025');
    this.latencyMs = 0;
    this.errorRate = 0;
    this.enableRealtime = true;
  }

  /**
   * Generate random integer in range [min, max]
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Pick random item from array
   */
  randomItem<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }
}

export const demoConfig = DemoConfig.getInstance();
