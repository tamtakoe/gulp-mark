var setMark                  = require('./setMark');
var separateStreamFromMarked = require('./separateStreamFromMarked');
var marked                   = require('./marked');
var concatMarked             = require('./concatMarked');

module.exports = {
    set:      setMark,
    separate: separateStreamFromMarked,
    concat:   concatMarked,
    if:       marked.if,
    after:    marked.after
};