var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    del = require('del');


// Clean
gulp.task('clean', function() {
    return del(['dist/**/*']);
});

gulp.task('cleanBower', function() {
    return del(['app/bower_components/**']).then(_ => {
        gulp.src('bower_components/**/*').pipe(gulp.dest('app/bower_components/'));
    });
});

// Simply serve, without build
gulp.task('watch', ['cleanBower'], function() {

    browserSync.init(['app/**'], {
        server: {
            baseDir: "app",
            index: "index.html",
        },
        port: 35143,
    });
    // Watch any files in app/, reload on change
    gulp.watch(['app/**']).on('change', browserSync.reload);


});

gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});



gulp.task('usemin', ['clean', 'jshint'], function() {
    return gulp.src(['app/**/*.html', '!app/client/**', '!app/bower_components/**'])
        .pipe(usemin({
            css: [minifycss(), rev()],
            js: [ngannotate(), uglify(), rev()]
        })).pipe(gulp.dest('dist/')),
        gulp.src('./app/data/*').pipe(gulp.dest('dist/data/'));
});

// Images
gulp.task('imagemin', ['clean'], function() {
    return del(['dist/images']),
        gulp.src('app/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images')),
        gulp.src('app/*.ico')
        .pipe(gulp.dest('dist'))
});

// // Copyfonts
// gulp.task('copyfonts', ['clean'], function() {
//   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
//     .pipe(gulp.dest('./dist/fonts'));
//   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
//     .pipe(gulp.dest('./dist/fonts'));
// });

// build task
// gulp.task('build', ['usemin', 'imagemin', 'copyfonts']);
gulp.task('build', ['usemin', 'imagemin']);

gulp.task('browser-sync', ['build'], function() {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.png',
        'app/scripts/**/*.js',
        'app/data/*',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "dist",
            index: "index.html",
        },
        port: 35142,
    });
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
});

// Watch and serve
gulp.task('serve', ['browser-sync'], function() {
    // Watch .js files
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html,app/data/*}', ['usemin']);
    // Watch image files
    gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('default', ['build']);

gulp.task('cleanHome', function() {
  return del(['../dist/**'], {
    force: true
  });
});

gulp.task('deploy', ['cleanHome'], function() {
  gulp.src(['dist/**']).pipe(gulp.dest('../dist/')); //bugs here... can not merge it into one task...(missing files)
});
