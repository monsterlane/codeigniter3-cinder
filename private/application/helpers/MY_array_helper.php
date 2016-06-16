<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function trim_array( $arr ) {
	foreach ( $arr as $k => $v ) {
		if ( is_scalar( $v ) ) {
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
	$result = array( );
	$trim = true;

	if ( count( $args ) > 0 ) {
		if ( is_bool( $args[ 0 ] ) == true ) {
			$trim = $args[ 0 ];

			array_shift( $args );
		}
	}

	foreach ( $args as $arr ) {
		if ( is_array( $arr ) && $trim == true ) {
			$arr = trim_array( $arr );
		}
		else if ( is_array( $arr ) == false ) {
			$arr = array( );
		}

		$result = array_merge( $result, $arr );
	}

	return $result;
}

function clean_array( $arr ) {
	if ( !is_array( $arr ) ) $arr = array( );

	foreach ( $arr as &$param ) {
		if ( $param == 'null' || $param == '' ) $param = null;
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
