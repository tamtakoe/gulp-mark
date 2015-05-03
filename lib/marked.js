var through = require('through2');

function ifMarked(condition, trueChild, falseChild, one) {
    var existence = false;

    if (!trueChild) {
        throw new Error('ifMarked: child action is required');
    }

    function processing(file, pipeFn, generalCallback) {
        var processedFile;
        var stream = through.obj();
        stream.write(file);
        stream
            .pipe(pipeFn, { end: false })//prevent error: write after end
            .pipe(through.obj(function(file, enc, callback) {
                processedFile = file;

                callback();
                stream.end();
            }));
        stream.on('end', function() {
            generalCallback(null, processedFile);
        });
    }

    function transform(file, enc, callback) {
        if (one && existence) {
            processing(file, trueChild, callback);

        } else {
            if (file.mark === condition) {
                existence = true;
                processing(file, trueChild, callback);

            } else if (falseChild) {
                processing(file, falseChild, callback);

            } else {
                callback(null, file);
            }
        }
    }

    return through.obj(transform);
}

function afterMarked(condition, trueChild, falseChild) {
    return ifMarked(condition, trueChild, falseChild, true);
}

module.exports = {
    if:             ifMarked,
    after:          afterMarked
};