import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoBase = process.env.VITE_BASE_PATH ?? '/Wordle/'

const config = defineConfig({
  base: repoBase,
  builder: {},
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      router: {
        basepath: repoBase.replace(/\/$/, '') || undefined,
      },
    }),
    viteReact(),
  ],
})

export default config
