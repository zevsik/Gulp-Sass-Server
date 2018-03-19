var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpIncludeTemplate = require("gulp-include-template"),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith');


gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/*')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('app/assets/fonts'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('src/js/scripts.js')
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

// gulp.task('images', () =>
//   gulp.src('src/img/*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('./app/assets/img'))
//     .pipe(imagemin([
//       imagemin.gifsicle({interlaced: true}),
//       imagemin.jpegtran({progressive: true}),
//       imagemin.optipng({optimizationLevel: 1}),
//       imagemin.svgo({
//         plugins: [
//           {removeViewBox: true},
//           {cleanupIDs: false}
//         ]
//       })
//     ]))
// );

gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/png/*.png')
    .pipe(spritesmith({
      /* this whole image path is used in css background declarations */
      imgName: 'sprite.png',
      cssName: 'sprite.css'
    }));
  spriteData.img.pipe(gulp.dest('app/assets/css/'));
  spriteData.css.pipe(gulp.dest('src/scss/utils'));
});

gulp.task("includeTemplate", function() {
  return gulp.src("src/sections/index.html")
    .pipe(gulpIncludeTemplate())
    .pipe(gulp.dest("./app"))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'sprite', 'fonts', 'includeTemplate', 'browser-sync'], function () {
    gulp.watch("src/img/**/*", ['bs-reload']);
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/pages/**/*.html", ['bs-reload', 'includeTemplate']);
});
