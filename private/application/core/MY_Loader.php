<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Loader extends CI_Loader {
	/* internal methods */

	private function _compress( $arr ) {
		if ( !is_array( $arr ) ) $arr = array( );

		unset( $arr[ 'view' ] );

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
		$data =& $ci->get_data( );

		if ( array_key_exists( 'system', $data ) === true ) {
			$data[ 'pending' ][ 'system' ] = true;
			$data[ 'system' ][ 'options' ][ 'url' ] = $data[ 'pending' ][ 'url' ];

			$ci->load->view( $data[ 'system' ][ 'view' ], $data );
		}
		else {
			$data[ 'pending' ][ 'system' ] = false;

			$ci->output->json( $this->_compress( $data[ 'pending' ] ) );
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

		$post = clean_array( $ci->input->post( ) );
		$skip = false;

		if ( array_key_exists( 'view', $data ) === false ) {
			$view = $ci->router->directory . 'views/' . $ci->router->method . '.html';

			if ( file_exists( VIEWPATH . $view ) === true && is_file( VIEWPATH . $view ) == true ) {
				$data[ 'view' ] = $view;
			}
		}
		else if ( strpos( $data[ 'view' ], '/' ) === false ) {
			$view = $ci->router->directory . 'views/' . $data[ 'view' ];

			if ( strpos( $view, '.' ) === false ) {
				$view .= '.html';
			}

			if ( file_exists( VIEWPATH . $view ) === true && is_file( VIEWPATH . $view ) == true ) {
				$data[ 'view' ] = $view;
			}
			else {
				unset( $data[ 'view' ] );
			}
		}

		if ( array_key_exists( 'view', $data ) === true ) {
			$data[ 'hash' ] = md5( $view . filemtime( VIEWPATH . $view ) );

			if ( array_key_exists( 'views', $post ) === true && is_array( $post[ 'views' ] ) === true && empty( $post[ 'views' ] ) === false ) {
				if ( in_array( $data[ 'hash' ], $post[ 'views' ] ) ) {
					$skip = true;
				}
			}

			if ( $skip === false ) {
				$data[ 'html' ] = $this->_ci_load( array( '_ci_view' => $data[ 'view' ], '_ci_return' => true ) );
			}
		}

		$ci->set_view( $data );
	}
}

?>