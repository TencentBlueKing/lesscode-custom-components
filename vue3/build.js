const { runBuild } = require('@blueking/cli-service-webpack');
const childProcess = require('child_process');
const fs = require('fs');
const archiver = require('archiver');
const packageJson = require('./package.json');

function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, 'dist')
      .on('error', reject)
      .pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
}

const task = async () => {
  try {
    // clean dist & zip
    await childProcess.exec('rm -rf ./zip ./dist');

    // build iife & umd
    await Promise.all([
      (() => {
        // build var
        process.env.LIBRARY_TARGET = 'var';
        return runBuild();
      })(),
      (() => {
        // build umd
        process.env.LIBRARY_TARGET = 'umd';
        return runBuild();
      })(),
    ]);

    // copy config
    fs.copyFileSync('./src/config.json', './dist/config.json');

    // zip
    fs.mkdirSync('./zip');
    await zipDirectory('./dist', `./zip/${packageJson.name}.zip`);

    process.exit(0);
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
};

task();
