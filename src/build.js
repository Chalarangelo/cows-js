const Parcel = require('parcel-bundler');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const minify = require('rollup-plugin-babel-minify');
const commonjs = require('rollup-plugin-commonjs');
const rimraf = require('rimraf');

const entryFiles = './src/public/index.html';

const options = {
  outDir: './dist/public',
  outFile: 'index.html',
  cache: false,
  minify: false,
  target: 'browser',
  sourceMaps: false
};

const es5 = babel({ presets: ['@babel/preset-env'] });
const min = minify({ comments: false });
const inputOptions = {
  input: './src/server.js',
  plugins: [
    es5, 
    min, 
    commonjs({
      sourceMap: false
    })
  ]
}

const outputOptions = {
  format: 'cjs',
  file: './dist/server.js'
}

async function build() {
  // Build backend
  const bBundler = await rollup.rollup(inputOptions);
  const bBundle = await bBundler.write(outputOptions);

  // Build frontend
  await rimraf('.cache', () => { });
  const fBundler = new Parcel(entryFiles, options);
  const fBundle = await fBundler.bundle();
  process.exit(0);
}

build();