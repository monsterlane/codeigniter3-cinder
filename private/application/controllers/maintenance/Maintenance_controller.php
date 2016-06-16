<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Maintenance_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );

		if ( $this->config->item( 'maintenance' ) === false ) {
			$this->redirect( '/' );
		}
	}

	/* public methods */

	public function index( ) {
		$this->load->partial( array(
			'title' => 'Down for Maintenance',
			'view' => array(
				'show_nav' => false,
			),
		) );
	}
}

?>
