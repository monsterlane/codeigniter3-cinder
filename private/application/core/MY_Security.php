<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Security extends CI_Security {
	public function csrf_show_error( ) {
		$ci =& get_instance( );
		$ci->redirect( 'error/403' );
	}
}

?>