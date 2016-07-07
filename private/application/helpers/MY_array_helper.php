<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function trim_array( $arr ) {
	foreach ( $arr as $k => $v ) {
		if ( is_string( $v ) === true && strlen( $v ) > 0 ) {
			$arr[ $k ] = trim( $v );
		}
		else if ( is_array( $v ) === true ) {
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

	if ( empty( $args ) === false) {
		if ( is_bool( $args[ 0 ] ) == true ) {
			$trim = $args[ 0 ];

			array_shift( $args );
		}
	}

	if ( empty( $args ) === false ) {
		$result = $args[ 0 ];
	}

	foreach ( $args as $arg ) {
		foreach ( $arg as $k => $v ) {
			if ( is_array( $v ) === true && isset( $result[ $k ] ) === true && is_array( $result[ $k ] ) === true ) {
				$result[ $k ] = merge_array( $result[ $k ], $v );

				if ( $trim === true ) {
					$result[ $k ] = trim_array( $result[ $k ] );
				}
			}
			else if ( is_array( $v ) === true && $trim === true ) {
				$result[ $k ] = trim_array( $v );
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
		if ( $param === 'null' || $param === '' ) {
			$param = null;
		}
		else if ( $param === 'true' ) {
			$param = true;
		}
		else if ( $param === 'false' ) {
			$param = false;
		}
	}
	unset( $param );

	return $arr;
}

function extract_array( $arr, $keys ) {
	if ( is_array( $arr ) === false ) $arr = array( );
	$result = array( );

	foreach ( $arr as $key => $val ) {
		if ( in_array( $key, $keys ) === true ) {
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

function diff_array( $old, $new ) {
	$result = array(
		'add' => array_diff( $new, $old ),
		'delete' => array_diff( $old, $new ),
	);

	return $result;
}

?>
