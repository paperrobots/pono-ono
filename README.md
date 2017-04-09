# pono ono

This is a [WordPress](https://wordpress.org/) theme built using [Timber](https://www.upstatement.com/timber/) and [bigwheel](https://github.com/bigwheel-framework) a minimalist frontend framework for managing application state created by [Jam3](http://jam3.com)

### Introduction

The project setup and gulp configuration is based on [wordpress-gulp-starter-kit](https://github.com/synapticism/wordpress-gulp-starter-kit) which is awesome and has solid docs. Definitely worth checking out before getting started working on this theme. Below is a list of customiztions I've made to the boilerplate.

- [x] Set up Timber
- [x] Add Browserify and Babelify to bundle scripts written in ES2015
- [x] Get rid of jshint and set up linter with standard js style
- [x] Get rid of unused boilerplate (livereload, rubySass, composer, bower)
- [x] Add some steps to the `gulp dist` task to replace script tag in base.twig to load minified javascript and delete the unminified version

## Getting Started

### 1) Install WordPress & MAMP

1. [Download](https://www.mamp.info/en/) and install MAMP
2. Open MAMP and click Preferences
3. Go to the Ports tab and make sure Apache is set to 8888. Go to the Web Server tab and make sure Apache is selected.
4. Also on the Web Server tab, set the 'Document Root' to the directory where you want to install WordPress.
5. Now click OK on the preferences dialogue and click Start Servers.
6. If your browser doesn't open automatically, click Open WebStart Page.
7. Click the link to phpMyAdmin (under the MySQL heading).
8. Now we can create a database for WordPress to use
9. On the left sidebar, click New.
10. The title of the database should be `pono_ono`.
11. Now that the database is created, you can go [download the latest version of WordPress](https://wordpress.org/) and copy _the contents_ of the `wordpress` folder into the MAMP Document Root you defined earlier.
12. Now navigate your browser to `localhost:8888` and you should see the WordPress installer.
13. Follow the wizard. Enter the site title as 'Pono Ono'. Then, when it asks for the name of your database, enter what you named it in step 10. Then it will ask for a username and password which should both just be `root`.
14. Voila! Your local installation of WordPress should be all set. You can login at localhost:8888/wp-admin.

### 2) Install Project Dependencies

- [npm](https://www.npmjs.com/)
- [yarn](https://www.yarnpkg.com/)
- [gulp](http://gulpjs.com/)

### 3) Project Setup
Open the command line and navigate to the directory where you'd like to store the theme.
```bash
# Clone the repo over SSH
$ git clone https://github.com/mikehwagz/pono-ono.git

# Move into the directory
$ cd pono-ono

# Install depencencies listed in package.json using yarn
$ yarn

# Build the theme for the first time
$ gulp build
```

#### Symlinking the theme build directory into your local WordPress Install

Assuming that you are already running a local installation of WordPress, we can create a [symlink](https://en.wikipedia.org/wiki/Symbolic_link) to the build directory generated by gulp in the theme directory. For example, my local installation of WordPress is located in `~/Documents/Sites/wordpress`, and I have the theme directory on my Desktop. Assuming these file locations, you can create a symlink by running the following command:

```bash
$ ln -s ~/Desktop/pono-ono/build ~/Documents/Sites/wordpress/wp-content/themes/pono-ono
```

Now if you navigate to the destination you defined for the symlink, you should see an alias into the built theme directory. If you mess up and want to start over, you can always just delete the alias as you would any directory.

#### Configure WordPress

Now that we have built the theme with `gulp build` and created a symlink into the `build` directory, we can install the Timber plugin and activate our theme:

1. Log in to the WordPress CMS via `localhost:3000/wp-admin`
2. Navigate to Plugins > Add New
3. Install [Timber from Upstatement](https://wordpress.org/plugins/timber-library/) as a plugin on WordPress via the CMS.
4. Go to Users > Your Profile and uncheck "Show WordPress toolbar" to hide it while viewing the site.
5. Go to Settings > Permalinks and set the structure to 'Post Name'.
6. Next create the following pages:
  - Home
  - Menu
  - About
  - Catering
  - Contact
7. Go to Appearance > Menus and create a menu titled 'Main Navigation' and add all of the pages we just created.
8. Finally, go to Settings > Reading and check the box at the top for a 'Static Front Page' and select 'Home' from the dropdown.
4. Now navigate to Appearance > Themes and activate the Pono Ono theme.

### 4) Development

With our dependencies installed and our theme directory linked to our WordPress installation, we are ready to start development.

First, we need to add an environment variable for the BASE directory of our site. It will usually just be `/` but in my case, I had to create this for my staging server which is `/pono-ono/`.

```sh
# create a new file in src/js called env.js
cat > src/js/env.js
# and whatever you type on the next line
# is inserted into the file.
# Hit ctrl+D to save those changes and then ctrl+C to exit the file.
export default 'YOUR_SERVER_BASE'
# in my case
export default '/'
# and for staging
export default 'pono-ono'
```

I've explained the available `gulp` commands in more detail below:

###`gulp`
- Does everything that `gulp build` does but also opens up a browser window at `localhost:3000`. Now changes to any files in `src` will be live-reloaded on save using BrowserSync.

###`gulp build`
- Transpiles and bundles together `js` using Browserify and Babelify to support ES2015 JavaScript syntax. Sticks both a minified and unminified bundle in `build/js`.
- Compiles all `scss` files imported to `src/scss/main.scss`, autoprefixes, minifies, renames to `style.css`, and sticks it in `build`.
- Copies all images, `php` files, and `twig` templates over to `build` as well.

###`gulp dist`
- This command is used to generate a distribution of the theme.
- Runs `gulp build` and then takes everything from the `build` directory and puts it in a `dist/pono-ono` directory.
- Next, all images are optimized automatically.
- Finally, the script tag in `base.twig` is updated to load the minified javascript file and then the unminified version is deleted.
- Now the `pono-ono` directory inside `dist` should be all set for deployment.

> :exclamation: Remember: All development will take place in the `src` directory. The `build` and `dist` folders can be regenerated using gulp at anytime.
