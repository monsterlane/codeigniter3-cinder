<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function pluralize( $str, $count ) {
	if ( is_array( $count ) ) $count = count( $count );
	$count = (int)$count;

	return ( $count > 1 ) ? $count . ' ' . plural( $str ) : $count . ' ' . singular( $str );
}

?>
