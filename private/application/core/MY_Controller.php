<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

require_once( APPPATH . 'third_party/minify/min/lib/JSMin.php' );
require_once( APPPATH . 'third_party/minify/min/lib/CSSmin.php' );

class MY_Controller extends CI_Controller {
	protected $data;

	public function _construct( ) {
		$this->data = array(
			'assets' => array(
				'css' => array( ),
				'js' => array( ),
			),
			'views' => array( ),
		);
	}

	public function get_data( ) {
		return $this->data;
	}

	public function add_view( $view, $data, $container = 'body' ) {
		$this->data[ 'views' ][ ] = array(
			'container' => $container,
			'view' => $view,
			'data' => $data,
		);
	}
}

?>