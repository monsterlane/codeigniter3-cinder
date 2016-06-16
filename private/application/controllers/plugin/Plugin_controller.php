<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Plugin_controller extends MY_Controller {
	/* public methods */
	
	public function index( ) {
		$this->load->partial( array(
			'title' => 'jQuery Plugin',
			'view' => array(
				'js' => array(
					'module.js',
					'jquery.hotkeys.min.js',
				),
				'data' => array(
					'title' => 'jQuery plugin example',
					'body' => 'Adding a jQuery plugin using a RequireJS wrapper. Press shift+w together.'
				),
			),
		) );
	}
}

?>
