var setMark                  = require('./lib/setMark');
var separateStreamFromMarked = require('./lib/separateStreamFromMarked');
var marked                   = require('./lib/marked');
var concatMarked             = require('./lib/concatMarked');

module.exports = {
    set:      setMark,
    separate: separateStreamFromMarked,
    concat:   concatMarked,
    if:       marked.if,
    after:    marked.after
};