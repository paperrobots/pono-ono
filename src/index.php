<?php

// Get content from Timber
$context = Timber::get_context();

// Load posts for the current page with Timber
$context['posts'] = Timber::get_posts();

// Tell Timber what template to render
Timber::render( 'base.twig', $context );
