// ==== UTILITIES ==== //

var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')({ camelize: true }),
    del         = require('del'),
    config      = require('../../gulpconfig').utils;

// Totally wipe the contents of the `dist` folder to prepare for a clean build
gulp.task('utils-wipe', function() {
  return del(config.wipe);
});

// Clean out junk files after build
gulp.task('utils-clean', ['build', 'utils-wipe'], function() {
  return del(config.clean);
});

// Copy files from the `build` folder to `dist/[project]`
gulp.task('utils-copy', ['utils-clean'], function() {
  return gulp.src(config.dist.src)
  .pipe(gulp.dest(config.dist.dest));
});

// Now replace the script src in base.twig to load the minified bundle
// src and dest are the same because the file is processed in place
gulp.task('utils-replace', ['utils-copy'], function() {
  return gulp.src(config.replace.src)
    .pipe(plugins.htmlReplace({
      'js': config.replace.scriptSrc
    }))
    .pipe(gulp.dest(config.replace.dest));
})

// Finally, delete the unminified bundle in dist
gulp.task('utils-dist', ['utils-replace'], function() {
  return del(config.delete);
})
