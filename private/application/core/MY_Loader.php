<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Loader extends CI_Loader {
	/* internal methods */

	private function _flashdata( ) {
		$ci =& get_instance( );

		$flash = $ci->session->flashdata( );
		$data = array( );

		foreach ( $flash as $key => $val ) {
			if ( isset( $_SESSION[ '__ci_vars' ][ $key ], $_SESSION[ $key ] ) === true && $_SESSION[ '__ci_vars' ][ $key ] === 'old' ) {
				$data[ $key ] = $_SESSION[ $key ];
			}
		}

		return $data;
	}

	private function _logindata( ) {
		$ci =& get_instance( );

		$ci->session->set_userdata( 'preauth', false );

		return array( );
	}

	private function _compress( $arr = array( ) ) {
		if ( is_array( $arr ) === false ) $arr = array( );

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

		if ( $ci->get_option( 'system' ) === true ) {
			if ( $this->is_loaded( 'session' ) !== false && isset( $_SESSION[ '__ci_vars' ] ) === true ) {
				$flash = $this->_flashdata( );

				if ( empty( $flash ) === false ) {
					$ci->set_data( 'module.data.flashdata', $flash );
				}
			}

			$data = $ci->get_data( );

			$redir = ( is_string( $data[ 'module' ][ 'data' ][ 'redirect' ] ) );

			if ( $data[ 'post' ][ 'system' ] !== false ) {
				if ( $redir === true ) {
					redirect( $data[ 'module' ][ 'data' ][ 'redirect' ] );
				}
				else {
					if ( $ci->session->userdata( 'authenticated' ) === true ) {
						$login = $this->_logindata( );

						if ( empty( $login ) === false ) {
							$data[ 'module' ][ 'data' ][ 'logindata' ] = $this->_logindata( );
						}
					}

					$ci->load->view( $data[ 'system' ][ 'data' ][ 'view' ][ 'path' ], $data );
				}
			}
			else {
				if ( $redir === false && $ci->session->userdata( 'preauth' ) === true && $ci->session->userdata( 'authenticated' ) === true ) {
					$login = $this->_logindata( );

					if ( empty( $login ) === false ) {
						$data[ 'module' ][ 'data' ][ 'logindata' ] = $this->_logindata( );
					}
				}

				$ci->output->json( $this->_compress( $data[ 'module' ][ 'data' ] ) );
			}
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

		if ( array_key_exists( 'view', $data ) === false || array_key_exists( 'path', $data[ 'view' ] ) === false ) {
			$view = $ci->router->directory . 'views/' . $ci->router->method;
		}
		else if ( strpos( $data[ 'view' ][ 'path' ], '/' ) === false ) {
			$view = $ci->router->directory . 'views/' . $data[ 'view' ][ 'path' ];
		}

		if ( strpos( $view, '.' ) === false ) {
			$view .= '.dust';
		}

		if ( file_exists( VIEWPATH . $view ) === true && is_file( VIEWPATH . $view ) == true ) {
			$data[ 'view' ][ 'path' ] = $view;
			$data[ 'view' ][ 'hash' ] = filemtime( VIEWPATH . $view );

			$post = $ci->get_data( 'post' );
			$skip = false;

			if ( array_key_exists( 'views', $post ) === true && is_array( $post[ 'views' ] ) === true && empty( $post[ 'views' ] ) === false ) {
				if ( in_array( $view . '|' . $data[ 'view' ][ 'hash' ], $post[ 'views' ] ) === true ) {
					$skip = true;
				}

				if ( $skip === false ) {
					foreach ( $post[ 'views' ] as $view ) {
						$parts = explode( '|', $view );

						if ( $parts[ 0 ] === $data[ 'view' ][ 'path' ] ) {
							$data[ 'view' ][ 'invalidate' ] = $parts[ 1 ];
							break;
						}
					}
				}
			}

			if ( ENVIRONMENT === 'production' || ENVIRONMENT === 'testing' ) {
				$data[ 'view' ][ 'module' ] = $this->router->directory . str_replace( '.dust', '', $view );
			}
			else if ( $skip === false ) {
				$data[ 'view' ][ 'html' ] = $this->_ci_load( array( '_ci_view' => $data[ 'view' ][ 'path' ], '_ci_return' => true ) );
			}
		}
		else {
			$data[ 'view' ][ 'path' ] = false;
		}

		$ci->set_view( $data );
	}
}

?>
