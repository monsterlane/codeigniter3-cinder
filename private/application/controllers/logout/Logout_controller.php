<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Logout_controller extends MY_Controller {
	/* public methods */

	public function index( ) {
		$this->session->sess_destroy( );

		$this->redirect( 'login' );
	}
}

?>
