const GallantEnginePaths = require('gallant-engine/tsconfig.paths.json')
const fs = require('fs')

const alias = {}
Object.keys(GallantEnginePaths.compilerOptions.paths).forEach(key => {
    alias[key] = GallantEnginePaths.compilerOptions.paths[key][0]
})

fs.writeFile('./babel-output', JSON.stringify(alias))

module.exports = {
  "presets": [
    "next/babel"
  ],
  "plugins": [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: [require.resolve('gallant-engine')],
      alias
    }
  ]
}