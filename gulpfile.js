let gulp                  = require('gulp'),
    sass                  = require('gulp-sass'),
    sourcemaps            = require('gulp-sourcemaps'),
    autoprefixer          = require('gulp-autoprefixer'),
    cssnano               = require('gulp-cssnano'),
    rename                = require('gulp-rename'),
    cache                 = require('gulp-cache'),
    uglify                = require('gulp-uglify'),
    gulpIncludeTemplate   = require("gulp-include-template"),
    runSequence           = require('run-sequence'),
    browserSync           = require('browser-sync'),
    clean                 = require('gulp-clean'),
    concat                = require('gulp-concat'),
    imagemin              = require('gulp-imagemin');

  // path = require('gulp-path');
  // var dir_dist = new path('src', 'dist/assets');

gulp.task("html", function () {
  return gulp.src("src/pages/*.html")
    .pipe(gulpIncludeTemplate())
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function () {
  return gulp.src('src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/*')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('files', function () {
  return gulp.src('src/files/*')
    .pipe(gulp.dest('dist/assets/files'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
  gulp.src([
    './node_modules/jquery/dist/jquery.js',
    'src/js/libs/jquery.touchSwipe.js',
    'src/js/libs/jquery.magnific-popup.min.js',
    'src/js/libs/tether.min.js',
    'src/js/libs/bootstrap.js',
    'src/js/libs/slick.js',
    'src/js/app.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(concat('all-js.min.js'))
    .pipe(gulp.dest('dist/assets/js/'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('browser-sync', function () {
  browserSync.init(null, {
    server: {
      baseDir: "dist"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('clear', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('watch', ['browser-sync', 'html', 'images', 'fonts', 'files', 'js', 'css'], function () {
  gulp.watch("src/img/**/*", ['bs-reload', 'images']);
  gulp.watch("src/fonts/**/*", ['fonts']);
  gulp.watch("src/files/**/*", ['files']);
  gulp.watch("src/scss/**/*.scss", ['css']);
  gulp.watch("src/js/**/*.js", ['bs-reload', 'js']);
  gulp.watch("src/pages/**/*.html", ['bs-reload', 'html']);
});

gulp.task('build', function(callback) {
  runSequence('clear', ['html', 'images', 'fonts', 'files', 'js', 'css'], 'browser-sync', callback);
});
