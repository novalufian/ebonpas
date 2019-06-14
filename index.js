const {
    app,
    BrowserWindow,
    globalShortcut,
    Notification
} = require('electron')
require('electron-reload')(__dirname);
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
        transparent: false,
    })

    mainWindow.loadFile('./app/views/index.html')

    mainWindow.on('closed', function() {
        mainWindow = null
    })
}


app.on('ready', createWindow)
// app.on('ready', createWindowHutang)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})


app.on('ready', () => {
    globalShortcut.register('F1', () => {
        myNotification.show();
    })

    let myNotification = new Notification('Title', {
        body: 'Lorem Ipsum Dolor Sit Amet'
    })

})

// tempatle 
// https://blackrockdigital.github.io/startbootstrap-sb-admin-2/charts.html