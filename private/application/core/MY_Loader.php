<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Loader extends CI_Loader {
	public function __construct( ) {
		parent::__construct( );
	}

	public function page( ) {
		$ci =& get_instance( );
		$ci->load->library( 'parser' );

		$data = $ci->get_data( );

		$ci->parser->parse( $data[ 'views' ][ 0 ][ 'view' ], $data[ 'views' ][ 0 ][ 'data' ] );
	}

	public function view( $view, $vars = array( ), $return = false ) {
		$ci =& get_instance( );

		if ( strpos( $view, '/' ) === false ) {
			$view = VIEWPATH . $ci->router->fetch_directory( ) . 'views/' . $view;
		}

		if ( strpos( $view, '.' ) === false ) {
			$view .= '.html';
		}

		return $this->_ci_load( array( '_ci_view' => $view, '_ci_vars' => $this->_ci_object_to_array( $vars ), '_ci_return' => $return ) );
	}

	public function partial( $data = array( ) ) {
		$ci =& get_instance( );

		if ( strpos( $data[ 'view' ], '/' ) === false ) {
			$data[ 'view' ] = VIEWPATH . $ci->router->fetch_directory( ) . 'views/' . $data[ 'view' ];
		}

		if ( strpos( $data[ 'view' ], '.' ) === false ) {
			$data[ 'view' ] .= '.html';
		}

		$ci->add_view( $data );
	}
}

?>