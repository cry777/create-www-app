#!/usr/bin/env node

import run from './run.js';

run().catch((e) => {
  console.error(e);
});
