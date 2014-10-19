<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function get_dir_size( $path, $unit = 'm' ) {
    $path = trim( $path );

	if ( !is_dir( $path ) ) {
		return false;
	}
	else if ( !function_exists( 'exec' ) ) {
		trigger_error( 'The function exec() is not available.', E_USER_WARNING );
		return false;
	}

	$output = exec( 'du -sk ' . $path );
	$filesize = trim( str_replace( $path, '', $output ) ) * 1024;

	switch ( $unit ) {
		case 'g': $filesize = number_format( $filesize / 1073741824, 2 ); break;  // giga
		case 'm': $filesize = number_format( $filesize / 1048576, 2 );    break;  // mega
		case 'k': $filesize = number_format( $filesize / 1024, 2 );       break;  // kilo
		case 'b': $filesize = number_format( $filesize, 0 );              break;  // byte
	}

	return ( $filesize + 0 );
}

?>