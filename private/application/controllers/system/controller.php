<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class System_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );
	}

	public function index( ) {
		$this->load->view( 'document' );
	}
}

?>
