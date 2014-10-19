<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Loader extends CI_Loader {
	public function __construct( ) {
		parent::__construct( );
	}

	public function page( ) {
		$ci =& get_instance( );
		$ci->load->library( 'parser' );

		$ci->parser->parse( 'system/views/document.html', $ci->get_data( ) );
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

	public function partial( $view, $data = array( ), $container = 'body' ) {
		$ci =& get_instance( );

		if ( strpos( $view, '/' ) === false ) {
			$view = VIEWPATH . $ci->router->fetch_directory( ) . 'views/' . $view;
		}

		if ( strpos( $view, '.' ) === false ) {
			$view .= '.html';
		}

		$ci->add_view( $this->_ci_load( array( '_ci_path' => $view, '_ci_return' => true ) ), $data, $container );
	}
}

?>