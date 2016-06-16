<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Dot {
	private $_data = array( );

	public function __construct( $data = array( ) ) {
		if ( is_array( $data ) === true ) {
			$this->_data = $data;
		}
	}

	/* public methods */

	public function get( $key ) {
		$root = $this->_data;

		if ( $key != null ) {
			$keys = explode( '.', $key );

			foreach ( $keys as $key ) {
				if ( isset( $root[ $key ] ) == true ) {
					$root = $root[ $key ];
				}
				else {
					return null;
				}
			}
		}

		return $root;
	}

	public function set( $key, $data = array( ) ) {
		$keys = explode( '.', $key );
		$root = &$this->_data;

		while ( count( $keys ) > 1 ) {
			$key = array_shift( $keys );

			if ( isset( $root[ $key ] ) == false ) {
				$root[ $key ] = array( );
			}

			$root = &$root[ $key ];
		}

		$key = reset( $keys );

		if ( empty( $data ) == false && isset( $root[ $key ] ) == true && is_array( $root[ $key ] ) == true ) {
			if ( is_array( $data ) == true ) {
				foreach ( $data as $k => $v ) {
					if ( array_key_exists( $k, $root[ $key ] ) == true && is_array( $root[ $key ][ $k ] ) == true && is_array( $v ) == true ) {
						$root[ $key ][ $k ] = array_merge_recursive( $root[ $key ][ $k ], $v );
					}
					else {
						$root[ $key ][ $k ] = $v;
					}
				}
			}
			else {
				$root[ $key ][ ] = $data;
			}
		}
		else {
			$root[ $key ] = $data;
		}
	}
}

?>
