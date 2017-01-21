var gulp = require('gulp'),
    liveServer = require("live-server");
 

gulp.task('serve', function() {
    var params = {
        port: 8008, // Set the server port. Defaults to 8080.
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: "www", // Set root directory that's being served. Defaults to cwd.
        open: false, // When false, it won't load your browser by default.
        file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
        wait: 0, // Waits for all changes, before reloading. Defaults to 0 sec.
        logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
    };
    liveServer.start(params);
})
