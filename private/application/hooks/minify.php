<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function minify( ) {
	$ci =& get_instance( );

	$output = $ci->output->get_output( );
	$output = $ci->output->minify( $output );

	$ci->output->set_output( $output );
	$ci->output->_display( );
}

?>