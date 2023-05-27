const { ipcRenderer, contextBridge } = require("electron");

// contextBridge.exposeInMainWorld("electron", {
//   notificationApi: {
//     sendNotification(message) {
//       ipcRenderer.send("notify", message);
//     },
//   },
//   batteryApi: {},
//   filesApi: {
//     getAllFiles(folderPath) {
//       ipcRenderer.send("listFiles", folderPath);
//       ipcRenderer.on("listFiles", (event, data) => {
//         // Process the received data
//         console.log(data);
//       });
//     },
//   },
// });

contextBridge.exposeInMainWorld("electronAPI", {
  requestData: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send("listFiles");
      ipcRenderer.once("data-reply", (event, data) => {
        resolve(data);
      });
    });
  },

  requestFileContent: (file) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send("getFileContent", file);
      ipcRenderer.once("file-content", (event, data) => {
        resolve(data);
      });
    });
  },
});
