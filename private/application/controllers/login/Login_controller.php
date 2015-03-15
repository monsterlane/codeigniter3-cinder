<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Login_controller extends MY_Controller {
	private $_after_auth = 'main';

	public function __construct( ) {
		parent::__construct( );

		if ( $this->session->userdata( 'authenticated' ) === true ) {
			$this->redirect( $this->_after_auth );
		}
		else {
			$this->set_option( 'require_https', true );
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
		$this->load->library( 'form_validation' );

		$this->form_validation->set_rules( 'username', 'Username', 'trim|required' );
		$this->form_validation->set_rules( 'password', 'Password', 'trim|required' );

		if ( $this->form_validation->run( ) === false ) {
			$data = array(
				'status' => false,
				'validation' => validation_errors( ),
			);

			$this->set_data( 'module.data', $data );
		}
		else {
			$this->session->set_userdata( 'authenticated', true );

			$url = $this->session->userdata( 'previous_page' );

			if ( $url === null ) {
				$url = $this->_after_auth;
			}

			$this->redirect( $url );
		}
	}
}

?>
