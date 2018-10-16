var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  gulpIncludeTemplate = require("gulp-include-template"),
  tinypng = require('gulp-tinypng-compress'),
  clean = require('gulp-clean');

gulp.task('css', function () {
  return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/*')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('app/assets/fonts'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
  gulp.src([
    './node_modules/jquery/dist/jquery.js',
    'src/js/libs/jquery.touchSwipe.js',
    'src/js/app.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('tinypng', function () {
  gulp.src('src/img/png/*.{png,jpg,jpeg}')
    .pipe(tinypng({
      key: 'omLn47dzpaSLyK2Tg01Gc6jnEduzGonp',
      log: true,
      summarise: true
    }).on('error', function(err) {
      console.log(err.message);
    }))
    .pipe(gulp.dest('app/assets/img'));
});

gulp.task("includeTemplate", function () {
  return gulp.src("src/pages/index.html")
    .pipe(gulpIncludeTemplate())
    .pipe(gulp.dest("./app"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function () {
  browserSync.init(null, {
    server: {
      baseDir: "app"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('clear', function () {
  return gulp.src('app/', {read: false})
    .pipe(clean());
});

gulp.task('default', ['css', 'js', 'tinypng', 'fonts', 'includeTemplate', 'browser-sync'], function () {
  gulp.watch("src/img/**/*", ['tinypng']);
  gulp.watch("src/scss/**/*.scss", ['css']);
  gulp.watch("src/js/*.js", ['js']);
  gulp.watch("src/pages/**/*.html", ['bs-reload', 'includeTemplate']);
});
