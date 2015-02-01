<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Loader extends CI_Loader {

	/* internal methods */

	private function _compress( $arr ) {
		if ( !is_array( $arr ) ) $arr = array( );

		unset( $arr[ 'options' ] );
		unset( $arr[ 'data' ][ 'view' ][ 'js' ] );

		foreach ( $arr as $key => $val ) {
			if ( is_array( $val ) && empty( $val ) ) {
				unset( $arr[ $key ] );
			}
			else if ( is_string( $val ) && strlen( $val ) === 0 ) {
				unset( $arr[ $key ] );
			}
		}

		return $arr;
	}

	/* public methods */

	public function response( ) {
		$ci =& get_instance( );
		$data = $ci->get_data( );

		if ( $data[ 'post' ][ 'system' ] !== false ) {
			if ( is_string( $data[ 'pending' ][ 'data' ][ 'redirect' ] ) === true ) {
				redirect( $data[ 'pending' ][ 'data' ][ 'redirect' ] );
			}
			else {
				$ci->load->view( $data[ 'system' ][ 'data' ][ 'view' ][ 'path' ], $data );
			}
		}
		else {
			$ci->output->json( $this->_compress( $data[ 'pending' ][ 'data' ] ) );
		}
	}

	public function view( $view, $vars = array( ), $return = false ) {
		$ci =& get_instance( );

		if ( strpos( $view, '/' ) === false ) {
			$view = VIEWPATH . $ci->router->directory . 'views/' . $view;
		}

		if ( strpos( $view, '.' ) === false ) {
			$view .= '.html';
		}

		return $this->_ci_load( array( '_ci_view' => $view, '_ci_vars' => $this->_ci_object_to_array( $vars ), '_ci_return' => $return ) );
	}

	public function partial( $data = array( ) ) {
		$ci =& get_instance( );

		if ( array_key_exists( 'path', $data[ 'view' ] ) === false ) {
			$view = $ci->router->directory . 'views/' . $ci->router->method . '.html';

			if ( file_exists( VIEWPATH . $view ) === true && is_file( VIEWPATH . $view ) == true ) {
				$data[ 'view' ][ 'path' ] = $view;
			}
			else {
				$data[ 'view' ][ 'path' ] = false;
			}
		}
		else if ( strpos( $data[ 'view' ][ 'path' ], '/' ) === false ) {
			$view = $ci->router->directory . 'views/' . $data[ 'view' ][ 'path' ];

			if ( strpos( $view, '.' ) === false ) {
				$view .= '.html';
			}

			if ( file_exists( VIEWPATH . $view ) === true && is_file( VIEWPATH . $view ) == true ) {
				$data[ 'view' ][ 'path' ] = $view;
			}
			else {
				$data[ 'view' ][ 'path' ] = false;
			}
		}

		if ( $data[ 'view' ][ 'path' ] !== false ) {
			$data[ 'view' ][ 'hash' ] = md5( $view . filemtime( VIEWPATH . $view ) );
			$post = $ci->get_data( 'post' );
			$skip = false;

			if ( array_key_exists( 'views', $post ) === true && is_array( $post[ 'views' ] ) === true && empty( $post[ 'views' ] ) === false ) {
				if ( in_array( $data[ 'view' ][ 'hash' ], $post[ 'views' ] ) ) {
					$skip = true;
				}
			}

			if ( $skip === false ) {
				$data[ 'view' ][ 'html' ] = $this->_ci_load( array( '_ci_view' => $data[ 'view' ][ 'path' ], '_ci_return' => true ) );
			}
		}

		$ci->set_view( $data );
	}
}

?>