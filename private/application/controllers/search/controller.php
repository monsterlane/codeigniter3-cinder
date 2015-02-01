<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Search_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial( array(
			'title' => 'Search',
			'module' => 'module.js',
			'view' => array(
				'css' => array(
					'style.css',
				),
			),
		) );
	}

	public function users( ) {
		$data = array(
			array(
				'id' => 1,
				'first_name' => 'Mr.',
				'last_name' => 'Black',
			),
			array(
				'id' => 2,
				'first_name' => 'John',
				'last_name' => 'Doe',
			),
			array(
				'id' => 3,
				'first_name' => 'Frank',
				'last_name' => 'Jr.',
			),
		);

		$this->load->partial( array(
			'module' => false,
			'view' => array(
				'path' => 'users.html',
				'container' => '#cinderSearchResults',
				'data' => $data,
			),
			'callback' => 'bindSearchResults',
		) );
	}

	public function user( $action = null ) {
		if ( $action == 'delete' ) {
			$data = array(
				'status' => (bool)rand( 0, 1 ),
				'message' => 'Error deleting record. ' . $this->config->item( 'support_message' ),
			);

			$this->set_data( 'pending.data', $data );
		}
	}
}

?>
