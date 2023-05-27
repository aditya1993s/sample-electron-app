const { BrowserWindow, app, ipcMain, Notification } = require("electron");
const path = require("path");
const fs = require("fs");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.webContents.toggleDevTools();
  win.webContents.on("devtools-opened", () => {
    setImmediate(() => {
      win.focus();
    });
  });
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
  fs.readdir(path.join(__dirname, "environment"), function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function (file) {
      data.push(file);
    });
    event.reply("data-reply", data);
  });
});

ipcMain.on("getFileContent", (event, arg) => {
  let rawdata = fs.readFileSync(
    path.join(path.join(__dirname, "environment"), arg)
  );
  event.reply("file-content", JSON.parse(rawdata));
});

// const run_script = (command, args, callback) => {
//   var child = child_process.spawn(command, args, {
//     encoding: "utf8",
//     shell: true,
//   });
//   // You can also use a variable to save the output for when the script closes later
//   child.on("error", (error) => {
//     con.log(`error: ${error.message}`);
//   });

//   child.stdout.setEncoding("utf8");
//   child.stdout.on("data", (data) => {
//     //Here is the output
//     data = data.toString();
//     con.log(data);
//   });

//   child.stderr.setEncoding("utf8");
//   child.stderr.on("data", (data) => {
//     con.log(data);
//   });

//   child.on("close", (code) => {
//     //Here you can get the exit code of the script
//     switch (code) {
//       case 0:
//         con.log(`child process exited with code ${code}`);
//         break;
//     }
//     con.log(`child process exited with code ${code}`);
//   });
//   if (typeof callback === "function") callback();
// };
