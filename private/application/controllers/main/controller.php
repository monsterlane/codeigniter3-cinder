<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Main_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial( array(
			'title' => 'Main',
			'view' => array(
				'css' => array(
					'style.css',
				),
				'data' => array(
					'body' => 'Main Page',
				),
			)
		) );
	}
}

?>
