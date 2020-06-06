const path = require('path');


// extension path
const EXTENSION_DIR = path.resolve(__dirname, '../extension');

// browser path
const BROWSER_DIR = path.resolve(__dirname, '../browser');

// dist path
const DIST_DIR = path.resolve(__dirname, '../dist');

// src paths
const SRC_DIR = path.resolve(__dirname, '../src');
const COMPONENTS = path.resolve(SRC_DIR, 'components');
const UTILITIES = path.resolve(SRC_DIR, 'utilities');

module.exports = {
  EXTENSION_DIR,
  DIST_DIR,
  SRC_DIR,
  COMPONENTS,
  UTILITIES,
  BROWSER_DIR,
};
