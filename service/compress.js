const electron = require('electron');
const fs = require('fs');
const archiver = require('archiver');
const unzip = require('unzip');
// const fstream = require('fstream');
const os = require('os');
const path = require('path');
const child_process = require('child_process');
const shell = electron.shell;
const path7za = require('7zip-bin').path7za;

exports.compress7z = function(directory, outputFile, callback) {
  console.log(`directory: ${directory}`);
  console.log(`outputFile: ${outputFile}`);
  let command = path7za + ' a "' + outputFile + '" "' + directory + '" ';
  console.log(`command: ${command}`);
  let ChildProcess = child_process.exec(command, function(error, stdout, stderr) {
    if (error) {
      console.error(`exec error: ${error}`);
      callback('压缩失败');
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    shell.showItemInFolder(outputFile);
    callback('压缩成功');
  });
  console.log(`spawnfile: ${ChildProcess.spawnfile}`);
}

exports.uncompress7z = function(sourceFile, targetPath, callback) {
  console.log(`sourceFile: ${sourceFile}`);
  console.log(`targetPath: ${targetPath}`);
  let command = path7za + ' x "' + sourceFile + '" -o"' + targetPath + '" ';
  let ChildProcess = child_process.exec(command, function(error, stdout, stderr) {
    if (error) {
      console.error(`exec error: ${error}`);
      callback('解压失败');
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    shell.showItemInFolder(targetPath);
    callback('解压成功');
  });
  console.log(`spawnfile: ${ChildProcess.spawnfile}`);
}

exports.compressZip = function(arg) {
  let output = fs.createWriteStream(outputPath);
  var archive = archiver('zip');
  archive.on('error', function(err) {
    throw err;
  });
  archive.on('close', function() {
      console.log('close');
  });
  archive.pipe(output);
  archive.directory(arg, arg.substr(arg.lastIndexOf('\\') + 1, arg.length));
  archive.finalize();
}

exports.uncompressZip = function(arg, arg2) {
  console.log(arg);
  console.log(arg2);
  // fs.createReadStream(arg).pipe(unzip.Extract({path: arg2}));

  // fs.createReadStream(arg)
  // .pipe(unzip.Parse())
  // .on('entry', function (entry) {
  //   var fileName = entry.path;
  //   var type = entry.type; // 'Directory' or 'File'
  //   var size = entry.size;
  //   if (fileName === "this IS the file I'm looking for") {
  //     entry.pipe(fs.createWriteStream(arg2));
  //   } else {
  //     entry.autodrain();
  //   }
  // });

  // var readStream = fs.createReadStream(arg);
  // var writeStream = fstream.Writer(arg2);
  //
  // readStream
  //   .pipe(unzip.Parse())
  //   .pipe(writeStream);
}
