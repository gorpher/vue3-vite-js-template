import legacyPlugin from '@vitejs/plugin-legacy'
import Banner from 'vite-plugin-banner'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import vuePlugin from '@vitejs/plugin-vue'
// @see https://cn.vitejs.dev/config/
export default ({ command, mode }) => {
  const NODE_ENV = process.env.NODE_ENV || 'development'
  const envFiles = [`.env.${NODE_ENV}`]
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }

  const timestamp = Date.parse(new Date())

  const rollupOptions = {
    output: {
      entryFileNames: `main-[name].${timestamp}.js`,
      chunkFileNames: `main-chunk-[name].${timestamp}.js`,
      assetFileNames: `assets/main-[name].${timestamp}.[ext]`,
    },
  }

  const optimizeDeps = {}

  const alias = {
    '@': path.resolve(__dirname, './src'),
    vue$: 'vue/dist/vue.runtime.esm-bundler.js',
  }

  const esbuild = {}

  return {
    base: './',
    root: './',
    resolve: {
      alias,
    },
    define: {
      'process.env': {},
    },
    server: {
      open: true,
      port: process.env.VITE_CLI_PORT,
      proxy: {
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [process.env.VITE_BASE_API]: {
          target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp('^' + process.env.VITE_BASE_API), ''),
        },
      },
    },
    build: {
      target: 'es2015',
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      outDir: 'dist', // 产出目录
      rollupOptions,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      legacyPlugin({
        targets: [
          'Android > 39',
          'Chrome >= 60',
          'Safari >= 10.1',
          'iOS >= 10.3',
          'Firefox >= 54',
          'Edge >= 15',
        ],
      }),
      vuePlugin(),
      [Banner(`\n Build based on vue3 project \n Time : ${timestamp}`)],
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  }
}
