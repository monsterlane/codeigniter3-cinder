<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Main_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );
	}

	public function index( ) {
		die('main->index');
	}
}

?>
