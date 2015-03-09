<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Plugin_controller extends MY_Controller {
	public function index( ) {
		$this->load->partial( array(
			'title' => 'jQuery Plugin',
			'view' => array(
				'js' => array(
					'module.js',
					'jquery.hotkeys.min.js',
				),
				'data' => array(
					'body' => 'Adding a jQuery plugin using a RequireJS wrapper. Press shift+w together.'
				),
			),
		) );
	}
}

?>
