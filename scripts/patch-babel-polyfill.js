/**
 * Postinstall patches for known npm/Windows issues:
 * 1. babel-plugin-polyfill-corejs3: truncated TypedArrayDependencies line
 * 2. eslint-plugin-flowtype: missing rules/quotes.js (package ships it as .DELETE)
 * 3. Any package: restore index.js from index.js.DELETE.* (e.g. es-iterator-helpers)
 * 4. css-tree: copy generic.js from root to nested (e.g. postcss-svgo/node_modules/css-tree) if missing
 */

const fs = require('fs');
const path = require('path');

const TRUNCATED = '"es.typed-array.to-string", "es.typed-array.';
const COMPLETE_SUFFIX_NO_ARRAYBUF = '"es.typed-array.to-string", "es.typed-array.with", "es.object.to-string", "es.array.iterator", "es.array-buffer.slice", "es.data-view", "es.array-buffer.detached", "es.array-buffer.transfer", "es.array-buffer.transfer-to-fixed-length", "esnext.typed-array.filter-reject", "esnext.typed-array.group-by", "esnext.typed-array.to-spliced", "esnext.typed-array.unique-by"];';
const COMPLETE_SUFFIX_WITH_ARRAYBUF = '"es.typed-array.to-string", "es.typed-array.with", "es.object.to-string", "es.array.iterator", "esnext.typed-array.filter-reject", "esnext.typed-array.group-by", "esnext.typed-array.to-spliced", "esnext.typed-array.unique-by", ...ArrayBufferDependencies];';

function findFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith('.')) findFiles(full, list);
    } else if (e.name === 'built-in-definitions.js' && full.includes('babel-plugin-polyfill-corejs3' + path.sep + 'lib')) {
      list.push(full);
    }
  }
  return list;
}

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(TRUNCATED)) return false;
  if (content.includes('"es.typed-array.with",')) return false; // already complete

  const hasArrayBuffer = content.includes('const ArrayBufferDependencies = ') && content.indexOf('const ArrayBufferDependencies = ') < content.indexOf('const TypedArrayDependencies = ');
  const suffix = hasArrayBuffer ? COMPLETE_SUFFIX_WITH_ARRAYBUF : COMPLETE_SUFFIX_NO_ARRAYBUF;

  // Replace truncated line: "es.typed-array.to-string", "es.typed-array." + (rest of line/garbage)
  const truncatedRegex = /"es\.typed-array\.to-string", "es\.typed-array\.[^\n]*/g;
  const newContent = content.replace(truncatedRegex, suffix);
  if (newContent === content) return false;

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

const root = path.resolve(__dirname, '..');
const nodeModules = path.join(root, 'node_modules');
const files = findFiles(nodeModules);

let patched = 0;
for (const f of files) {
  if (patchFile(f)) {
    console.log('Patched:', f);
    patched++;
  }
}
if (patched) console.log('patch-babel-polyfill: fixed', patched, 'file(s).');

// Fix eslint-plugin-flowtype: (1) restore rules/quotes.js from .DELETE if missing;
// (2) patch dist/index.js to require quotes in try/catch so we never crash on "Cannot find module './rules/quotes'"
function findFlowtypeDistIndex(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith('.')) findFlowtypeDistIndex(full, list);
    } else if (e.name === 'index.js') {
      const dirname = path.dirname(full);
      if (path.basename(dirname) === 'dist' && full.includes('eslint-plugin-flowtype')) {
        list.push({ indexPath: full, rulesDir: path.join(dirname, 'rules') });
      }
    }
  }
  return list;
}

const flowtypeLocations = findFlowtypeDistIndex(nodeModules);
for (const { indexPath, rulesDir } of flowtypeLocations) {
  const q = path.join(rulesDir, 'quotes.js');
  if (!fs.existsSync(q)) {
    const deleteFiles = fs.existsSync(rulesDir)
      ? fs.readdirSync(rulesDir).filter((n) => n.startsWith('quotes.js.DELETE.'))
      : [];
    if (deleteFiles.length) {
      fs.copyFileSync(path.join(rulesDir, deleteFiles[0]), q);
      console.log('Patched flowtype quotes:', q);
    }
  }
  // Patch index.js so require('./rules/quotes') never throws (e.g. Windows path resolution)
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  const alreadyPatched = indexContent.includes('try { return require(') || indexContent.includes('path").join(__dirname');
  if (!alreadyPatched) {
    // Match both single- and double-quote variants from the published package
    const badRequireRegex = /var _quotes = _interopRequireDefault\(require\(["']\.\/rules\/quotes["']\)\);?/;
    // Use path.join(__dirname, 'rules', 'quotes') so resolution works on Windows
    const safeRequire = 'var _quotes = _interopRequireDefault((function(){ try { return require(require("path").join(__dirname, "rules", "quotes")); } catch(e) { return { default: { create: function() { return {}; } } }; } })());';
    if (badRequireRegex.test(indexContent)) {
      indexContent = indexContent.replace(badRequireRegex, safeRequire);
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log('Patched flowtype index (safe require quotes):', indexPath);
    }
  } else if (indexContent.includes('return require("./rules/quotes")') && !indexContent.includes('path").join(__dirname')) {
    // Re-patch: use path.join so Windows resolves ./rules/quotes reliably
    indexContent = indexContent.replace(
      'return require("./rules/quotes");',
      'return require(require("path").join(__dirname, "rules", "quotes"));'
    );
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('Patched flowtype index (path.join for quotes):', indexPath);
  }
}

// Restore any index.js from index.js.DELETE.* (Windows npm sometimes renames files)
function restoreIndexFromDelete(dir) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith('.')) n += restoreIndexFromDelete(full);
    } else if (e.name.startsWith('index.js.DELETE.')) {
      const idx = path.join(dir, 'index.js');
      if (!fs.existsSync(idx)) {
        fs.copyFileSync(full, idx);
        console.log('Restored:', idx);
        n++;
      }
    }
  }
  return n;
}
restoreIndexFromDelete(nodeModules);

// Restore css-tree/lib/lexer/generic.js in nested copies (e.g. postcss-svgo)
const rootCssTreeLexer = path.join(nodeModules, 'css-tree', 'lib', 'lexer', 'generic.js');
if (fs.existsSync(rootCssTreeLexer)) {
  function fixCssTreeGeneric(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!e.name.startsWith('.')) fixCssTreeGeneric(full);
      } else if (e.name === 'Lexer.js') {
        const lexerDir = path.dirname(full);
        const genericPath = path.join(lexerDir, 'generic.js');
        if (full.includes('css-tree') && !fs.existsSync(genericPath)) {
          fs.copyFileSync(rootCssTreeLexer, genericPath);
          console.log('Restored css-tree generic.js:', genericPath);
        }
      }
    }
  }
  fixCssTreeGeneric(nodeModules);
}

process.exit(0);
