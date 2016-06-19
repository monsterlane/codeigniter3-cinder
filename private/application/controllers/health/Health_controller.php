<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Health_controller extends MY_Controller {
	/* public methods */

	public function index( ) {
		$this->load->partial( array(
			'title' => 'Health',
			'view' => array(
				'data' => array(
					'title' => 'Health',
					'body' => 'Cinder is healthy.',
				),
			),
		) );
	}
}

?>
