<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Main_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial(array(
			'title' => 'Main',
			'json' => array(
				'body' => 'Main Page',
			),
			'css' => array(
				'main/css/style.css',
			),
			'js' => array(
				'main/js/module.js',
			),
		));
	}
}

?>
