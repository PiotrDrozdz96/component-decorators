import { defineConfig } from 'vite';
import path from 'path';

const htmlImport = {
  name: "htmlImport",
  transform(code, id) {
    if (/^.*\.html$/g.test(id)) {
      code = `export default \`${code}\``
    }
    return { code }
  }
}

const srcDirectories = ['decorators', 'directivities', 'helpers'];

export default defineConfig({
  resolve: {
    alias: srcDirectories.reduce((acc, curr) => ({
      ...acc,
      [curr]: path.resolve(__dirname, `./src/${curr}`)
    }), {})
  },
  plugins: [ htmlImport ]
});
