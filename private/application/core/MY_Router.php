<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Router extends CI_Router {
	private $_suffix = '_controller';

	public function __construct( ) {
		parent::__construct( );
	}

	protected function _set_default_controller( ) {
		if ( empty( $this->default_controller ) ) {
			show_error( 'Unable to determine what should be displayed. A default route has not been specified in the routing file.' );
		}

		// Is the method being specified?
		if ( sscanf( $this->default_controller, '%[^/]/%s', $class, $method ) !== 2 ) {
			$method = 'index';
		}

		if ( !file_exists( APPPATH . 'controllers/' . $class . '/controller.php' ) ) {
			// This will trigger 404 later
			return;
		}

		$this->set_directory( $class );
		$this->set_class( 'controller' );
		$this->set_method( $method );

		// Assign routed segments, index starting from 1
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

			if ( !file_exists( APPPATH . 'controllers/' . $test . '/controller.php' ) && is_dir( APPPATH . 'controllers/' . $this->directory . $segments[ 0 ] ) ) {
				$this->set_directory( array_shift( $segments ), TRUE );
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
		$this->set_class( 'controller' );

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
}

?>