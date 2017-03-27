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

		remove_action( 'template_redirect', 'rest_output_link_header', 11, 0 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'rest_output_link_wp_head' );
		remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'rsd_link' );
		remove_action( 'wp_head', 'wp_generator' );

		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );

		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );

		add_action( 'wp_footer', array( $this, 'deregister_scripts' ) );

		add_action( 'wp_ajax_process_catering_request', array( $this, 'process_catering_request' ) );
		add_action( 'wp_ajax_nopriv_process_catering_request', array( $this, 'process_catering_request' ) );

		add_action( 'wp_ajax_process_message', array( $this, 'process_message' ) );
		add_action( 'wp_ajax_nopriv_process_message', array( $this, 'process_message' ) );

		add_action('admin_head', array( $this, 'custom_admin_style' ) );

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

		$post_labels = array(
			'name' 			    	 	 => 'Messages',
			'singular_name' 		 => 'Message',
			'add_new' 		    	 => 'Add New',
			'add_new_item'  		 => 'Add New Message',
			'edit'		        	 => 'Edit',
			'edit_item'	      	 => 'Edit Message',
			'new_item'	         => 'New Message',
			'view' 			         => 'View Message',
			'view_item' 		     => 'View Message',
			'search_term'   	   => 'Search Messages',
			'parent' 		    		 => 'Parent Message',
			'not_found' 				 => 'No Messages found',
			'not_found_in_trash' => 'No Messages in Trash'
		);
		register_post_type( 'message', array( 'labels' => $post_labels, 'public' => true ) );
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

	function deregister_scripts() {
		wp_deregister_script( 'wp-embed' );
	}

	/* Process Catering Request Submissions */
	function process_catering_request() {

		if ( ! empty( $_POST[ 'submission' ] ) ) {
			wp_send_json_error( 'Honeypot check failed' );
		}

		if ( ! check_ajax_referer( 'user-submitted-catering-request', 'security' ) ) {
			wp_send_json_error( 'Security check failed' );
		}

		$request_data = array(
			'post_title' => sprintf( '%s %s',
				sanitize_text_field( $_POST[ 'data' ][ 'fullName' ] ),
				sanitize_text_field( $_POST[ 'data' ][ 'eventDate' ] )
			),
			'post_status' => 'draft',
			'post_type' => 'catering_request'
		);

		$post_id = wp_insert_post( $request_data, true );

		if ( $post_id ) {
			update_post_meta( $post_id, 'full_name', sanitize_text_field( $_POST[ 'data' ][ 'fullName'] ) );
			update_post_meta( $post_id, 'event_date', sanitize_text_field( $_POST[ 'data' ][ 'eventDate' ] ) );
			update_post_meta( $post_id, 'pickup_time', sanitize_text_field( $_POST[ 'data' ][ 'pickupTime' ] ) );
			update_post_meta( $post_id, 'guest_count', sanitize_text_field( $_POST[ 'data' ][ 'guestCount'] ) );
			update_post_meta( $post_id, 'contact_email', sanitize_email( $_POST[ 'data' ][ 'email'] ) );
			update_post_meta( $post_id, 'dietary_restrictions', sanitize_text_field( $_POST[ 'data' ][ 'dietaryRestrictions'] ) );
			update_post_meta( $post_id, 'special_requests', sanitize_text_field( $_POST[ 'data' ][ 'specialRequests'] ) );
		}

		wp_send_json_success( $post_id );
	}

	/* Process Contact Form Submissions */
	function process_message() {

		if ( ! empty( $_POST[ 'submission' ] ) ) {
			wp_send_json_error( 'Honeypot check failed' );
		}

		if ( ! check_ajax_referer( 'user-submitted-message', 'security' ) ) {
			wp_send_json_error( 'Security check failed' );
		}

		$request_data = array(
			'post_title' => sanitize_text_field( $_POST[ 'data' ][ 'subject' ] ),
			'post_content' => sanitize_text_field( $_POST[ 'data' ][ 'message' ] ),
			'post_status' => 'draft',
			'post_type' => 'message'
		);

		$post_id = wp_insert_post( $request_data, true );

		if ( $post_id ) {
			update_post_meta( $post_id, 'contact_name', sanitize_text_field( $_POST[ 'data' ][ 'fullName'] ) );
			update_post_meta( $post_id, 'contact_email', sanitize_email( $_POST[ 'data' ][ 'email' ] ) );
		}

		wp_send_json_success( $post_id );
	}

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
}
new PonoOno();

// Change Howdy message to Welcome
function change_howdy($translated, $text, $domain) {

  if (!is_admin() || 'default' != $domain)
    return $translated;

  if (false !== strpos($translated, 'Howdy'))
    return str_replace('Howdy', 'Welcome', $translated);

  return $translated;
}
add_filter('gettext', 'change_howdy', 10, 3);

// Disable Page Title fields for non-admin users
function admin_footer_hook() {

	if ( !current_user_can( 'manage_options' ) ) {
		echo
		'<script type="text/javascript">
	    if (jQuery("#post_type").val() === "page") {
				jQuery("#title").prop("disabled", true);
			}
	  </script>';
	}
}
add_action( 'admin_footer-post.php', 'admin_footer_hook' );
