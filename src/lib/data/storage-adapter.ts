import { StorageAdapter } from './types';
import { FileAdapter } from './file-adapter';

let adapterInstance: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (adapterInstance) {
    return adapterInstance;
  }

  // Controlled by STORAGE_TYPE env var
  // For now, only FileAdapter is implemented
  if (process.env.STORAGE_TYPE === 'supabase') {
    // TODO: Import and use SupabaseAdapter when implemented
    // const { SupabaseAdapter } = await import('./supabase-adapter');
    // adapterInstance = new SupabaseAdapter();
    console.warn('Supabase adapter not yet implemented, falling back to file adapter');
    adapterInstance = new FileAdapter();
  } else {
    adapterInstance = new FileAdapter();
  }

  return adapterInstance;
}

// For testing purposes - reset the singleton
export function resetStorageAdapter(): void {
  adapterInstance = null;
}
