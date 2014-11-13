<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Loader extends CI_Loader {
	public function page( ) {
		$ci =& get_instance( );

		$post = clean_array( $ci->input->post( ) );
		$data = $ci->get_data( );

		if ( array_key_exists( 'system', $post ) == true && $post[ 'system' ] == false ) {
			$system = false;
		}
		else {
			$data[ 'system' ][ 'css' ] = array_merge( $data[ 'system' ][ 'css' ], $data[ 'pending' ][ 'css' ] );

			$system = true;
		}

		$data[ 'pending' ][ 'system' ] = $system;
		$data[ 'pending' ] = json_encode( $data[ 'pending'] );

		if ( $system == false ) {
			$ci->output->set_output( $data[ 'pending' ] );
		}
		else {
			$ci->load->view( $data[ 'system' ][ 'view' ], $data );
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
		$skip = ( array_key_exists( 'view', $post ) == true && $post[ 'view' ] === false ) ? true : false;

		if ( $skip == true ) {
			unset( $data[ 'view' ] );
		}
		else {
			if ( array_key_exists( 'view', $data ) == false ) {
				$view = $ci->router->directory . 'views/' . $ci->router->method . '.html';

				if ( file_exists( VIEWPATH . $view ) == true && is_file( VIEWPATH . $view ) == true ) {
					$data[ 'view' ] = $view;
				}
			}
			else if ( strpos( $data[ 'view' ], '/' ) === false ) {
				$data[ 'view' ] = $ci->router->directory . 'views/' . $data[ 'view' ];
			}

			if ( strpos( $data[ 'view' ], '.' ) === false ) {
				$data[ 'view' ] .= '.html';
			}

			$data[ 'html' ] = $this->_ci_load( array( '_ci_view' => $data[ 'view' ], '_ci_return' => true ) );
		}

		$ci->set_view( $data );
	}
}

?>