const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const del = require('del');
const runSequence = require('run-sequence');


gulp.task('build', function(callback) {
  runSequence('clean:dist', ['sass', 'useref'], callback);
});


gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'], callback);
});


gulp.task('clean:dist', function() {
  return del.sync('dist');
});


gulp.task('useref', function() {
  return gulp.src('app/*html')
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});


/* gulp.task('watch', ['array', 'of', 'tasks',
 *        'to', 'complete','before', 'watch'], function (){
 *      ...
 *  })
 */
gulp.task('watch', ['browserSync', 'sass'], function() {
  // gulp.watch('files-to-watch', ['tasks', 'to', 'run']);
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/*/*.js', browserSync.reload);
  // Other watchers
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
  });
});
