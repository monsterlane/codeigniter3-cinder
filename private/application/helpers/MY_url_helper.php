<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function get_remote_addr( ) {
	if ( isset( $_SERVER[ 'HTTP_X_FORWARDED_FOR' ] ) && $_SERVER[ 'HTTP_X_FORWARDED_FOR' ] ) {
		$ips = array_values( array_filter( explode( ',', $_SERVER[ 'HTTP_X_FORWARDED_FOR' ] ) ) );

		$ip = end( $ips );
	}
	else {
		$ip = $_SERVER[ 'REMOTE_ADDR' ];
	}

	return $ip;
}

?>
