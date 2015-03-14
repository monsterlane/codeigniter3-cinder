<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Router extends CI_Router {
	public $login_controller;

	protected function _set_routing( ) {
		parent::_set_routing( );

		$this->login_controller = $this->routes[ 'login_controller' ];
	}

	protected function _set_default_controller( ) {
		if ( empty( $this->default_controller ) ) {
			show_error( 'Unable to determine what should be displayed. A default route has not been specified in the routing file.' );
		}

		if ( sscanf( $this->default_controller, '%[^/]/%s', $class, $method ) !== 2 ) {
			$method = 'index';
		}

		$this->set_directory( substr( $class, 0, strpos( $class, '_' ) ) );

		if ( !file_exists( APPPATH . 'controllers/' . $this->directory . ucfirst( $class ) . '.php' ) ) {
			return;
		}

		$this->set_class( $class );
		$this->set_method( $method );

		$this->uri->rsegments = array(
			1 => $class,
			2 => $method
		);

		log_message( 'debug', 'No URI present. Default controller set.' );
	}

	protected function _validate_request( $segments ) {
		$c = count( $segments );

		while ($c-- > 0) {
			$test = $this->directory . ucfirst( $this->translate_uri_dashes === TRUE ? str_replace( '-', '_', $segments[ 0 ] ) : $segments[ 0 ] );

			if ( !file_exists( APPPATH . 'controllers/' . $this->directory . $test . '_controller.php' ) && is_dir( APPPATH . 'controllers/' . $this->directory . $segments[ 0 ] ) ) {
				$this->set_directory( $segments[ 0 ], TRUE );
				continue;
			}

			return $segments;
		}

		return $segments;
	}

	protected function _set_request( $segments = array( ) ) {
		$segments = $this->_validate_request( $segments );

		if ( empty( $segments ) ) {
			$this->_set_default_controller( );
			return;
		}

		if ( $this->translate_uri_dashes === TRUE ) {
			$segments[ 0 ] = str_replace( '-', '_', $segments[ 0 ] );

			if ( isset( $segments[ 1 ] ) ) {
				$segments[ 1 ] = str_replace( '-', '_', $segments[ 1 ] );
			}
		}

		$this->set_directory( $segments[ 0 ] );
		$this->set_class( $segments[ 0 ] . '_controller' );

		if ( isset( $segments[ 1 ] ) ) {
			$this->set_method( $segments[ 1 ] );
		}
		else {
			$segments[ 1 ] = 'index';
		}

		array_unshift( $segments, NULL );
		unset( $segments[ 0 ] );

		$this->uri->rsegments = $segments;
	}

	public function set_class( $class ) {
		parent::set_class( $class );

		if ( file_exists( APPPATH . 'controllers/' . $this->directory . $this->class . '.php' ) === false || is_file( APPPATH . 'controllers/' . $this->directory . $this->class . '.php' ) === false ) {
			$this->set_directory( 'error' );
			$this->set_class( 'error_controller' );
			$this->set_method( 'index' );
		}
	}

	public function set_method( $method ) {
		parent::set_method( $method );

		if ( file_exists( APPPATH . 'controllers/' . $this->directory . $this->class . '.php' ) === true || is_file( APPPATH . 'controllers/' . $this->directory . $this->class . '.php' ) === true ) {
			if ( class_exists( 'Controller' ) === false ) {
				require_once( BASEPATH . 'core/Controller.php' );
			}

			if ( class_exists( 'MY_Controller' ) === false ) {
				require_once( APPPATH . 'core/MY_Controller.php' );
			}

			if ( class_exists( ucfirst( $this->class ) ) === false ) {
				require_once( APPPATH . 'controllers/' . $this->directory . ucfirst( $this->class ) . '.php' );
			}

			if ( class_exists( ucfirst( $this->class ) ) === true ) {
				$methods = array_map( 'strtolower', get_class_methods( ucfirst( $this->class ) ) );

				if ( in_array( strtolower( $this->method ), $methods ) === false ) {
					$this->set_directory( 'error' );
					$this->set_class( 'error_controller' );
					$this->set_method( 'index' );
				}
			}
		}
	}
}

?>