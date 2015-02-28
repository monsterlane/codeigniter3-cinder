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

	public function index( $number = '403' ) {
		if ( $number === '403' ) {
			$number = '403 Forbidden';
			$type_id = 3;
		}
		else {
			$number = '404 Not Found';
			$type_id = 3;
		}

		$data = array(
			'error_type_id' => $type_id,
			'message' => current_url( ),
		);

		$this->log->write_db( $data );

		$this->load->partial( array(
			'title' => $number,
			'view' => array(
				'path' => 'index.html',
				'css' => array(
					'style.css',
				),
				'data' => array(
					'body' => $number . ': ' . current_url( ),
				),
			)
		) );
	}

	public function javascript( ) {
		$data = $this->get_data( 'post' );
		$data = extract_array( $data, array( 'message', 'filename', 'line' ) );
		$data[ 'error_type_id' ] = 4;

		$this->log->write_db( $data );
	}
}

?>
