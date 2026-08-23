// convert-tailwind-to-css.js

import fs from 'fs'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import tailwindConfig from './tailwind.config.js'

// Generated CSS indent spaces count
const indentSpaces = 2

// Generated CSS output file
const outputCSS = './src/assets/index.css'

// Root class used to scope Tailwind variable initialization
const scopeSelector = '.vueOnboardingTour'

const ignoreList = [
  'filter',
  'map',
  'reduce',
  'find',
  'push',
  'pop',
  'shift',
  'unshift',
]

// Default values for Tailwind CSS variables.
//
// Only variables that are actually used by the generated CSS
// will be included in the final scoped initialization.
const tailwindVariableDefaults = {
  '--tw-border-spacing-x': '0',
  '--tw-border-spacing-y': '0',

  '--tw-translate-x': '0',
  '--tw-translate-y': '0',

  '--tw-rotate': '0',
  '--tw-skew-x': '0',
  '--tw-skew-y': '0',

  '--tw-scale-x': '1',
  '--tw-scale-y': '1',

  '--tw-pan-x': ' ',
  '--tw-pan-y': ' ',
  '--tw-pinch-zoom': ' ',

  '--tw-scroll-snap-strictness': 'proximity',

  '--tw-gradient-from-position': ' ',
  '--tw-gradient-via-position': ' ',
  '--tw-gradient-to-position': ' ',

  '--tw-ordinal': ' ',
  '--tw-slashed-zero': ' ',
  '--tw-numeric-figure': ' ',
  '--tw-numeric-spacing': ' ',
  '--tw-numeric-fraction': ' ',

  '--tw-ring-inset': ' ',
  '--tw-ring-offset-width': '0px',
  '--tw-ring-offset-color': '#fff',
  '--tw-ring-color': 'rgb(59 130 246 / 0.5)',

  '--tw-ring-offset-shadow': '0 0 #0000',
  '--tw-ring-shadow': '0 0 #0000',

  '--tw-shadow': '0 0 #0000',
  '--tw-shadow-colored': '0 0 #0000',

  '--tw-blur': ' ',
  '--tw-brightness': ' ',
  '--tw-contrast': ' ',
  '--tw-grayscale': ' ',
  '--tw-hue-rotate': ' ',
  '--tw-invert': ' ',
  '--tw-saturate': ' ',
  '--tw-sepia': ' ',

  '--tw-drop-shadow': ' ',

  '--tw-backdrop-blur': ' ',
  '--tw-backdrop-brightness': ' ',
  '--tw-backdrop-contrast': ' ',
  '--tw-backdrop-grayscale': ' ',
  '--tw-backdrop-hue-rotate': ' ',
  '--tw-backdrop-invert': ' ',
  '--tw-backdrop-opacity': ' ',
  '--tw-backdrop-saturate': ' ',

  '--tw-contain-size': ' ',
  '--tw-contain-layout': ' ',
  '--tw-contain-paint': ' ',
  '--tw-contain-style': ' ',
}

// Find which Tailwind variables are actually referenced
// in the generated CSS.
//
// Example:
// translate: var(--tw-translate-x) var(--tw-translate-y);
//
// results in:
//
// --tw-translate-x
// --tw-translate-y
function getUsedTailwindVariables(css) {
  const usedVariables = new Set()

  const variableRegex = /var\(\s*(--tw-[a-zA-Z0-9-]+)/g

  let match

  while ((match = variableRegex.exec(css)) !== null) {
    usedVariables.add(match[1])
  }

  return usedVariables
}

// Generate a scoped Tailwind variable initialization block.
//
// This is intentionally scoped to the library.
//
// It does NOT use:
//
// *
// ::before
// ::after
//
// globally.
//
// Therefore it cannot reset Tailwind variables in the consuming app.
function generateScopedVariableInitialization(css) {
  const usedVariables = getUsedTailwindVariables(css)

  const variables = []

  usedVariables.forEach((variableName) => {
    const defaultValue = tailwindVariableDefaults[variableName]

    if (defaultValue !== undefined) {
      variables.push(
        `  ${variableName}: ${defaultValue};`
      )
    }
  })

  if (variables.length === 0) {
    return ''
  }

  return `
${scopeSelector},
${scopeSelector} *,
${scopeSelector}::before,
${scopeSelector}::after {
${variables.join('\n')}
}
`
}

// Convert Tailwind CSS to native CSS
postcss([
  tailwindcss({
    ...tailwindConfig,
    content: ['./src/**/*.vue'],
  }),
])
  .process('@tailwind utilities; @tailwind components;', {
    from: undefined,
  })
  .then((result) => {
    // Format generated CSS
    let formattedCSS = result.css
      .replaceAll(' '.repeat(4), ' '.repeat(indentSpaces))
      .replace(
        /([^{;\s]+:[^;}]+)(\s*?)\n(\s*})/g,
        '$1;\n$3'
      )

    // Filter out ignored classes
    ignoreList.forEach((className) => {
      const classRegex = new RegExp(
        `\\.${className}\\s*{[^}]*}`,
        'g'
      )

      formattedCSS = formattedCSS.replace(
        classRegex,
        ''
      )
    })

    // Generate scoped Tailwind variable initialization
    //
    // Only variables actually referenced by the generated CSS
    // are initialized.
    const scopedVariables =
      generateScopedVariableInitialization(
        formattedCSS
      )

    // Append scoped variables
    formattedCSS += scopedVariables

    // Write generated CSS
    fs.writeFileSync(
      outputCSS,
      formattedCSS,
      'utf8'
    )

    console.log(
      `Native CSS generated: ${outputCSS}`
    )

    if (scopedVariables) {
      console.log(
        'Scoped Tailwind variables generated for .vot-tour'
      )
    } else {
      console.log(
        'No Tailwind variables required initialization'
      )
    }
  })
  .catch((err) => {
    console.error(
      'An error occurred:',
      err
    )

    process.exitCode = 1
  })