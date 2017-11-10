var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    babel = require("gulp-babel"),
    htmlminify = require("gulp-html-minify");

var DEST = 'build';

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/*.js',
      ])
      .pipe(babel())
      // .pipe(concat('custom.js'))
      // .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(browserSync.stream());
});

gulp.task('less', function () {
    gulp.src('src/less/**/*.less')
        .pipe(less())
        .pipe(concat('custom.css'))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(DEST+'/css'))
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './build/index.html'
    });
});

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(htmlminify())
        .pipe(gulp.dest('build'))
});

// 图片处理任务
gulp.task('images', function() {
  return gulp.src('src/img/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))      //压缩图片
    .pipe(gulp.dest(DEST + '/img'))
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('build/*.html');
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .less files
  gulp.watch('src/less/**/*.less', ['less']);
  // html
  gulp.watch('src/**/*.html', ['html']);
  // browser-sync
  gulp.watch(['build/**']).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['scripts', 'less', 'images', 'html','serve', 'watch']);
