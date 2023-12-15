import type { ModuleFederationConfig } from '@nx/webpack'

const config: ModuleFederationConfig = {
  name: 'team',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
}

export default config
