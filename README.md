# gulp-mark [![NPM version](https://badge.fury.io/js/gulp-mark.svg)](http://badge.fury.io/js/gulp-mark)

> gulp plugin to mark files.

## Install with [npm](npmjs.org)

```sh
npm i gulp-mark --save-dev
```

## Usage

```js
var gulp = require('gulp');
var mark = require('gulp-mark');
```



### mark.set(mark [, pathToken])

Set attribute `mark` to vinyl file object. You can read the value as `file.mark`.

#### Parameters

##### mark {String}

Value of `mark` attribute.

##### pathToken

Set `mark` if `file.path` contain `pathToken` substring.

#### Usage

```js
var scriptStream = gulp.src('src/**/*.js')
    .pipe(mark.set('script'))
    .pipe(mark.set('config', name + '/config.js'));
    
var styleStream = gulp.src('src/**/*.css')
    .pipe(mark.set('style'));
      
var finalStream = merge(scriptStream, stylesStream);
  
//Now you can process different types of files in one stream
finalStream.pipe(through.obj(function(file, enc, callback) {
    if (file.mark === 'script') {
        ...
    }
    if (file.mark === 'config') {
        ...
    }
    if (file.mark === 'style') {
        ...
    }
    
    ...
}))
```



### mark.if(mark, stream [, elseStream])

It will pipe data to stream for files whenever `mark` equivalent to `file.mark`.

If `mark` is not equivalent and elseStream is passed, data will pipe to elseStream.

After data is piped to stream or elseStream or neither, data is piped down-stream.


#### Parameters

##### mark {String}

Condition for `mark` attribute.

##### stream

Stream for `mark.if` to pipe data into when conditon is truthy.

##### elseStream

Optional, Stream for `mark.if` to pipe data into when condition is falsey.

#### Usage

```js
finalStream
    .pipe(mark.if('script', uglify()))
    .pipe(mark.if('style', cssmin()))
```




### mark.after(mark, stream [, elseStream])

As `mark.if` but pipe data to stream for all subsequent files whenever `mark` equivalent to `file.mark`.


#### Parameters

##### mark {String}

Condition for `mark` attribute.

##### stream

Stream for `mark.after` to pipe data into when conditon is truthy.

##### elseStream

Optional, Stream for `mark.after` to pipe data into when condition is falsey.

#### Usage

```js
series(scriptsStream, templatesStream, configStream, stylesStream) //merged by order
    .pipe(gulpMark.after('template', gulpMark.if('config', gulpAmd({add: 'module/templates'}))));
    //if files marked as 'template' is in final stream we add 'module/templates' dependency to next config files (if they exists)
```






### mark.concat(files)

This will concat marked files by your operating systems newLine as [https://github.com/wearefractal/gulp-concat](gulp-concat).

#### Parameters

##### files {Array}

`files` is array of objects with params of output files like `{path: 'script.js',  marks: ['script', 'config']}`.
This means that we will get the file `script.js` consisting of the files marked as `script` and `config` in the output stream.

#### Usage

```js
finalStream
    .pipe(mark.concat([{path: 'script.js',  marks: ['script', 'template', 'config']}, {path: 'style.css', marks: 'style'}]))
    //we will have two files `script.js` and `style.css` in the output stream
```





### mark.separateStream(marks, streams)

This will concat marked files by your operating systems newLine as [https://github.com/wearefractal/gulp-concat](gulp-concat).

#### Parameters

##### marks {String} or {Array} of strings

mark or array of marks

##### streams {Stream} or {Array} of streams

stream or array of streams which corresponding marks

#### Usage

```js
var scriptStream   = through.obj();
var templateStream = through.obj();
var styleStream    = through.obj();

gulp.src('src/**/*')
    .pipe(gulpMark.set('script',   '.js'))
    .pipe(gulpMark.set('template', '.html'))
    .pipe(gulpMark.set('style',    '.css'))
    .pipe(gulpMark.separateStream(['script', 'template', 'style'], [scriptStream, templateStream, styleStream]));
//we will have `scriptsStream` with js-files, `templateStream` with .html-files and `styleStream` with .css-files      
```




## License

Copyright (c) 2014-2015 Oleg Istomin
Released under the MIT license

***