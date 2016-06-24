<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Error_controller extends MY_Controller {
	public function _remap( $method, $params = array( ) ) {
		if ( method_exists( $this, $method ) ) {
			return call_user_func_array( array( $this, $method ), $params );
		}
		else {
			array_unshift( $params, $method );
			return call_user_func_array( array( $this, 'index' ), $params );
		}
	}

	/* public methods */

	public function index( ) {
		$this->session->sess_write_close( );

		$this->load->library( 'user_agent' );

		$data = array(
			'error_type_id' => 3,
			'message' => current_url( ),
		);

		$this->log->write_db( $data );

		$this->load->partial( array(
			'title' => '404 Not Found',
			'view' => array(
				'show_nav' => false,
				'path' => 'index.html',
				'data' => array(
					'title' => 'Well, that\'s embarrassing.',
					'body' => 'We couldn\'t find a page at ' . current_url( ) . '.<br/>If you typed in the address, check your spelling.',
					'previous_page' => $this->agent->referrer( ),
				),
			),
		) );
	}

	public function javascript( ) {
		$this->session->sess_write_close( );
		
		$data = $this->get_data( 'post' );
		$data = extract_array( $data, array( 'message', 'filename', 'line' ) );
		$data[ 'error_type_id' ] = 4;

		$this->log->write_db( $data );
	}
}

?>
