import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'org',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;
