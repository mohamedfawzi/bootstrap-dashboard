
var files = require('./path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');


var paths = {
    styles: {
      src: 'source/scss/**/*.scss',
      dest: 'dist/css/'
    },
    scripts: {
      src: files.scripts,
      dest: 'dist/js/'
    },
    images: {
        src: 'source/images/**/*.*',
        dest: 'dist/images'
    }

  };
   
  /* Not all tasks need to use streams, a gulpfile is just another node program
   * and you can use all packages available on npm, but it must return either a
   * Promise, a Stream or take a callback and call it
   */
  function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del([ 'dist' ]);
  }
   
  /*
   * Define our tasks using plain functions
   */
  function assets(){
    return gulp.src(paths.images.src)
    // pass in options to the stream
    
    .pipe(gulp.dest(paths.images.dest));
  }
  function styles() {
    return gulp.src(paths.styles.src)
      .pipe(sass())
      .pipe(cleanCSS())
      // pass in options to the stream
      .pipe(rename({
        basename: 'app',
        suffix: '.min'
      }))
      .pipe(gulp.dest(paths.styles.dest));
  }
   
  function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
      .pipe(babel())
      .pipe(uglify())
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest(paths.scripts.dest));
  }
   
  function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
  }
   
  /*
   * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
   */
  var build = gulp.series(clean, gulp.parallel(styles, scripts, assets));
   
  /*
   * You can use CommonJS `exports` module notation to declare tasks
   */
  exports.clean = clean;
  exports.styles = styles;
  exports.scripts = scripts;
  exports.watch = watch;
  exports.build = build;
  /*
   * Define default task that can be called by just running `gulp` from cli
   */
  exports.default = build