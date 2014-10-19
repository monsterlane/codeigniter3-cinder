<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Main_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );
	}

	public function index( ) {
		$data = array(
			'view' => $this->load->partial( 'body' ),
		);

		$this->load->page( $data );
	}
}

?>
