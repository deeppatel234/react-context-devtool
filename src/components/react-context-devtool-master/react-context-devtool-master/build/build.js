const archiver = require("archiver");
const webpack = require("webpack");
const chalk = require("chalk");
const replace = require('replace-in-file');

const { createWriteStream } = require("fs");
const { copy, ensureDir, move, remove } = require("fs-extra");
const path = require("path");

const {
  BROWSER_DIR,
  DIST_DIR,
  EXTENSION_DIR,
} = require('./paths');

const webpackConfig = require('./webpack.config');

const EXTENSTION_FILES = ["assets", "devtool", "popup"];
const EXTENSION_CORE_FILES = ["background.js"];
const BUILD_ID_REPLACE = ["popup/popup.html", "devtool/devpanel.html"];

const env = process.env.NODE_ENV || 'development';

const preBuild = async ({ distPath, tmpPath }) => {
  console.log(chalk.green('\nclean dist directory'));
  await remove(distPath);
  await ensureDir(distPath);
  await ensureDir(tmpPath);
};

const buildProject = async ({ buildId, distPath, browserPath, tmpPath }) => {

  await copy(browserPath, tmpPath);
  await remove(path.resolve(tmpPath, 'build.js'));

  console.log(chalk.green('\ncopy extension files successfully'));

  await Promise.all(
    EXTENSTION_FILES.map(file => copy(path.join(EXTENSION_DIR, file), path.join(tmpPath, file)))
  );

  await Promise.all(
    EXTENSION_CORE_FILES.map(file => copy(path.join(EXTENSION_DIR, 'core', file), path.join(tmpPath, file)))
  );

  await replace({
    files: BUILD_ID_REPLACE.map(file => path.join(tmpPath, file)),
    from: /__BUILD_ID__/g,
    to: buildId,
  });

  console.log('\nwebpack build started');

  const compailer = webpack(webpackConfig({
    mode: env,
    distPath: tmpPath,
  }));

  await new Promise((resove, reject) => {
    compailer.run((err, stats) => {
      if (err) {
        console.log(chalk.red("\nwebpack build failed", err));
        reject();
      } else {
        resove();
      }
    });
  });

  console.log(chalk.green('\nwebpack build successfully'));

  const archive = archiver("zip", { zlib: { level: 9 } });
  const zipStream = createWriteStream(path.join(distPath, `ReactContextDevtool_${buildId}.zip`));

  await new Promise((resolve, reject) => {
    archive
      .directory(tmpPath, false)
      .on("error", (err) => reject(err))
      .pipe(zipStream);
    archive.finalize();
    zipStream.on("close", () => resolve());
  });

  console.log(chalk.green('\nzip created successfully'));
};

const postBuild = async ({ distPath, tmpPath }) => {
  const unpackedDistPath = path.join(distPath, "unpacked");

  await move(tmpPath, unpackedDistPath);
};

const startBuild = async (buildId) => {

  const distPath = path.join(DIST_DIR, buildId);
  const tmpPath = path.join(distPath, 'tmp');
  const browserPath = path.join(BROWSER_DIR, buildId);

  try {
    await preBuild({ distPath, tmpPath });

    await buildProject({ buildId, distPath, browserPath, tmpPath });

    await postBuild({ distPath,  tmpPath });

  } catch (err) {
    console.log(chalk.red("build failed", err));
  }
};

module.exports = startBuild;
