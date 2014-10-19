<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Loader extends CI_Loader {
	public function __construct( ) {
		parent::__construct( );
	}

	public function page( $view, $data = array( ) ) {
		$body = parent::view( 'system/views/document.html', $data );
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

	public function partial( $view ) {
		$ci =& get_instance( );

		if ( strpos( $view, '/' ) === false ) {
			$view = VIEWPATH . $ci->router->fetch_directory( ) . 'views/' . $view;
		}

		if ( strpos( $view, '.' ) === false ) {
			$view .= '.html';
		}

		return $this->_ci_load( array( '_ci_path' => $view, '_ci_return' => true ) );
	}
}

?>