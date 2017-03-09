<?php

$context = Timber::get_context();

$post = new TimberPost();
$context['post'] = $post;

Timber::render( array( 'templates/' . $post->post_name . '/' . $post->post_name . '.twig' ), $context );
