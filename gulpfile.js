var gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    browserify = require('browserify'),
    es         = require('event-stream'),
    livereload = require('gulp-livereload'),
    stringify  = require('stringify'),
	fs         = require('fs');



gulp.task('default', ['bundle-app'], function() { // include 'bundle' if you want to bundle js in /pagejs
      
    process.env.NODE_ENV = "development";

    livereload.listen();

    gulp.watch([
        'app/*',
        'app/**/*',
        '!app/styles/*',
        '!app/dist/**',
        '!app/dist/**/*',
    ], ['bundle-app']); 

});


gulp.task('build', [], function() {
            
    process.env.NODE_ENV = 'production'; // for react minimization

    gulp.start('bundle-app');

});



gulp.task('bundle', function() {
    // we define our input files, which we want to have
    // bundled:

    var files = fs.readdirSync(__dirname+'/pagejs/');

    console.log('Transforming files:', files);

    files = files.map(function(file){
        return './pagejs/' + file;
    });

    // map them to our stream function
    var tasks = files.map(function(entry) {
        var _timestart = new Date();
        console.log('Building', entry);
        var stream = browserify({ 
                entries: [entry],
                debug: true,
            })
            .on('error', onError)
            .transform("babelify", {
                    presets: ["es2015", "react"], // es2017 eventually
                    plugins: ["transform-inline-environment-variables"]
            })
            .bundle()
            .pipe(source(entry));
        if(process.env.NODE_ENV == 'production'){
            stream = stream.pipe(buffer())
            .pipe(uglify());
        }
        // rename them to have "bundle as postfix"
        stream = stream.pipe(rename({
                dirname: './',
                extname: '.bundle.js'
            }))
            .pipe(gulp.dest('./server/public/js/pages'))
            .pipe(livereload());

        stream.on('end', function() {
            console.log('Done building',entry, (new Date()).getTime() - (_timestart.getTime()));
        });

        stream.on('error', function(err) {
            console.log('ERROR building',entry);
        });
        return stream;

    });
});

gulp.task('bundle-app', function() {
    // we define our input files, which we want to have
    // bundled:

    var files = ['./app/entry.js'];

    // map them to our stream function
    var tasks = files.map(function(entry) {
        var _timestart = new Date();
        console.log('Building', entry);
        var stream = browserify({ 
                entries: [entry],
                debug: true,
                paths: [
                    'app'
                ]
            })
            .on('error', onError)
            .transform("babelify", {
                    presets: ["es2015", "react"], // es2017 eventually
                    plugins: ["transform-inline-environment-variables","transform-object-rest-spread"]
            })
            .on('error', onError)
            .bundle()
            .on('error', onError)
            .pipe(source(entry));
        if(process.env.NODE_ENV == 'production'){
            stream = stream.pipe(buffer())
            .pipe(uglify());
        }
        // rename them to have "bundle as postfix"
        stream = stream.pipe(rename({
                dirname: './',
                extname: '.bundle.js'
            }))
            // .pipe(gulp.dest('./app/dist'))
            .pipe(gulp.dest('./server/public/js')) // move build files to the /server/public/js directory to be served
            .pipe(livereload());
        stream.on('end', function() {
            console.log('Done building',entry, (new Date()).getTime() - (_timestart.getTime()));
        });

        stream.on('error', function(err) {
            console.log('ERROR building',entry);
        });
        return stream;

    });

});
          

function onError(err) {
  console.log(err);
  this.emit('end');
}
