'use strict';
const os = require('os');
const path = require('path');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();

const { addDomain, About } = require('./windowmanager');

function sendAction(action) {
  const win = BrowserWindow.getAllWindows()[0];

  if (process.platform === 'darwin') {
    win.restore();
  }

  win.webContents.send(action);
}

const viewSubmenu = [
{
  label: 'Reload',
  accelerator: 'CmdOrCtrl+R',
  click (item, focusedWindow) {
    if (focusedWindow) focusedWindow.reload()
  }
},
{
  label: 'Toggle Developer Tools',
  accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
  click (item, focusedWindow) {
    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
  }
},
{
  type: 'separator'
},
{
  role: 'togglefullscreen'
}
];

const helpSubmenu = [
  {
    label: `${appName} Website`,
    click() {
      shell.openExternal('https://github.com/zulip/zulip-electron');
    }
  },
  {
    label: 'Report an Issue...',
    click() {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

      shell.openExternal(`https://github.com/zulip/zulip-electron/issues/new?body=${encodeURIComponent(body)}`);
    }
  }
];

const darwinTpl = [

  {
    label: 'Zulip',
    submenu: [
      {
        label: 'About',
        click() {
          About();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Change Zulip Server',
        accelerator: 'Cmd+,',
        click() {
          addDomain();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Log Out',
        click() {
          sendAction('log-out');
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: viewSubmenu
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      },
      {
        type: 'separator'
      },
      {
        role: 'front'
      }
    ]
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
];

const otherTpl = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Log Out',
        click() {
          sendAction('log-out');
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        type: 'separator'
      },
      {
        role: 'selectall'
      },
      {
        type: 'separator'
      },
      {
        label: 'Change Zulip Server',
        accelerator: 'Ctrl+,',
        click() {
          addDomain();
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: viewSubmenu
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
];

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(tpl);