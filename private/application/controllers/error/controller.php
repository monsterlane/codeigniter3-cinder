<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Error_controller extends MY_Controller {
	public function index( ) {
		$this->load->library( 'error' );

		$data = $this->get_data( 'post' );

		$this->error->javascript( $data );
	}
}

?>
