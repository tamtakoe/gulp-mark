var through = require('through2');

function separateStreamFromMarked(marks, streams) {
    marks   = marks instanceof Array   ? marks   : [marks];
    streams = streams instanceof Array ? streams : [streams];

    function transform(file, enc, callback) {
        var coincidence = false;

        for (var i = 0; i < marks.length; i++) {
            if (file.mark === marks[i]) {
                (streams[i] || streams[streams.length - 1]).push(file);
                callback();
                coincidence = true;
                break;
            }
        }

        if (!coincidence) {
            callback(null, file);
        }
    }

    function flush(callback) {
        for (var i = 0; i < streams.length; i++) {
            streams[i].end();
        }

        callback();
    }

    return through.obj(transform, flush);
}

module.exports = separateStreamFromMarked;