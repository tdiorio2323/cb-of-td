import { DEMO_MODE, DEFAULT_PERSONA } from '@/config';
import { demoUsers, DemoRole } from '@/demo/demoUser';
import { User } from '@/types';

// Demo mode session state
let currentDemoUser: User | null = DEMO_MODE ? demoUsers[DEFAULT_PERSONA] : null;

export function getDemoSession(): { user: User } | null {
  if (!DEMO_MODE) return null;
  return currentDemoUser ? { user: currentDemoUser } : null;
}

export function impersonate(role: DemoRole): void {
  if (!DEMO_MODE) return;
  currentDemoUser = demoUsers[role];
  // Trigger a re-render by dispatching a custom event
  window.dispatchEvent(new CustomEvent('demo-persona-change', { detail: { user: currentDemoUser } }));
}

export function getCurrentDemoUser(): User | null {
  return DEMO_MODE ? currentDemoUser : null;
}
