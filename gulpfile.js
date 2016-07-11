'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    rimraf = require('rimraf'),
    haml = require('gulp-haml'),
    concat = require('gulp-concat'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    browserSync = require("browser-sync")

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        images: 'build/images/',
        fonts: 'build/fonts/',
        sprite: 'build/images/',
        templates: 'src/template/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprite: 'src/images/sprite/*.png',
        spriteScss: 'src/style/partials',
        templates: 'src/template/parts/*.haml'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprite: 'src/images/sprite/*.png',
        templates: 'src/template/parts/*.haml'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
});

gulp.task('haml:build', function() {
    var YOUR_LOCALS = {};

    gulp.src(path.src.templates)
        .pipe(haml({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest(path.build.templates))
});


gulp.task('image:build', function () {
    gulp.src(path.src.images)
        //.pipe(imagemin({
        //    progressive: true,
        //    svgoPlugins: [{removeViewBox: false}],
        //    interlaced: true
        //}))
        .pipe(gulp.dest(path.build.images))
        //.pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src([
        path.src.js])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/style/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(concat('common.css'))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('sprite:build', function () {
    // Generate our spritesheet
    var spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
        imgName: 'sprite.png',
        retinaImgName: 'sprite-2x.png',
        cssName: 'sprite.scss',
        retinaSrcFilter: ['src/images/sprite/*-2x.png'],
        cssTemplate: 'spritesmith-template.mustache'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        .pipe(gulp.dest(path.build.sprite));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(gulp.dest(path.src.spriteScss));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
    'haml:build',
    'html:build',
    'sprite:build',
    'js:build',
    'style:build',
    'image:build',
    'fonts:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.templates], function(event, cb) {
        gulp.start('haml:build');
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.images], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });
});


gulp.task('default', ['build', 'watch']);