import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

//https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env
    },
    plugins: [react()],
  }
})