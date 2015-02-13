<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function logger( ) {
	$ci =& get_instance( );
	$ci->log->database( true );
}

?>