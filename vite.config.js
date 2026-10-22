import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 301 Permanent Redirects for local development testing
const dev301RedirectsPlugin = () => ({
  name: 'dev-301-redirects',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const parsedUrl = (req.url || '').split('?')[0].replace(/\/+$/, '') || '/';
      const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

      const redirects = {
        '/Signup': '/signup',
        '/categories/skin-moisturizer': '/category/skin/skin-moisturizer',
        '/Products/category/skin-mask': '/category/skin/skin-mask',
        '/products/category/skin-mask': '/category/skin/skin-mask',
        '/categories/eyes': '/category/makeup/eyes',
        '/categories/skin-serums-and-essences-serum': '/category/skin/skin-serums-and-essences',
      };

      if (redirects[parsedUrl]) {
        res.writeHead(301, {
          Location: `${redirects[parsedUrl]}${query}`,
        });
        return res.end();
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dev301RedirectsPlugin()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/admin': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
