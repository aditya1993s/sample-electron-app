const { BrowserWindow, app, ipcMain, Notification } = require("electron");
const path = require("path");
const fs = require("fs");

const electron = require("electron");
const child_process = require("child_process");
const dialog = electron.dialog;

const isDev = !app.isPackaged;

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  // win.webContents.toggleDevTools();
  // win.webContents.on("devtools-opened", () => {
  //   setImmediate(() => {
  //     win.focus();
  //   });
  // });
}

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

app.whenReady().then(createWindow);

ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Notifiation", body: message }).show();
});

ipcMain.on("listFiles", (event, arg) => {
  let data = [];
  // fs.readdir(path.join(__dirname, "environment"), function (err, files) {
  fs.readdir(
    path.join(arg === "" ? __dirname + "/environment" : arg),
    function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      files.forEach(function (file) {
        data.push(file);
      });
      event.reply("data-reply", data);
    }
  );
});

ipcMain.on("getFileContent", (event, arg) => {
  let rawdata = fs.readFileSync(
    arg.includes("/")
      ? path.join(arg)
      : path.join(path.join(__dirname, "environment"), arg)
  );
  event.reply("file-content", JSON.parse(rawdata));
});

ipcMain.on("runCommand", (event, arg) => {
  run_script(arg, [""], null);
  // event.reply("file-content", JSON.parse(rawdata));
});

function run_script(command, args, callback) {
  var child = child_process.spawn(command, args, {
    encoding: "utf8",
    shell: true,
  });
  // You can also use a variable to save the output for when the script closes later
  child.on("error", (error) => {
    dialog.showMessageBox({
      title: "Title",
      type: "warning",
      message: "Error occured.\r\n" + error,
    });
  });

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    //Here is the output
    data = data.toString();
    console.log(data);
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (data) => {
    // Return some data to the renderer process with the mainprocess-response ID
    win.webContents.send("mainprocess-response", data);
    //Here is the output from the command
    console.log(data);
  });

  // child.on("close", (code) => {
  //   //Here you can get the exit code of the script
  //   switch (code) {
  //     case 0:
  //       dialog.showMessageBox({
  //         title: "Title",
  //         type: "info",
  //         message: "End process.\r\n",
  //       });
  //       break;
  //   }
  // });
  if (typeof callback === "function") callback();
}

// "watch": "export SET NODE_OPTIONS=--openssl-legacy-provider && webpack --config webpack.common.js --watch",
