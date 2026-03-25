export type PersistenceMode = 'memory' | 'file';

export interface RuntimeConfig {
  persistenceMode: PersistenceMode;
  dataDir: string;
  seedMode: 'seed' | 'seed+fixtures';
  debug: boolean;
  authMode: 'mock' | 'feishu';
}

function env(name: string) {
  return process.env[name];
}

export function getRuntimeConfig(): RuntimeConfig {
  const persistenceMode = (env('PMW_PERSISTENCE_MODE') ?? 'memory') as PersistenceMode;
  const dataDir = env('PMW_DATA_DIR') ?? '.pmw-data';
  const seedMode = (env('PMW_SEED_MODE') ?? 'seed') as RuntimeConfig['seedMode'];
  const debug = (env('PMW_DEBUG') ?? '0') === '1';
  const authMode = (env('PMW_AUTH_MODE') ?? 'mock') as RuntimeConfig['authMode'];

  return {
    persistenceMode: persistenceMode === 'file' ? 'file' : 'memory',
    dataDir,
    seedMode: seedMode === 'seed+fixtures' ? 'seed+fixtures' : 'seed',
    debug,
    authMode: authMode === 'feishu' ? 'feishu' : 'mock'
  };
}

