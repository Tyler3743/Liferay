import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineMekoCrmViteConfig } from '../common/configs/vite.base.js'

export default defineMekoCrmViteConfig('meko-crm-portal', {
  defineConfig,
  react,
  tailwindcss,
})