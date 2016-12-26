
const electron = require('electron');
const fs = require('fs');
const archiver = require('archiver');
const unzip = require('unzip');
const fstream = require('fstream');
const os = require('os');
const shell = electron.shell;

exports.compress = function(arg) {
  let outputPath = os.tmpdir() + '\\test.zip';
  console.log('file:' + outputPath);
  // compress
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
  shell.showItemInFolder(outputPath);
  console.log(arg.length);
  console.log(arg.lastIndexOf('\\'));
  console.log(arg.substr(arg.lastIndexOf('\\') + 1, arg.length));
}

exports.uncompress = function(arg, arg2) {
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

  var readStream = fs.createReadStream(arg);
  var writeStream = fstream.Writer(arg2);

  readStream
    .pipe(unzip.Parse())
    .pipe(writeStream);
}
