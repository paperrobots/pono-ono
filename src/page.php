<?php

$context = Timber::get_context();

$post = new TimberPost();
$context['post'] = $post;

Timber::render( $post->post_name . '.twig', $context );
