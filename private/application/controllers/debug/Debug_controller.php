<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Debug_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial( array(
			'title' => 'Debug',
			'view' => array(
				'data' => array(
					'title' => 'Debug tools',
					'body' => 'Cinder debug tools.',
				),
			),
		) );
	}
}

?>
