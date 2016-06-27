<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Maintenance_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );

		if ( $this->config->item( 'maintenance' ) === false ) {
			$this->redirect( str_replace( '_controller', '', $this->router->default_controller ) );
		}
	}

	/* public methods */

	public function index( ) {
		$this->session->sess_write_close( );

		$this->load->partial( array(
			'title' => 'Down for Maintenance',
			'view' => array(
				'show_nav' => false,
				'data' => array(
					'title' => 'We\'re performing system maintenance',
					'body' => 'We\'ll be back up shortly! Sorry for the inconvenience.',
				),
			),
		) );
	}
}

?>
