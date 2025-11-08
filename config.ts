// Application configuration
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
export const DEFAULT_PERSONA = (import.meta.env.VITE_DEFAULT_PERSONA || 'fan') as 'fan' | 'creator' | 'admin';
