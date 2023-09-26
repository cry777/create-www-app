#!/usr/bin/env node

import run from './run.js';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 18) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create Axum App requires Node 18 or higher. \n' +
      'Please update your version of Node.',
  );
  process.exit(1);
}

run().catch((e) => {
  console.error(e);
});
