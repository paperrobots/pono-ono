// ==== CONFIGURATION ==== //

// Project paths
var project     = 'pono-ono',             // The directory name for your theme; change this at the very least!
    src         = './src/',               // The raw material of your theme: custom scripts, SCSS source files, PHP files, images, etc.; do not delete this folder!
    build       = './build/',             // A temporary directory containing a development version of your theme; delete it anytime
    dist        = './dist/'+project+'/',  // The distribution package that you'll be uploading to your server; delete it anytime
    assets      = './assets/',            // A staging area for assets that require processing before landing in the source folder (example: icons before being added to a sprite sheet)
    modules     = './node_modules/';      // npm packages

// Project settings
module.exports = {

  browsersync: {
    files: [build+'/**', '!'+build+'/**.map'], // Exclude map files
    notify: false, // In-line notifications (the blocks of text saying whether you are connected to the BrowserSync server or not)
    open: true, // Set to false if you don't like the browser window opening automatically
    port: 3000, // Port number for the live version of the site; default: 3000
    proxy: 'dev.ponoonopoke.com', // We need to use a proxy instead of the built-in server because WordPress has to do some server-side rendering for the theme to work
    watchOptions: {
      debounceDelay: 2000 // This introduces a small delay when watching for file change events to avoid triggering too many reloads
    }
  },

  images: {
    build: { // Copies images from `src` to `build`; does not optimize
      src: src+'**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg|*.eot|*.ttf|*.woff|*.json)',
      dest: build
    },
    dist: {
      src: [dist+'**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)', '!'+dist+'screenshot.png'], // The source is actually `dist` since we are minifying images in place
      imagemin: {
        optimizationLevel: 7,
        progressive: true,
        interlaced: true
      },
      dest: dist
    }
  },

  scripts: {
    lint: {
      src: src+'js/**/*.js'
    },
    build: {
      src: 'bundle',
      dest: build+'js'
    },
    browserify: {
      entries: [src+'js/main.js'],
      debug: true
    }
  },

  styles: {
    build: {
      src: src+'scss/main.scss',
      dest: build
    },
    cssnano: {
      autoprefixer: {
        add: true,
        browsers: ['> 3%', 'last 2 versions', 'ie 9', 'ios 6', 'android 4'] // Autoprefix styles
      }
    },
    sass: {
      includePaths: [ // Adds npm directories to the load path so you can @import directly
        src+'scss',
        modules+'normalize.css',
        require('bourbon').includePaths[0],
        modules
      ],
      precision: 6,
      onError: function(err) {
        return console.log(err);
      }
    }
  },

  theme: {
    php: {
      src: src+'**/*.php', // Copy all PHP files over to build or dist
      dest: build
    },
    twig: {
      src: src+'templates/**/*.twig', // Copy all Twig files over for build or dist
      dest: build+'templates/'
    }
  },

  utils: {
    clean: [build+'**/.DS_Store'], // A glob pattern matching junk files to clean out of `build`; feel free to add to this array
    wipe: [dist], // Clean this out before creating a new distribution copy
    dist: {
      src: [build+'**/*', '!'+build+'**/*.map'],
      dest: dist
    },
    replace: { // replace bundle.js script tag to bundle.min.js
      src: dist+'templates/layouts/base.twig', // Location of twig file with script tag
      scriptSrc: '{{site.theme.link}}/javascript/bundle.min.js', // New value of script src attribute including minified bundle
      dest: dist+'templates/layouts' // Same location as src so it replaces the original
    },
    delete: dist+'javascript/bundle.js' // Delete the unminified bundle
  },

  watch: { // What to watch before triggering each specified task; if files matching the patterns below change it will trigger BrowserSync
    src: {
      styles:       src+'scss/**/*.scss',
      scripts:      src+'js/**/*.js',
      images:       src+'**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)',
      theme:        src+'**/*(*.php|*.twig)'
    }
  }
}
