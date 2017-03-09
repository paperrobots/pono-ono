// ==== STYLES ==== //

var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    plugins       = require('gulp-load-plugins')({ camelize: true }),
    config        = require('../../gulpconfig').styles;

// Build stylesheets from source Sass files, post-process, and write source maps (for debugging)
gulp.task('styles', function() {
  return gulp.src(config.build.src)
    .pipe(plugins.sourcemaps.init()) // Note that sourcemaps need to be initialized with libsass
    .pipe(plugins.sass(config.sass).on('error', plugins.sass.logError)) // Log errors instead of killing the process
    .pipe(plugins.cssnano(config.cssnano)) // Post-process CSS (minify, autoprefix, etc.)
    .pipe(plugins.rename('style.css')) // Rename compiled main.css to style.css so WordPress recognizes theme
    .pipe(plugins.sourcemaps.write('./')) // Write an external sourcemap
    .pipe(gulp.dest(config.build.dest)); // Render the final CSS file(s) into the `build` folder
});
