// vite.config.js
import { defineConfig } from "file:///home/yohannestakata/Documents/Projects/hydrogen-quickstart/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///home/yohannestakata/Documents/Projects/hydrogen-quickstart/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///home/yohannestakata/Documents/Projects/hydrogen-quickstart/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import tailwindcss from "file:///home/yohannestakata/Documents/Projects/hydrogen-quickstart/node_modules/@tailwindcss/vite/dist/index.mjs";
import { vitePlugin as remix } from "file:///home/yohannestakata/Documents/Projects/hydrogen-quickstart/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///home/yohannestakata/Documents/Projects/hydrogen-quickstart/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true
      }
    }),
    tsconfigPaths()
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ["bezier-easing"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS95b2hhbm5lc3Rha2F0YS9Eb2N1bWVudHMvUHJvamVjdHMvaHlkcm9nZW4tcXVpY2tzdGFydFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUveW9oYW5uZXN0YWthdGEvRG9jdW1lbnRzL1Byb2plY3RzL2h5ZHJvZ2VuLXF1aWNrc3RhcnQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUveW9oYW5uZXN0YWthdGEvRG9jdW1lbnRzL1Byb2plY3RzL2h5ZHJvZ2VuLXF1aWNrc3RhcnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSc7XG5pbXBvcnQge2h5ZHJvZ2VufSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJztcbmltcG9ydCB7b3h5Z2VufSBmcm9tICdAc2hvcGlmeS9taW5pLW94eWdlbi92aXRlJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XG5pbXBvcnQge3ZpdGVQbHVnaW4gYXMgcmVtaXh9IGZyb20gJ0ByZW1peC1ydW4vZGV2JztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgICBoeWRyb2dlbigpLFxuICAgIG94eWdlbigpLFxuICAgIHJlbWl4KHtcbiAgICAgIHByZXNldHM6IFtoeWRyb2dlbi5wcmVzZXQoKV0sXG4gICAgICBmdXR1cmU6IHtcbiAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxuICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxuICAgICAgICB2M19sYXp5Um91dGVEaXNjb3Zlcnk6IHRydWUsXG4gICAgICAgIHYzX3NpbmdsZUZldGNoOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gQWxsb3cgYSBzdHJpY3QgQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcbiAgICAvLyB3aXRodG91dCBpbmxpbmluZyBhc3NldHMgYXMgYmFzZTY0OlxuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxuICB9LFxuICBzc3I6IHtcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIC8qKlxuICAgICAgICogSW5jbHVkZSBkZXBlbmRlbmNpZXMgaGVyZSBpZiB0aGV5IHRocm93IENKUzw+RVNNIGVycm9ycy5cbiAgICAgICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBlcnJvcjpcbiAgICAgICAqXG4gICAgICAgKiA+IFJlZmVyZW5jZUVycm9yOiBtb2R1bGUgaXMgbm90IGRlZmluZWRcbiAgICAgICAqID4gICBhdCAvVXNlcnMvLi4uL25vZGVfbW9kdWxlcy9leGFtcGxlLWRlcC9pbmRleC5qczoxOjFcbiAgICAgICAqXG4gICAgICAgKiBJbmNsdWRlICdleGFtcGxlLWRlcCcgaW4gdGhlIGFycmF5IGJlbG93LlxuICAgICAgICogQHNlZSBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL2RlcC1vcHRpbWl6YXRpb24tb3B0aW9uc1xuICAgICAgICovXG4gICAgICBpbmNsdWRlOiBbJ2Jlemllci1lYXNpbmcnXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1XLFNBQVEsb0JBQW1CO0FBQzlYLFNBQVEsZ0JBQWU7QUFDdkIsU0FBUSxjQUFhO0FBQ3JCLE9BQU8saUJBQWlCO0FBQ3hCLFNBQVEsY0FBYyxhQUFZO0FBQ2xDLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFNBQVMsQ0FBQyxTQUFTLE9BQU8sQ0FBQztBQUFBLE1BQzNCLFFBQVE7QUFBQSxRQUNOLG1CQUFtQjtBQUFBLFFBQ25CLHNCQUFzQjtBQUFBLFFBQ3RCLHFCQUFxQjtBQUFBLFFBQ3JCLHVCQUF1QjtBQUFBLFFBQ3ZCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBO0FBQUEsSUFHTCxtQkFBbUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsY0FBYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFXWixTQUFTLENBQUMsZUFBZTtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
