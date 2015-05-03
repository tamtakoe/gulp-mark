var path        = require('path');
var through     = require('through2');
var Concat      = require('concat-with-sourcemaps');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var File        = gutil.File;

function concatMarked(files) {
    if (!files) {
        throw new PluginError('gulp-mark', 'Missing files option for gulp-mark:concat');
    }
    files = files instanceof Array ? files : [files];

    var output   = [];
    var marksMap = {};

    for (var i = 0; i < files.length; i++) {
        var marks = files[i].marks ? (files[i].marks instanceof Array ? files[i].marks : [files[i].marks]) : [];

        if (!marks.length) {
            marks = [''];
        }

        for (var j = 0; j < marks.length; j++) {
            marksMap[marks[j]] = i;
        }

        output[i] = {
            fileName: path.basename(files[i].path), //files[i].path,
            firstFile: null,
            concat: null,
            // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
            newLine: typeof files[i].newLine === 'string' ? files[i].newLine : gutil.linefeed
        };
    }

    function transform(file, enc, callback) {
        var index = marksMap[file.mark || ''];

        if (index !== undefined) {
            var out   = output[index];

            out.firstFile = out.firstFile || new File({
                base: file.base,
                path: path.join(file.base, out.fileName)
            });//file;
            out.concat    = out.concat    || new Concat(!!out.firstFile.sourceMap, out.fileName, out.newLine);

            out.concat.add(file.relative, file.contents.toString(), file.sourceMap);
            out.concat.mark = file.mark;
        }

        callback();
    }

    function flush(callback) {
        for (var i = 0; i < output.length; i++) {
            var out        = output[i];
            var joinedFile = out.firstFile;

            if (joinedFile) {
                joinedFile.mark = out.concat.mark;
                joinedFile.contents = new Buffer(out.concat.content);

                if (out.concat.sourceMapping) {
                    joinedFile.sourceMap = JSON.parse(out.concat.sourceMap);
                }

                this.push(joinedFile);
            }
        }

        callback();
    }

    return through.obj(transform, flush);
}

module.exports = concatMarked;