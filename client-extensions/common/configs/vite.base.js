import path from 'node:path'

/**
 * Factory function tạo Vite config thống nhất cho các dự án meko-crm-*
 * @param {string} projectName Tên project không có khoảng trắng, vd: "meko-crm-class"
 * @param {object} deps Các dependencies đã import từ thư mục project (để resolve đúng node_modules)
 * @param {Function} deps.defineConfig Hàm defineConfig từ 'vite'
 * @param {Function} deps.react Plugin react() builder từ '@vitejs/plugin-react'
 * @param {Function} deps.tailwindcss Plugin tailwindcss() builder từ '@tailwindcss/vite'
 */
export function defineMekoCrmViteConfig(projectName, deps) {
  const { defineConfig, react, tailwindcss } = deps

  return defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
    server: {
      fs: {
        allow: [
          path.resolve(process.cwd(), '.'),
          path.resolve(process.cwd(), '..'),
        ],
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: 'src/main.tsx',
        output: {
          entryFileNames: `${projectName}.js`,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) return `${projectName}.css`
            return 'assets/[name]-[hash][extname]'
          },
          format: 'es',
        },
      },
    },
  })
}
