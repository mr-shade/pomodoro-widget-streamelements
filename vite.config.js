import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pomodoro: resolve(__dirname, 'pomodoro.html'),
        commands: resolve(__dirname, 'commands.html')
      }
    }
  }
})
