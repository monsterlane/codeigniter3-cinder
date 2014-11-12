<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class About_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial(array(
			'title' => 'About',
			'json' => array(
				'body' => 'About CI3-Cinder',
			),
			'css' => array(
				'about/css/style.css',
			),
			'js' => array(
				'about/js/module.js',
			),
		));
	}
}

?>
