<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Login_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );

		$this->set_option( 'enforce_ssl', true );
	}

	public function index( ) {
		$this->load->partial( array(
			'title' => 'Login',
			'view' => array(
				'data' => array(
					'body' => 'Please login',
				),
			),
		) );
	}

	public function authenticate( ) {
		$this->session->set_userdata( 'authenticated', true );
		$this->redirect( 'main' );
	}
}

?>
