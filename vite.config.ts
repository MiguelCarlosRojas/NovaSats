import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function apiBackendPlugin(): Plugin {
  return {
    name: 'api-backend-plugin',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '')
      Object.assign(process.env, env)

      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
          try {
            const { handleApi } = await server.ssrLoadModule('./api/router.ts')
            await handleApi(req, res)
          } catch (err: any) {
            console.error('API Error in dev server:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err?.message || 'Internal Server Error' }))
          }
          return
        }
        next()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiBackendPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@reown') || id.includes('wagmi') || id.includes('ethers') || id.includes('viem')) {
              return 'vendor-web3'
            }
            if (id.includes('jspdf') || id.includes('xlsx')) {
              return 'vendor-documents'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
})
