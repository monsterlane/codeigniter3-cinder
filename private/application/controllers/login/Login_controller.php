<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Login_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );

		if ( $this->session->userdata( 'authenticated' ) === true ) {
			$this->redirect( substr( $this->router->default_controller, 0, strpos( $this->router->default_controller, '_' ) ) );
		}
		else {
			$this->set_option( 'require_https', true );
		}
	}

	/* public methods */

	public function index( ) {
		$this->load->partial( array(
			'title' => 'Login',
			'view' => array(
				'show_nav' => false,
				'data' => array(
					'title' => 'Sign into Cinder',
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
				$url = substr( $this->router->default_controller, 0, strpos( $this->router->default_controller, '_' ) );
			}

			$this->redirect( $url );
		}
	}
}

?>
