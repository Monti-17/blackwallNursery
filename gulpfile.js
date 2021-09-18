const {
  src,
  dest,
  watch,
  series
} = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
var cache = require('gulp-cache');
var del = require('del');
var gulp = require('gulp');

// Sass Task
function scssTask() {
  return src('app/scss/*.**(.sass|.scss|.css)', {
      sourcemaps: true
    })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist', {
      sourcemaps: '.'
    }));
}

// JavaScript Task
function jsTask() {
  return src('app/js/**/*.js', {
      sourcemaps: true
    })
    .pipe(terser())
    .pipe(dest('dist', {
      sourcemaps: '.'
    }));
}

function imageSquash() {
  return src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      // Setting interlaced to true
      interlaced: true
    })))
    .pipe(dest('dist/images'))
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload);
  watch(['app/scss/**/*.+(sass|scss)', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}


// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  //imageSquash,
  watchTask
);
