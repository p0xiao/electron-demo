const {shell, ipcRenderer} = require('electron');

// 打开记事本
let notepadBtn = document.getElementById('notepad');
notepadBtn.addEventListener('click', function(event) {
  let r = shell.openExternal('notepad');
  console.log(r);
});

// 文件拖动获取路径
// let holder = document.getElementById('holder');
// holder.ondragover = function () {
//   return false;
// };
// holder.ondragleave = holder.ondragend = function () {
//   return false;
// };
// holder.ondrop = function (e) {
//   e.preventDefault();
//   var file = e.dataTransfer.files[0];
//   console.log('File you dragged here is', file.path);
//   document.getElementById('file-path').innerText = file.path;
//   return false;
// };

// 文件选择，压缩，解压
let fileManage = document.getElementById('file-manage');
fileManage.addEventListener('click', function(event) {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('selected-directory', function(event, path) {
  document.getElementById('file-path').innerText = path;
});

let fileCompress = document.getElementById('file-compress');
fileCompress.addEventListener('click', function(event) {
  ipcRenderer.send('compress-file', document.getElementById('file-path').innerText);
});

// let fileUncompress = document.getElementById('file-uncompress');
// fileUncompress.addEventListener('click', function(event) {
//   ipcRenderer.send('uncompress-file', document.getElementById('file-path').innerText);
// });
