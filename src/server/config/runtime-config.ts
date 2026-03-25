export type PersistenceMode = 'memory' | 'file';

export interface RuntimeConfig {
  persistenceMode: PersistenceMode;
  dataDir: string;
  seedMode: 'seed' | 'seed+fixtures';
  debug: boolean;
}

function env(name: string) {
  return process.env[name];
}

export function getRuntimeConfig(): RuntimeConfig {
  const persistenceMode = (env('PMW_PERSISTENCE_MODE') ?? 'memory') as PersistenceMode;
  const dataDir = env('PMW_DATA_DIR') ?? '.pmw-data';
  const seedMode = (env('PMW_SEED_MODE') ?? 'seed') as RuntimeConfig['seedMode'];
  const debug = (env('PMW_DEBUG') ?? '0') === '1';

  return {
    persistenceMode: persistenceMode === 'file' ? 'file' : 'memory',
    dataDir,
    seedMode: seedMode === 'seed+fixtures' ? 'seed+fixtures' : 'seed',
    debug
  };
}

