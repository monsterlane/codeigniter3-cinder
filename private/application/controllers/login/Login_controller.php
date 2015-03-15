<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Login_controller extends MY_Controller {
	private $_after_login = 'main';

	public function __construct( ) {
		parent::__construct( );

		if ( $this->session->userdata( 'authenticated' ) === true ) {
			$this->redirect( $this->_after_login );
		}
		else {
			$this->set_option( 'require_ssl', true );
		}
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

		$url = $this->session->userdata( 'previous_page' );

		if ( $url === null ) {
			$url = $this->_after_login;
		}

		$this->redirect( $url );
	}
}

?>
