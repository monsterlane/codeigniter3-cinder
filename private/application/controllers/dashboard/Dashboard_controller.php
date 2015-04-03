<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Dashboard_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial( array(
			'title' => 'Dashboard',
			'view' => array(
				'data' => array(
					'title' => 'Dashboard',
					'body' => 'Welcome to Cinder.',
				),
			),
		) );
	}
}

?>
