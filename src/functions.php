<?php

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
		echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php') ) . '</a></p></div>';
	});
	add_filter('template_include', function($template) {
		return get_stylesheet_directory() . '/static/no-timber.html';
	});
	return;
}

Timber::$dirname = array('templates', 'templates/components', 'templates/sections');

class PonoOno extends TimberSite {

	function __construct() {

		show_admin_bar(false);

		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );

		parent::__construct();
	}

	function register_post_types() {
		$post_labels = array(
			'name' 			    	 	 => 'Catering Requests',
			'singular_name' 		 => 'Catering Request',
			'add_new' 		    	 => 'Add New',
			'add_new_item'  		 => 'Add New Request',
			'edit'		        	 => 'Edit',
			'edit_item'	      	 => 'Edit Request',
			'new_item'	         => 'New Request',
			'view' 			         => 'View Request',
			'view_item' 		     => 'View Request',
			'search_term'   	   => 'Search Requests',
			'parent' 		    		 => 'Parent Catering Request',
			'not_found' 				 => 'No Catering Requests found',
			'not_found_in_trash' => 'No Catering Requests in Trash'
		);
		register_post_type( 'catering_request', array( 'labels' => $post_labels, 'public' => true ) );
	}

	function register_taxonomies() {
		//this is where you can register custom taxonomies
	}

	function add_to_context( $context ) {

		$context['menu'] = new TimberMenu();
		$context['site'] = $this;

		$context['isAJAX'] = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');

		return $context;
	}

	function add_to_twig( $twig ) {
		/* this is where you can add your own functions to twig */
		$twig->addExtension( new Twig_Extension_StringLoader() );
		return $twig;
	}
}
new PonoOno();



/* WP Admin Customizations */

// Increase width of wp admin menu to fit custom post type labels
function custom_admin_style() {
	echo '<style>
	#adminmenu,
	#adminmenu .wp-submenu,
	#adminmenuback,
	#adminmenuwrap {
		width: 200px;
	}
	#wpcontent, #wpfooter {
    margin-left: 200px;
	}
	#adminmenu .wp-submenu {
		left: 200px;
	}
	</style>';
}
add_action('admin_head', 'custom_admin_style');

// Change Howdy message to Welcome
function howdy_message($translated_text, $text, $domain) {
    $new_message = str_replace('Howdy', 'Welcome', $text);
    return $new_message;
}
add_filter('gettext', 'howdy_message', 10, 3);
