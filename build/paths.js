const path = require('path');

const EXTENSIONS_DIR = path.resolve(__dirname, '../extensions');
const DIST_DIR = path.resolve(__dirname, '../dist');
const SRC_DIR = path.resolve(__dirname, '../src');
const COMPONENTS = path.resolve(SRC_DIR, 'components');
const UTILITIES = path.resolve(SRC_DIR, 'utilities');

module.exports = {
  EXTENSIONS_DIR,
  DIST_DIR,
  SRC_DIR,
  COMPONENTS,
  UTILITIES,
};
