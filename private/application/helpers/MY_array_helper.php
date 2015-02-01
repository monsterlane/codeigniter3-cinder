<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function trim_array( $arr ) {
	foreach ( $arr as $k => $v ) {
		if ( is_string( $v ) && strlen( $v ) > 0 ) {
			$arr[ $k ] = trim( $v );
		}
		else if ( is_array( $v ) ) {
			$arr[ $k ] = trim_array( $v );
		}
		else {
			$arr[ $k ] = $v;
		}
	}

	return $arr;
}

function merge_array( ) {
	$args = func_get_args( );
	$result = $args[ 0 ];

	foreach ( $args as $arg ) {
		foreach ( $arg as $k => $v ) {
			if ( is_array( $v ) === true && isset( $result[ $k ] ) === true && is_array( $result[ $k ] ) === true ) {
				$result[ $k ] = merge_array( $result[ $k ], $v );
			}
			else {
				$result[ $k ] = $v;
			}
		}
	}

	return $result;
}

function clean_array( $arr ) {
	if ( !is_array( $arr ) ) $arr = array( );

	foreach ( $arr as &$param ) {
		if ( $param == 'null' || $param == '' ) {
			$param = null;
		}
		else if ( $param == 'true' ) {
			$param = true;
		}
		else if ( $param == 'false' ) {
			$param = false;
		}
	}
	unset( $param );

	return $arr;
}

function extract_array( $arr, $keys ) {
	if ( !is_array( $arr ) ) $arr = array( );
	$result = array( );

	foreach ( $arr as $key => $val ) {
		if ( in_array( $key, $keys ) ) {
			$result[ $key ] = $val;
		}
	}

	return $result;
}

function delegate_array( $arr, $key ) {
	$results = array( );

	foreach ( $arr as $data ) {
		$results[ $data[ $key ] ] = $data;
	}

	return $results;
}

function array_changes( $old, $new ) {
	$result = array(
		'add' => array_diff( $new, $old ),
		'delete' => array_diff( $old, $new ),
	);

	return $result;
}

?>
