const { join } = require('node:path')

const FlowbitePlugin = require('flowbite/plugin')
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')

function getTailwindConfig(root) {
  return {
    content: [
      join(root, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
      ...createGlobPatternsForDependencies(root),
      'node_modules/flowbite-react/lib/esm/**/*.js'
    ],
    theme: {},
    plugins: [FlowbitePlugin],
  }
}

module.exports = getTailwindConfig
