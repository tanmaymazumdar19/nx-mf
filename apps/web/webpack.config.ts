import { composePlugins, withNx } from '@nx/webpack'
import { withReact } from '@nx/react'
import { withModuleFederation } from '@nx/react/module-federation'
import { resolve } from 'node:path'

import baseConfig from './module-federation.config'

const config = {
  ...baseConfig,
  resolve: {
    alias: {
      config: resolve('../../dist/libs/config')
    }
  }
}

// Nx plugins for webpack to build config object from Nx options and context.
export default composePlugins(withNx(), withReact(), withModuleFederation(config))
