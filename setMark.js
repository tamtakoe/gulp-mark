var path    = require('path');
var through = require('through2');

function setMark(mark, pathToken) {
    function transform(file, enc, callback) {
        if (!pathToken || file.path.indexOf(path.normalize(pathToken)) !== -1) {
            file.mark = mark;
        }

        callback(null, file);
    }

    return through.obj(transform);
}

module.exports = setMark;