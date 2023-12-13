import { ModuleFederationConfig } from '@nx/webpack'

const config: ModuleFederationConfig = {
  name: 'poc',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
}

export default config
