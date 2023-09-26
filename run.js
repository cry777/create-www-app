import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import minimist from 'minimist';

import { formatTargetDir, isValidPackageName, copy } from './helper.js';

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist(process.argv.slice(2), { string: ['_'] });
const cwd = process.cwd();

const defaultTargetDir = 'www-project';

const renameFiles = {
  _gitignore: '.gitignore',
};

export default async function run() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const template = argv.template || argv.t;

  if (!argTargetDir) {
    console.log();
    console.error('[ERROR] Please specify the project directory.');
    console.log();
    process.exit(1);
  }

  if (!template) {
    console.log();
    console.error('[ERROR] Please specify the project template.');
    console.log();
    process.exit(1);
  }

  // 校验项目名称是否合法
  if (!isValidPackageName(argTargetDir)) {
    console.log();
    console.log(`[ERROR] The directory named <${targetDir}> is Invalid.`);
    console.log();
  }

  const targetDir = argTargetDir || defaultTargetDir;

  // 校验文件夹是否存在
  if (fs.existsSync(targetDir)) {
    console.log();
    console.log(`[ERROR] The directory named <${targetDir}> is exist.`);
    console.log();
    process.exit(1);
  }

  const root = path.resolve(targetDir);
  const appName = path.basename(root);

  fs.mkdirSync(root, { recursive: true });

  console.log();
  console.log(`Scaffolding project in ${root}...`);
  console.log();

  // 获取template路径
  const templateDir = path.resolve(fileURLToPath(import.meta.url), '..', `template-${template}`);

  const write = (file, content) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file);
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'));
  pkg.name = appName;
  write('package.json', JSON.stringify(pkg, null, 2) + '\n');

  const cdProjectName = path.relative(cwd, root);
  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(`  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`);
  }
  console.log(`  pnpm install`);
  console.log(`  pnpm run dev`);
  console.log();
}
