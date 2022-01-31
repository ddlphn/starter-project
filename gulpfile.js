// Dependencies
const gulp = require('gulp'),
      { parallel, series } = require('gulp'),
      uglify = require('gulp-uglify'),
      sass = require('gulp-sass')(require('sass')),
      concat = require('gulp-concat'),
      browserSync = require('browser-sync').create(),
      autoprefixer = require('gulp-autoprefixer'),
      babel = require('gulp-babel'),
      sassGlob = require('gulp-sass-glob');

// JS TASK
function jsTask(callback) {
    gulp.src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/swiper/swiper-bundle.min.js',
      // 'node_modules/gsap/dist/gsap.min.js',
      'src/assets/js/*js'
    ])
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
  callback();
}

// SASS TASK
function cssTask(callback) {
  gulp.src([
    'node_modules/swiper/swiper-bundle.min.css',
    'src/assets/sass/*.scss'
    ])
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
        browserlist: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
  callback();
}

// WATCH TASK
function watchTask() {
  browserSync.init({
      server: {
          baseDir: './'
      }
  });
  gulp.watch('src/assets/sass/**/*.scss', cssTask);
  gulp.watch('src/assets/js/*.js', jsTask).on(
      'change',
      browserSync.reload
  );
}


exports.default = series(cssTask, jsTask, watchTask);
exports.build = parallel(cssTask, jsTask);