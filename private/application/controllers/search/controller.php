<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Search_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial(array(
			'title' => 'Search',
			'css' => array(
				'style.css',
			),
			'js' => array(
				'module.js',
			),
		));
	}

	public function users( ) {
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

		$this->load->partial(array(
			'container' => '#cinderSearchResults',
			'module' => false,
			'view' => 'users.html',
			'json' => $results,
			'callback' => 'bindSearchResults',
		));
	}
}

?>
