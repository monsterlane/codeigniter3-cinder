<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class About_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial(array(
			'view' => 'main',
		));
	}
}

?>
