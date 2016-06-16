<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Session extends CI_Session {
	public function sess_write_close( ) {
		session_write_close( );
	}
}

?>
