// ==== THEME ==== //

var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')({ camelize: true }),
    config      = require('../../gulpconfig').theme;

// Copy PHP source files to the `build` folder
gulp.task('theme-php', function() {
  return gulp.src(config.php.src)
  .pipe(plugins.changed(config.php.dest))
  .pipe(gulp.dest(config.php.dest));
});

// Copy PHP source files to the `build` folder
gulp.task('theme-twig', function() {
  return gulp.src(config.twig.src)
  .pipe(plugins.changed(config.twig.dest))
  .pipe(gulp.dest(config.twig.dest));
});

// All the theme tasks in one
gulp.task('theme', ['theme-php', 'theme-twig']);
