import { User, UserRole } from '@/types';
import { demoConfig } from '../config';

const FIRST_NAMES = [
  'Alex',
  'Jamie',
  'Morgan',
  'Casey',
  'Riley',
  'Jordan',
  'Taylor',
  'Avery',
  'Quinn',
  'Sage',
];

const LAST_NAMES = [
  'Chen',
  'Patel',
  'Smith',
  'Garcia',
  'Johnson',
  'Lee',
  'Williams',
  'Brown',
  'Davis',
  'Martinez',
];

/**
 * UserFactory - Generate realistic User objects
 *
 * Features:
 * - Deterministic generation using demoConfig seed
 * - Realistic names from predefined lists
 * - Configurable via overrides parameter
 *
 * Usage:
 *   const user = UserFactory.create({ role: 'creator' });
 *   const users = UserFactory.createBatch(10, { role: 'fan' });
 */
export class UserFactory {
  static create(overrides?: Partial<User>): User {
    const firstName = demoConfig.randomItem(FIRST_NAMES);
    const lastName = demoConfig.randomItem(LAST_NAMES);
    const id = `user-${Date.now()}-${demoConfig.randomInt(1000, 9999)}`;

    return {
      id,
      name: `${firstName} ${lastName}`,
      avatarUrl: `/avatars/${firstName.toLowerCase()}.jpg`,
      role: 'fan',
      subscribedTo: [],
      balance: 100,
      bio: `${firstName} ${lastName} - Living life to the fullest!`,
      ...overrides,
    };
  }

  static createBatch(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a user with a specific role
   */
  static createWithRole(role: UserRole, overrides?: Partial<User>): User {
    return this.create({ role, ...overrides });
  }
}
