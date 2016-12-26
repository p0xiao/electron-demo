const electron = require('electron');
const path = require('path');
const url = require('url');

const archiver = require('archiver');
const unzip = require('unzip');
const fstream = require('fstream');
const os = require('os');
const CompressUtil = require('./service/compress.js');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const Tray = electron.Tray;
const shell = electron.shell;

const rightMenu = new Menu();
rightMenu.append(new MenuItem({ label: 'Hello', type: 'checkbox', checked: true}));
rightMenu.append(new MenuItem({ type: 'separator' }));
rightMenu.append(new MenuItem({ label: '刷新', role: 'reload'}));

let mainWindow;
let appIcon;
// 菜单模板
const menuTemplate = [{
  label: '编辑',
  submenu: [{
    label: '刷新',
    role: 'reload'
  }, {
    label: '撤销',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: '重做',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: '退出',
    accelerator: 'Alt+F4',
    click: function() {
      app.quit();
    }
  }]
}, {
  label: '帮助',
  role: 'help',
  submenu: [{
    label: '更新',
    click: function() {
      shell.openExternal('https://hmp.cim120.cn')
    }
  }, {
    label: '开发者工具',
    role: 'toggledevtools'
  }]
}];
// 托盘菜单
const trayMenuTemplate = [{
  label: '退出',
  click: function() {
    app.quit();
  }
}];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.on('close', function() {
    mainWindow = null;
  });

  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function createTray() {
  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  let iconPath = path.join(__dirname, 'favicon.ico');
  appIcon = new Tray(iconPath);
  appIcon.setToolTip('Electron demo');
  appIcon.setContextMenu(trayMenu);
}

app.on('ready', function() {
  createWindow();
  createTray();
});

app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    rightMenu.popup(win, params.x, params.y)
  })
});

app.on('window-all-closed', function () {
  if (appIcon) appIcon.destroy();
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// 打开文件夹选择框
ipcMain.on('open-file-dialog', function(event) {
  dialog.showOpenDialog({
    properties: ['open', 'openDirectory']//, 'multiSelections'],
    // filters: [{name: '压缩文件', extensions: ['zip', 'rar', '7z']}]
  }, function(files){
    if (files) event.sender.send('selected-directory', files);
  });
});

ipcMain.on('compress-file', function(event, arg) {
  console.log('directory:' + arg);
  CompressUtil.compress(arg);
});

ipcMain.on('uncompress-file', function(event, arg) {
  console.log('uncompress');
  CompressUtil.uncompress(os.tmpdir() + '\\test.zip', os.tmpdir() + '\\test');
});
