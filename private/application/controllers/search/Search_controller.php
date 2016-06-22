<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Search_controller extends MY_Controller {
	/* public methods */

	public function index( ) {
		$this->load->partial( array(
			'title' => 'Search',
			'view' => array(
				'data' => array(
					'title' => 'Search form example',
					'body' => 'Please enter a search term.',
				),
			),
		) );
	}

	public function users( ) {
		$this->load->library( 'form_validation' );

		$this->form_validation->set_rules( 'keywords', 'Keywords', 'trim|required' );

		if ( $this->form_validation->run( ) === false ) {
			$data = array(
				'status' => false,
				'validation' => validation_errors( ),
			);

			$this->set_data( 'module.data', $data );
		}
		else {
			$results = array(
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
				'name' => false,
				'view' => array(
					'path' => 'users.html',
					'container' => '#searchResults',
					'data' => array(
						'users' => $results,
					),
				),
				'callback' => 'bindSearchResults',
			) );
		}
	}

	public function user( $action = null ) {
		if ( $action == 'delete' ) {
			$data = array(
				'status' => (bool)rand( 0, 1 ),
				'message' => 'Error deleting record. ' . $this->config->item( 'support_message' ),
			);

			$this->set_data( 'module.data', $data );
		}
	}
}

?>
