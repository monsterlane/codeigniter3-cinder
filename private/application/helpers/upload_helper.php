<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function get_upload_max_filesize( ) {
	$value = ini_get( 'upload_max_filesize' );

	if ( is_numeric( $value ) ) {
		return $value;
	}
	else {
		$len = strlen( $value );
		$qty = substr( $value, 0, $len - 1 );
		$unit = strtolower( substr( $value, $len - 1 ) );

		if ( $unit == 'k' ) {
			$qty *= 1024;
		}
		else if ( $unit == 'm' ) {
			$qty *= 1048576;
		}
		else if ( $unit == 'g' ) {
			$qty *= 1073741824;
		}

		return $qty;
	}
}

?>